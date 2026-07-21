// ============================================
// ADMIN PANEL – BOXENSTOPP SPEISEKARTE
// Authentication via Cloudflare Worker Proxy
// ============================================

let menuData = null;
let currentFileSha = null;
let editingCatIdx = null;
let sessionPassword = '';

// ── Config from settings.js ──────────────────
const PROXY_URL = (typeof SETTINGS !== 'undefined' && SETTINGS.proxyUrl)
    ? SETTINGS.proxyUrl
    : null;

// ── DOM References ────────────────────────────
const loginScreen = document.getElementById('login-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const saveBtn = document.getElementById('save-btn');
const saveStatus = document.getElementById('save-status');
const logoutBtn = document.getElementById('logout-btn');
const categoriesContainer = document.getElementById('categories-container');
const addCategoryBtn = document.getElementById('add-category-btn');
const itemModal = document.getElementById('item-modal');
const itemForm = document.getElementById('item-form');
const modalTitle = document.getElementById('modal-title');
const modalCancel = document.getElementById('modal-cancel');
const catModal = document.getElementById('cat-modal');
const catForm = document.getElementById('cat-form');
const catModalCancel = document.getElementById('cat-modal-cancel');

// ── White-Label Hydration ─────────────────────
(function hydrateAdminUI() {
    if (typeof SETTINGS === 'undefined') return;
    document.querySelectorAll('[data-hydrate]').forEach(el => {
        const key = el.dataset.hydrate;
        if (SETTINGS[key]) el.textContent = SETTINGS[key];
    });
})();

// ── Inline fallback data (used if fetch fails) ─────────────
const MENU_INLINE = { "settings": {}, "categories": [] };

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pw = document.getElementById('password').value;
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    loginError.classList.add('hidden');

    sessionPassword = pw;

    try {
        await loadMenu();
        loginScreen.classList.remove('active');
        dashboardScreen.classList.add('active');
    } catch (err) {
        sessionPassword = '';
        if (err.message.includes('401')) {
            loginError.textContent = 'Falsches Passwort!';
        } else {
            loginError.textContent = 'Fehler: ' + err.message;
        }
        loginError.classList.remove('hidden');
        document.getElementById('password').value = '';
    } finally {
        submitBtn.disabled = false;
    }
});

// Submit form on Enter key in password field
document.getElementById('password').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        if (submitBtn && !submitBtn.disabled) {
            submitBtn.click();
        }
    }
});

logoutBtn.addEventListener('click', () => {
    dashboardScreen.classList.remove('active');
    loginScreen.classList.add('active');
    document.getElementById('password').value = '';
    sessionPassword = '';
    menuData = null;
    currentFileSha = null;
    categoriesContainer.innerHTML = '';
});

// ── Proxy Request ─────────────────────────────
async function proxyRequest(method, body = null) {
    if (!PROXY_URL) throw new Error('Kein Proxy konfiguriert.');
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'X-Admin-Password': sessionPassword,
            'X-Menu-File': 'public/menu.json',
        },
    };
    if (body) options.body = JSON.stringify(body);

    const url = `${PROXY_URL}?t=${Date.now()}`;
    const res = await fetch(url, options);
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(`${res.status}: ${err.error || 'Request fehlgeschlagen'}`);
    }
    return res.json();
}

// ── Load Menu ─────────────────────────────────
async function loadMenu() {
    categoriesContainer.innerHTML = '<p style="padding:3rem;text-align:center;color:var(--text-muted);">Lade Speisekarte…</p>';

    const isLocal = location.protocol === 'file:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';

    // ── Online: Cloudflare Worker Proxy ──────────────────────
    if (PROXY_URL) {
        try {
            const fileData = await proxyRequest('GET');
            currentFileSha = fileData.sha;
            const decoded = decodeURIComponent(escape(atob(fileData.content.replace(/\n/g, ''))));
            menuData = JSON.parse(decoded);

            if (!menuData.settings) menuData.settings = {};

            categoriesContainer.innerHTML = '';
            renderDashboard();
            return;
        } catch (err) {
            if (err.message.startsWith('401:')) throw err;
            console.warn('Proxy-Fehler, Fallback auf lokale json:', err.message);
            // Fallthrough to local fetch
        }
    }

    // ── Local / Fallback Fetch (No Proxy) ───────────────
    try {
        const res = await fetch('/menu.json?t=' + Date.now());
        if (res.ok) {
            menuData = await res.json();
        } else {
            menuData = JSON.parse(JSON.stringify(MENU_INLINE));
        }
    } catch(e) {
        menuData = JSON.parse(JSON.stringify(MENU_INLINE));
    }

    currentFileSha = null;
    categoriesContainer.innerHTML = '';
    
    if (!PROXY_URL) {
        showConfigNotice('Kein Cloudflare-Proxy konfiguriert. Du befindest dich im Offline-Modus.');
    }
    renderDashboard();
}

function showConfigNotice(msg = '') {
    const notice = document.createElement('div');
    notice.className = 'config-notice';
    notice.innerHTML = `⚠️ <strong>Lokaler Modus:</strong> ${msg} Änderungen werden beim Speichern als Download (menu.json) bereitgestellt. Ersetze damit die Datei im Projektordner.`;
    categoriesContainer.appendChild(notice);
}

// ── Render Dashboard ──────────────────────────
function renderDashboard() {
    const notice = categoriesContainer.querySelector('.config-notice');
    categoriesContainer.innerHTML = '';
    if (notice) categoriesContainer.appendChild(notice);

    menuData.categories.forEach((cat, catIdx) => {
        const block = document.createElement('div');
        block.className = 'category-block';
        const catName = cat.name || 'Unbenannte Kategorie';
        const numStr = String(catIdx + 1).padStart(2, '0');

        block.innerHTML = `
            <div class="category-header">
                <div class="cat-label">
                    <span class="cat-num">${numStr}</span>
                    <span class="category-name">${catName}</span>
                </div>
                <div class="category-actions">
                    <button class="btn btn-ghost btn-sm edit-cat-btn" data-cat-idx="${catIdx}" title="Umbenennen">✏️</button>
                    <button class="btn btn-ghost btn-sm delete-cat-btn" data-cat-idx="${catIdx}" title="Löschen">🗑</button>
                </div>
            </div>
            <div class="item-list">
                ${cat.items.map((item, itemIdx) => renderItemRow(item, catIdx, itemIdx)).join('')}
            </div>
            <div class="add-item-wrap">
                <button class="btn btn-secondary add-item-btn" data-cat-idx="${catIdx}">+ Gericht hinzufügen</button>
            </div>
        `;
        categoriesContainer.appendChild(block);
    });

    document.querySelectorAll('.add-item-btn').forEach(btn =>
        btn.onclick = () => openItemModal(parseInt(btn.dataset.catIdx)));
    document.querySelectorAll('.edit-item-btn').forEach(btn =>
        btn.onclick = () => openItemModal(parseInt(btn.dataset.catIdx), parseInt(btn.dataset.itemIdx)));
    document.querySelectorAll('.delete-item-btn').forEach(btn =>
        btn.onclick = () => deleteItem(parseInt(btn.dataset.catIdx), parseInt(btn.dataset.itemIdx)));
    document.querySelectorAll('.toggle-special-btn').forEach(btn =>
        btn.onclick = () => toggleDailySpecial(parseInt(btn.dataset.catIdx), parseInt(btn.dataset.itemIdx)));
    document.querySelectorAll('.delete-cat-btn').forEach(btn =>
        btn.onclick = () => deleteCategory(parseInt(btn.dataset.catIdx)));
    document.querySelectorAll('.edit-cat-btn').forEach(btn =>
        btn.onclick = () => openCatModal(parseInt(btn.dataset.catIdx)));
}

function renderItemRow(item, catIdx, itemIdx) {
    const name = item.name || 'N/A';
    const soldOut = item.isSoldOut === true;
    const isSpecial = item.isDailySpecial === true;

    let badges = '';
    if (soldOut) badges += '<span class="badge-aus">AUSVERKAUFT</span>';
    if (item.isPopular) badges += '<span class="badge-hit">HIT</span>';
    if (item.isVegetarian) badges += '<span class="badge-veg">VEGGIE</span>';
    if (isSpecial) badges += '<span class="badge-special">🔥 TAGESANGEBOT</span>';

    return `
        <div class="item-row ${soldOut ? 'is-unavailable' : ''}">
            <div class="item-info">
                <div class="item-row-name">${name} ${badges}</div>
                <div class="item-row-desc">${item.description || ''}</div>
            </div>
            <div class="item-row-price">€ ${item.price}</div>
            <div class="item-actions">
                <button class="btn-icon toggle-special-btn ${isSpecial ? 'is-active-special' : ''}" data-cat-idx="${catIdx}" data-item-idx="${itemIdx}" title="${isSpecial ? 'Von Tagesangeboten entfernen' : 'Als Tagesangebot markieren'}">🔥</button>
                <button class="btn-icon edit-item-btn" data-cat-idx="${catIdx}" data-item-idx="${itemIdx}" title="Bearbeiten">✏️</button>
                <button class="btn-icon delete-item-btn" data-cat-idx="${catIdx}" data-item-idx="${itemIdx}" title="Löschen">🗑</button>
            </div>
        </div>`;
}

function toggleDailySpecial(catIdx, itemIdx) {
    const item = menuData.categories[catIdx].items[itemIdx];
    item.isDailySpecial = !item.isDailySpecial;
    renderDashboard();
    showSaveHint();
}

// ── Item Modal ────────────────────────────────
function openItemModal(catIdx, itemIdx = null) {
    document.getElementById('item-cat-id').value = catIdx;
    document.getElementById('item-index').value = itemIdx !== null ? itemIdx : '';
    itemForm.reset();
    document.getElementById('item-vegetarian').checked = false;
    document.getElementById('item-popular').checked = false;
    document.getElementById('item-available').checked = false;

    if (itemIdx !== null) {
        const item = menuData.categories[catIdx].items[itemIdx];
        modalTitle.textContent = 'Gericht bearbeiten';
        document.getElementById('item-name').value = item.name || '';
        document.getElementById('item-price').value = item.price || '';
        document.getElementById('item-available').checked = item.isSoldOut === true;
        document.getElementById('item-vegetarian').checked = item.isVegetarian === true;
        document.getElementById('item-popular').checked = item.isPopular === true;
        document.getElementById('item-desc').value = item.description || '';
    } else {
        modalTitle.textContent = 'Gericht hinzufügen';
    }
    itemModal.classList.remove('hidden');
}

modalCancel.onclick = () => itemModal.classList.add('hidden');
itemModal.addEventListener('click', e => { if (e.target === itemModal) itemModal.classList.add('hidden'); });

itemForm.onsubmit = (e) => {
    e.preventDefault();
    const catIdx = parseInt(document.getElementById('item-cat-id').value);
    const rawIdx = document.getElementById('item-index').value;
    const itemIdx = rawIdx !== '' ? parseInt(rawIdx) : null;

    const existingItem = itemIdx !== null ? menuData.categories[catIdx].items[itemIdx] : null;

    const newItem = {
        name: document.getElementById('item-name').value.trim(),
        price: document.getElementById('item-price').value.trim(),
        isSoldOut: document.getElementById('item-available').checked,
        isVegetarian: document.getElementById('item-vegetarian').checked,
        isPopular: document.getElementById('item-popular').checked,
        isDailySpecial: existingItem ? existingItem.isDailySpecial === true : false,
        description: document.getElementById('item-desc').value.trim()
    };

    if (itemIdx !== null) {
        menuData.categories[catIdx].items[itemIdx] = newItem;
    } else {
        menuData.categories[catIdx].items.push(newItem);
    }

    itemModal.classList.add('hidden');
    renderDashboard();
    showSaveHint();
};

function deleteItem(catIdx, itemIdx) {
    if (confirm('Gericht wirklich löschen?')) {
        menuData.categories[catIdx].items.splice(itemIdx, 1);
        renderDashboard();
        showSaveHint();
    }
}

// ── Category Modal ─────────────────────────────
function openCatModal(catIdx = null) {
    editingCatIdx = catIdx;
    catForm.reset();
    if (catIdx !== null) {
        document.getElementById('cat-name').value = menuData.categories[catIdx].name || '';
    }
    catModal.classList.remove('hidden');
}

addCategoryBtn.onclick = () => openCatModal();
catModalCancel.onclick = () => catModal.classList.add('hidden');
catModal.addEventListener('click', e => { if (e.target === catModal) catModal.classList.add('hidden'); });

catForm.onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById('cat-name').value.trim();

    if (editingCatIdx !== null) {
        menuData.categories[editingCatIdx].name = name;
    } else {
        const id = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        menuData.categories.push({ id, name, items: [] });
    }
    catModal.classList.add('hidden');
    renderDashboard();
    showSaveHint();
};

function deleteCategory(catIdx) {
    const catName = menuData.categories[catIdx]?.name || 'Kategorie';
    if (confirm(`"${catName}" wirklich löschen? Alle Gerichte werden entfernt.`)) {
        menuData.categories.splice(catIdx, 1);
        renderDashboard();
        showSaveHint();
    }
}

// ── Save ───────────────────────────────────────
function showSaveHint() {
    saveStatus.textContent = '● Ungespeicherte Änderungen';
    saveStatus.style.color = 'var(--yellow)';
}

saveBtn.onclick = async () => {
    const jsonStr = JSON.stringify(menuData, null, 2);

    if (PROXY_URL && currentFileSha) {
        saveBtn.disabled = true;
        saveStatus.textContent = 'Speichern…';
        saveStatus.style.color = 'var(--text-muted)';
        try {
            const content = btoa(unescape(encodeURIComponent(jsonStr)));
            const res = await proxyRequest('POST', { content, sha: currentFileSha });
            currentFileSha = res.content?.sha || currentFileSha;
            saveStatus.textContent = '✓ Live gespeichert (in ~30s aktuell)';
            saveStatus.style.color = '#16a34a';
        } catch (err) {
            saveStatus.textContent = '❌ Fehler: ' + err.message;
            saveStatus.style.color = 'var(--danger)';
        } finally {
            saveBtn.disabled = false;
            setTimeout(() => { saveStatus.textContent = ''; }, 5000);
        }
        return;
    }

    // Fallback: Download JSON File
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'menu.json';
    a.click();
    URL.revokeObjectURL(url);
    saveStatus.textContent = '✓ Als Datei heruntergeladen – im Projektordner ("public/") ersetzen!';
    saveStatus.style.color = '#16a34a';
    setTimeout(() => { saveStatus.textContent = ''; }, 6000);
};

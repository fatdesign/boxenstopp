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
const hoursContainer = document.getElementById('hours-container');
const contactNameInput = document.getElementById('contact-name');
const contactSloganInput = document.getElementById('contact-slogan');
const contactPhoneInput = document.getElementById('contact-phone');
const contactStreetInput = document.getElementById('contact-street');
const contactZipInput = document.getElementById('contact-zip');
const contactCityInput = document.getElementById('contact-city');
const itemImageFile = document.getElementById('item-image-file');
const itemImageHidden = document.getElementById('item-image');
const itemImagePreview = document.getElementById('item-image-preview');
const itemImagePlaceholder = document.getElementById('image-preview-placeholder');
const imageUploadStatus = document.getElementById('image-upload-status');
const itemImageDelete = document.getElementById('item-image-delete');

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

const DAY_LABELS = [
    { key: 'monday', label: 'Montag' },
    { key: 'tuesday', label: 'Dienstag' },
    { key: 'wednesday', label: 'Mittwoch' },
    { key: 'thursday', label: 'Donnerstag' },
    { key: 'friday', label: 'Freitag' },
    { key: 'saturday', label: 'Samstag' },
    { key: 'sunday', label: 'Sonntag' },
];

function defaultOpeningHours() {
    return {
        monday: { open: '08:00', close: '18:00' },
        tuesday: { open: '08:00', close: '18:00' },
        wednesday: { open: '08:00', close: '18:00' },
        thursday: { open: '08:00', close: '18:00' },
        friday: { open: '08:00', close: '18:00' },
        saturday: { open: '09:00', close: '14:00' },
        sunday: null,
    };
}

function defaultContactInfo() {
    return {
        name: 'BOXENSTOPP im Handelszentrum',
        slogan: 'Schnell. Heiss. Lecker.',
        phone: '+43 662 123456',
        address: { street: 'Handelszentrum 4', city: 'Bergheim bei Salzburg', zip: '5101' },
    };
}

function seedContactDefaults(settings) {
    const defaults = defaultContactInfo();
    if (!settings.name) settings.name = defaults.name;
    if (!settings.slogan) settings.slogan = defaults.slogan;
    if (!settings.phone) settings.phone = defaults.phone;
    if (!settings.address) settings.address = defaults.address;
}

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
            if (!menuData.settings.openingHours) menuData.settings.openingHours = defaultOpeningHours();
            seedContactDefaults(menuData.settings);

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
        const res = await fetch('../menu.json?t=' + Date.now());
        if (res.ok) {
            menuData = await res.json();
        } else {
            menuData = JSON.parse(JSON.stringify(MENU_INLINE));
        }
    } catch(e) {
        menuData = JSON.parse(JSON.stringify(MENU_INLINE));
    }

    if (!menuData.settings) menuData.settings = {};
    if (!menuData.settings.openingHours) menuData.settings.openingHours = defaultOpeningHours();
    seedContactDefaults(menuData.settings);

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
    renderOpeningHours();
    renderContactInfo();

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
                    <button class="btn btn-ghost btn-sm edit-cat-btn" data-cat-idx="${catIdx}" title="Umbenennen" aria-label="Kategorie umbenennen">✏️</button>
                    <button class="btn btn-ghost btn-sm delete-cat-btn" data-cat-idx="${catIdx}" title="Löschen" aria-label="Kategorie löschen">🗑</button>
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
    if (isSpecial) badges += '<span class="badge-special" style="display:inline-flex; align-items:center; gap:3px;"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z"/></svg> TAGESANGEBOT</span>';
    if (Array.isArray(item.specialDays) && item.specialDays.length > 0) {
        const dayShort = { monday: 'MO', tuesday: 'DI', wednesday: 'MI', thursday: 'DO', friday: 'FR', saturday: 'SA', sunday: 'SO' };
        const label = item.specialDays.map(d => dayShort[d] || d).join(', ');
        badges += `<span class="badge-special" style="background:#ea580c;">NUR ${label}</span>`;
    }
    if (Array.isArray(item.allergens) && item.allergens.length > 0) {
        badges += `<span class="badge-allergen" style="font-size:0.65rem; font-weight:800; color:var(--text-muted); background:rgba(0,0,0,0.06); padding:2px 6px; border-radius:4px; margin-left:8px; letter-spacing:0.05em;">[${item.allergens.join(', ')}]</span>`;
    }

    return `
        <div class="item-row ${soldOut ? 'is-unavailable' : ''}">
            <div class="item-info">
                <div class="item-row-name">${name} ${badges}</div>
                <div class="item-row-desc">${item.description || ''}</div>
            </div>
            <div class="item-row-price">€ ${item.price}</div>
            <div class="item-actions">
                <button class="btn-icon toggle-special-btn ${isSpecial ? 'is-active-special' : ''}" data-cat-idx="${catIdx}" data-item-idx="${itemIdx}" title="${isSpecial ? 'Von Tagesangeboten entfernen' : 'Als Tagesangebot markieren'}" aria-label="${isSpecial ? 'Von Tagesangeboten entfernen' : 'Als Tagesangebot markieren'}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z"/></svg>
                </button>
                <button class="btn-icon edit-item-btn" data-cat-idx="${catIdx}" data-item-idx="${itemIdx}" title="Bearbeiten" aria-label="Gericht bearbeiten">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                </button>
                <button class="btn-icon delete-item-btn" data-cat-idx="${catIdx}" data-item-idx="${itemIdx}" title="Löschen" aria-label="Gericht löschen">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
            </div>
        </div>`;
}

function toggleDailySpecial(catIdx, itemIdx) {
    const item = menuData.categories[catIdx].items[itemIdx];
    item.isDailySpecial = !item.isDailySpecial;
    renderDashboard();
    showSaveHint();
}

// ── Opening Hours ───────────────────────────────
function renderOpeningHours() {
    if (!menuData.settings) menuData.settings = {};
    if (!menuData.settings.openingHours) menuData.settings.openingHours = defaultOpeningHours();
    const openingHours = menuData.settings.openingHours;

    hoursContainer.innerHTML = DAY_LABELS.map(day => {
        const hours = openingHours[day.key];
        const closed = !hours;
        const open = hours ? hours.open : '08:00';
        const close = hours ? hours.close : '18:00';
        return `
            <div class="hours-row">
                <span class="hours-day">${day.label}</span>
                <label class="check-label hours-closed-toggle">
                    <input type="checkbox" class="hours-closed-checkbox" data-day="${day.key}" ${closed ? 'checked' : ''}>
                    <span>Geschlossen</span>
                </label>
                <div class="hours-time-inputs ${closed ? 'is-disabled' : ''}">
                    <input type="time" class="hours-open-input" data-day="${day.key}" value="${open}" ${closed ? 'disabled' : ''}>
                    <span>–</span>
                    <input type="time" class="hours-close-input" data-day="${day.key}" value="${close}" ${closed ? 'disabled' : ''}>
                </div>
            </div>`;
    }).join('');

    document.querySelectorAll('.hours-closed-checkbox').forEach(cb =>
        cb.onchange = () => toggleDayClosed(cb.dataset.day, cb.checked));
    document.querySelectorAll('.hours-open-input').forEach(input =>
        input.onchange = () => updateDayTime(input.dataset.day, 'open', input.value));
    document.querySelectorAll('.hours-close-input').forEach(input =>
        input.onchange = () => updateDayTime(input.dataset.day, 'close', input.value));
}

function toggleDayClosed(day, closed) {
    menuData.settings.openingHours[day] = closed ? null : { open: '08:00', close: '18:00' };
    renderOpeningHours();
    showSaveHint();
}

function updateDayTime(day, field, value) {
    if (!menuData.settings.openingHours[day]) {
        menuData.settings.openingHours[day] = { open: '08:00', close: '18:00' };
    }
    menuData.settings.openingHours[day][field] = value;
    showSaveHint();
}

// ── Contact Info ─────────────────────────────────
function renderContactInfo() {
    if (!menuData.settings) menuData.settings = {};
    seedContactDefaults(menuData.settings);
    const s = menuData.settings;

    contactNameInput.value = s.name || '';
    contactSloganInput.value = s.slogan || '';
    contactPhoneInput.value = s.phone || '';
    contactStreetInput.value = s.address.street || '';
    contactZipInput.value = s.address.zip || '';
    contactCityInput.value = s.address.city || '';
}

[
    [contactNameInput, 'name'],
    [contactSloganInput, 'slogan'],
    [contactPhoneInput, 'phone'],
].forEach(([input, field]) => {
    input.addEventListener('input', () => {
        menuData.settings[field] = input.value;
        showSaveHint();
    });
});

[
    [contactStreetInput, 'street'],
    [contactZipInput, 'zip'],
    [contactCityInput, 'city'],
].forEach(([input, field]) => {
    input.addEventListener('input', () => {
        if (!menuData.settings.address) menuData.settings.address = {};
        menuData.settings.address[field] = input.value;
        showSaveHint();
    });
});

// ── Image Upload ─────────────────────────────────
function setImagePreview(url) {
    if (url) {
        itemImagePreview.src = url;
        itemImagePreview.style.display = 'block';
        itemImagePlaceholder.style.display = 'none';
        if (itemImageDelete) itemImageDelete.style.display = 'inline-flex';
    } else {
        itemImagePreview.style.display = 'none';
        itemImagePlaceholder.style.display = 'flex';
        if (itemImageDelete) itemImageDelete.style.display = 'none';
    }
}

async function uploadImage(file) {
    const res = await fetch(`${PROXY_URL}/upload`, {
        method: 'POST',
        headers: {
            'X-Admin-Password': sessionPassword,
            'X-File-Name': file.name,
            'Content-Type': file.type,
        },
        body: file,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `${res.status}`);
    }
    const data = await res.json();
    return data.url;
}

itemImageFile.addEventListener('change', async () => {
    const file = itemImageFile.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        imageUploadStatus.textContent = 'Bitte eine Bilddatei wählen.';
        imageUploadStatus.style.color = 'var(--danger)';
        itemImageFile.value = '';
        return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
        imageUploadStatus.textContent = 'Datei zu groß (max. 5 MB).';
        imageUploadStatus.style.color = 'var(--danger)';
        itemImageFile.value = '';
        return;
    }
    if (!PROXY_URL) {
        imageUploadStatus.textContent = 'Bild-Upload nur im Online-Modus verfügbar.';
        imageUploadStatus.style.color = 'var(--danger)';
        itemImageFile.value = '';
        return;
    }

    imageUploadStatus.textContent = 'Lädt hoch…';
    imageUploadStatus.style.color = 'var(--text-muted)';
    itemImageFile.disabled = true;

    try {
        const url = await uploadImage(file);
        itemImageHidden.value = url;
        setImagePreview(url);
        imageUploadStatus.textContent = '✓ Bild hochgeladen';
        imageUploadStatus.style.color = '#16a34a';
        showSaveHint();
    } catch (err) {
        imageUploadStatus.textContent = '❌ Fehler: ' + err.message;
        imageUploadStatus.style.color = 'var(--danger)';
    } finally {
        itemImageFile.disabled = false;
        itemImageFile.value = '';
    }
});

if (itemImageDelete) {
    itemImageDelete.addEventListener('click', () => {
        itemImageHidden.value = '';
        setImagePreview('');
        imageUploadStatus.textContent = 'Bild entfernt.';
        imageUploadStatus.style.color = 'var(--text-muted)';
        itemImageFile.value = '';
        showSaveHint();
    });
}

// ── Item Modal ────────────────────────────────
function openItemModal(catIdx, itemIdx = null) {
    document.getElementById('item-cat-id').value = catIdx;
    document.getElementById('item-index').value = itemIdx !== null ? itemIdx : '';
    itemForm.reset();
    document.getElementById('item-vegetarian').checked = false;
    document.getElementById('item-popular').checked = false;
    document.getElementById('item-available').checked = false;
    document.querySelectorAll('input[name="item-allergen"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('input[name="item-special-day"]').forEach(cb => cb.checked = false);
    itemImageHidden.value = '';
    imageUploadStatus.textContent = '';
    setImagePreview('');

    if (itemIdx !== null) {
        const item = menuData.categories[catIdx].items[itemIdx];
        modalTitle.textContent = 'Gericht bearbeiten';
        document.getElementById('item-name').value = item.name || '';
        document.getElementById('item-price').value = item.price || '';
        document.getElementById('item-available').checked = item.isSoldOut === true;
        document.getElementById('item-vegetarian').checked = item.isVegetarian === true;
        document.getElementById('item-popular').checked = item.isPopular === true;
        document.getElementById('item-desc').value = item.description || '';
        itemImageHidden.value = item.image || '';
        setImagePreview(item.image || '');

        const itemAllergens = Array.isArray(item.allergens) ? item.allergens : [];
        document.querySelectorAll('input[name="item-allergen"]').forEach(cb => {
            cb.checked = itemAllergens.includes(cb.value);
        });

        const itemSpecialDays = Array.isArray(item.specialDays) ? item.specialDays : [];
        document.querySelectorAll('input[name="item-special-day"]').forEach(cb => {
            cb.checked = itemSpecialDays.includes(cb.value);
        });
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

    const selectedAllergens = Array.from(document.querySelectorAll('input[name="item-allergen"]:checked')).map(cb => cb.value);
    const selectedSpecialDays = Array.from(document.querySelectorAll('input[name="item-special-day"]:checked')).map(cb => cb.value);

    const newItem = {
        name: document.getElementById('item-name').value.trim(),
        price: document.getElementById('item-price').value.trim(),
        isSoldOut: document.getElementById('item-available').checked,
        isVegetarian: document.getElementById('item-vegetarian').checked,
        isPopular: document.getElementById('item-popular').checked,
        isDailySpecial: existingItem ? existingItem.isDailySpecial === true : false,
        specialDays: selectedSpecialDays,
        image: itemImageHidden.value.trim(),
        allergens: selectedAllergens,
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

// Cloudflare Worker for Boxenstopp Admin Dashboard & dynamic menu
// Connects to a Cloudflare D1 SQLite database named 'boxenstopp-db' (bound to env.DB)

const DEFAULT_MENU = {
  "settings": {
    "name": "BOXENSTOPP im Handelszentrum",
    "slogan": "Schnell. Heiss. Lecker.",
    "phone": "+43 662 123456",
    "address": {
      "street": "Handelszentrum 4",
      "city": "Bergheim bei Salzburg",
      "zip": "5101"
    },
    "openingHours": {
      "monday": { "open": "08:00", "close": "18:00" },
      "tuesday": { "open": "08:00", "close": "18:00" },
      "wednesday": { "open": "08:00", "close": "18:00" },
      "thursday": { "open": "08:00", "close": "18:00" },
      "friday": { "open": "08:00", "close": "18:00" },
      "saturday": { "open": "09:00", "close": "14:00" },
      "sunday": null
    }
  },
  "categories": [
    {
      "id": "warme-snacks",
      "name": "Warme Snacks",
      "items": [
        {
          "name": "Leberkäse-Semmel",
          "description": "Klassiker, heiß aus dem Ofen.",
          "price": "3.80",
          "isSoldOut": false,
          "isPopular": true,
          "isVegetarian": false,
          "isDailySpecial": false,
          "allergens": ["A", "C", "G"]
        },
        {
          "name": "Bosna",
          "description": "Bratwurst, Zwiebel, Senf & Curry.",
          "price": "4.50",
          "isSoldOut": false,
          "isPopular": false,
          "isVegetarian": false,
          "isDailySpecial": false,
          "allergens": ["A", "M"]
        },
        {
          "name": "Käsekrainer im Weckerl",
          "description": "Mit Senf oder Ketchup.",
          "price": "4.90",
          "isSoldOut": false,
          "isPopular": false,
          "isVegetarian": false,
          "isDailySpecial": false,
          "allergens": ["A", "G", "M"]
        },
        {
          "name": "Currywurst",
          "description": "Mit hauseigener Currysauce.",
          "price": "5.50",
          "isSoldOut": false,
          "isPopular": false,
          "isVegetarian": false,
          "isDailySpecial": false,
          "allergens": ["F", "M"]
        }
      ]
    },
    {
      "id": "burger",
      "name": "Burger & Klassiker",
      "items": [
        {
          "name": "Boxenstopp-Burger",
          "description": "Rind, Cheddar, Salat, Haussauce.",
          "price": "8.90",
          "isSoldOut": false,
          "isPopular": true,
          "isVegetarian": false,
          "isDailySpecial": true,
          "allergens": ["A", "C", "G", "N"]
        },
        {
          "name": "Cheeseburger",
          "description": "Der Klassiker, kompromisslos.",
          "price": "7.90",
          "isSoldOut": false,
          "isPopular": false,
          "isVegetarian": false,
          "isDailySpecial": false,
          "allergens": ["A", "G", "N"]
        },
        {
          "name": "Crispy-Chicken-Burger",
          "description": "Knuspriges Hähnchen, Coleslaw.",
          "price": "8.50",
          "isSoldOut": false,
          "isPopular": false,
          "isVegetarian": false,
          "isDailySpecial": false,
          "allergens": ["A", "C", "G", "M"]
        },
        {
          "name": "Veggie-Burger",
          "description": "Pflanzlich, voller Geschmack.",
          "price": "8.90",
          "isSoldOut": false,
          "isPopular": false,
          "isVegetarian": true,
          "isDailySpecial": false,
          "allergens": ["A", "F", "N"]
        }
      ]
    },
    {
      "id": "beilagen",
      "name": "Beilagen",
      "items": [
        {
          "name": "Pommes frites",
          "description": "Goldgelb & knusprig.",
          "price": "3.50",
          "isSoldOut": false,
          "isPopular": false,
          "isVegetarian": true,
          "isDailySpecial": false,
          "allergens": []
        },
        {
          "name": "Süßkartoffel-Pommes",
          "description": "Knusprige Süßkartoffeln.",
          "price": "4.50",
          "isSoldOut": false,
          "isPopular": false,
          "isVegetarian": true,
          "isDailySpecial": false,
          "allergens": []
        },
        {
          "name": "Wedges",
          "description": "Mit Sour-Cream-Dip.",
          "price": "4.20",
          "isSoldOut": false,
          "isPopular": false,
          "isVegetarian": true,
          "isDailySpecial": false,
          "allergens": ["G"]
        }
      ]
    },
    {
      "id": "getraenke",
      "name": "Getränke",
      "items": [
        {
          "name": "Softdrinks",
          "description": "Cola, Limo & Co.",
          "price": "2.50",
          "isSoldOut": false,
          "isPopular": false,
          "isVegetarian": true,
          "isDailySpecial": false,
          "allergens": []
        },
        {
          "name": "Mineralwasser",
          "description": "Still oder prickelnd.",
          "price": "2.00",
          "isSoldOut": false,
          "isPopular": false,
          "isVegetarian": true,
          "isDailySpecial": false,
          "allergens": []
        },
        {
          "name": "Kaffee",
          "description": "Für den schnellen Wachmacher.",
          "price": "2.80",
          "isSoldOut": false,
          "isPopular": false,
          "isVegetarian": true,
          "isDailySpecial": false,
          "allergens": ["G"]
        },
        {
          "name": "Energy & Eistee",
          "description": "Erfrischende Kaltgetränke.",
          "price": "3.00",
          "isSoldOut": false,
          "isPopular": false,
          "isVegetarian": true,
          "isDailySpecial": false,
          "allergens": []
        }
      ]
    }
  ]
};

// Helper for CORS headers
function getCorsHeaders(request) {
  const origin = request.headers.get("Origin") || "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Password, X-Menu-File, X-File-Name",
    "Access-Control-Max-Age": "86400",
  };
}

// Derive a safe file extension from the uploaded filename or its content type
function getExtension(fileName, contentType) {
  if (fileName && fileName.includes(".")) {
    const ext = fileName.split(".").pop().toLowerCase().replace(/[^a-z0-9]/g, "");
    if (ext) return ext;
  }
  const map = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  return map[contentType] || "jpg";
}

export default {
  async fetch(request, env) {
    const corsHeaders = getCorsHeaders(request);
    const url = new URL(request.url);

    // Handle Preflight OPTIONS request
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    try {
      // ── Image Upload (Cloudflare R2, bound as env.ASSETS) ──────────────
      if (url.pathname === "/upload" && request.method === "POST") {
        const clientPassword = request.headers.get("X-Admin-Password");
        if (!clientPassword || clientPassword !== env.ADMIN_PASSWORD) {
          return new Response(JSON.stringify({ error: "401 Unauthorized" }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (!env.ASSETS) {
          return new Response(JSON.stringify({ error: "Kein R2-Bucket gebunden (ASSETS)." }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const contentType = request.headers.get("Content-Type") || "application/octet-stream";
        const fileName = request.headers.get("X-File-Name") || "";
        const ext = getExtension(fileName, contentType);
        const key = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

        await env.ASSETS.put(key, request.body, { httpMetadata: { contentType } });

        return new Response(JSON.stringify({ url: `${url.origin}/assets/${key}` }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // ── Serve uploaded images from R2 ───────────────────────────────────
      if (url.pathname.startsWith("/assets/") && request.method === "GET") {
        if (!env.ASSETS) {
          return new Response("Not found", { status: 404, headers: corsHeaders });
        }
        const key = url.pathname.replace("/assets/", "");
        const object = await env.ASSETS.get(key);
        if (!object) {
          return new Response("Not found", { status: 404, headers: corsHeaders });
        }
        return new Response(object.body, {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": object.httpMetadata?.contentType || "application/octet-stream",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }

      // ── Pre-Order → Telegram ─────────────────────────────────────────
      if (url.pathname === "/order" && request.method === "POST") {
        const telegramToken = env.TELEGRAM_API || env.TELEGRAM_BOT_TOKEN;
        if (!telegramToken) {
          return new Response(JSON.stringify({ error: "Vorbestellungen sind aktuell nicht verfügbar." }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        let body;
        try {
          body = await request.json();
        } catch {
          return new Response(JSON.stringify({ error: "Ungültige Anfrage." }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const name = (body.name || "").toString().trim().slice(0, 100);
        const phone = (body.phone || "").toString().trim().slice(0, 40);
        const pickupTime = (body.pickupTime || "So schnell wie möglich").toString().trim().slice(0, 50);
        const note = (body.note || "").toString().trim().slice(0, 300);
        const items = Array.isArray(body.items) ? body.items.slice(0, 30) : [];

        if (!name || !phone || items.length === 0) {
          return new Response(
            JSON.stringify({ error: "Name, Telefonnummer und mindestens ein Artikel sind erforderlich." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const escapeHtml = (str) =>
          str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        let total = 0;
        const itemLines = items.map((it) => {
          const qty = Math.max(1, Math.min(20, parseInt(it.qty, 10) || 1));
          const price = parseFloat(it.price) || 0;
          total += qty * price;
          const itemName = escapeHtml((it.name || "Artikel").toString().slice(0, 80));
          return `• ${qty}× ${itemName} — € ${(qty * price).toFixed(2)}`;
        }).join("\n");

        const messageParts = [
          "🏁 <b>Neue Vorbestellung – BOXENSTOPP</b>",
          "",
          `👤 <b>Name:</b> ${escapeHtml(name)}`,
          `📞 <b>Telefon:</b> ${escapeHtml(phone)}`,
          `⏰ <b>Abholung:</b> ${escapeHtml(pickupTime)}`,
          "",
          "🛒 <b>Bestellung:</b>",
          itemLines,
          "",
          `💰 <b>Gesamt:</b> € ${total.toFixed(2)}`,
        ];
        if (note) {
          messageParts.push("", `📝 <b>Anmerkung:</b> ${escapeHtml(note)}`);
        }
        const message = messageParts.join("\n");

        const chatId = env.TELEGRAM_CHAT_ID || "-5156182561";
        const tgRes = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "HTML" }),
        });

        if (!tgRes.ok) {
          const tgErr = await tgRes.text();
          console.error("Telegram-Fehler:", tgErr);
          return new Response(JSON.stringify({ error: "Bestellung konnte nicht zugestellt werden. Bitte ruf uns direkt an." }), {
            status: 502,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // 1. Ensure D1 DB Table exists
      await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS menu_store (
          id TEXT PRIMARY KEY,
          content_base64 TEXT NOT NULL,
          sha TEXT NOT NULL,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `).run();

      // 2. Fetch current menu from D1
      let dbRecord = await env.DB.prepare("SELECT * FROM menu_store LIMIT 1").first();

      // 3. Auto-seed if database is empty
      if (!dbRecord) {
        const initialJson = JSON.stringify(DEFAULT_MENU);
        // base64 encode using native web standards
        const initialBase64 = btoa(unescape(encodeURIComponent(initialJson)));
        const initialSha = "initial_seed";

        await env.DB.prepare(
          "INSERT INTO menu_store (id, content_base64, sha) VALUES (?, ?, ?)"
        ).bind("current_menu", initialBase64, initialSha).run();

        dbRecord = {
          id: "current_menu",
          content_base64: initialBase64,
          sha: initialSha
        };
      }

      // Handle GET Request
      if (request.method === "GET") {
        // If request is from admin dashboard (requesting base64 wrapper)
        if (request.headers.get("X-Menu-File")) {
          // Authenticate with X-Admin-Password header against env secret
          const clientPassword = request.headers.get("X-Admin-Password");
          const adminPasswordSecret = env.ADMIN_PASSWORD;

          if (!clientPassword || clientPassword !== adminPasswordSecret) {
            return new Response(JSON.stringify({ error: "401 Unauthorized" }), {
              status: 401,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }

          return new Response(
            JSON.stringify({
              sha: dbRecord.sha,
              content: dbRecord.content_base64,
            }),
            {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        // If request is from public website (requesting raw JSON menu)
        const rawJsonString = decodeURIComponent(escape(atob(dbRecord.content_base64)));
        return new Response(rawJsonString, {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
        });
      }

      // Handle POST Request (Saving menu)
      if (request.method === "POST") {
        // Authenticate with X-Admin-Password header against env secret
        const clientPassword = request.headers.get("X-Admin-Password");
        const adminPasswordSecret = env.ADMIN_PASSWORD;

        if (!clientPassword || clientPassword !== adminPasswordSecret) {
          return new Response(JSON.stringify({ error: "401 Unauthorized" }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const body = await request.json();
        if (!body.content) {
          return new Response(JSON.stringify({ error: "Missing content parameter" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const newSha = "sha_" + Date.now();

        // Update database record
        await env.DB.prepare(
          "UPDATE menu_store SET content_base64 = ?, sha = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
        ).bind(body.content, newSha, "current_menu").run();

        return new Response(
          JSON.stringify({
            content: {
              sha: newSha,
            },
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message || err.toString() }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  },
};

// Cloudflare Worker for Boxenstopp Admin Dashboard & dynamic menu
// Connects to a Cloudflare D1 SQLite database named 'boxenstopp-db' (bound to env.DB)

const DEFAULT_MENU = {
  "settings": {},
  "dailySpecials": [
    {
      "title": "Mittagsmenü",
      "description": "Hauptspeise + Beilage + Getränk.",
      "price": ""
    },
    {
      "title": "Snack-Deal",
      "description": "Heißer Snack + Pommes + Getränk.",
      "price": ""
    },
    {
      "title": "Frische des Tages",
      "description": "Tagesaktuelle Special-Burger oder Salate.",
      "price": ""
    }
  ],
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
          "isVegetarian": false
        },
        {
          "name": "Bosna",
          "description": "Bratwurst, Zwiebel, Senf & Curry.",
          "price": "4.50",
          "isSoldOut": false,
          "isPopular": false,
          "isVegetarian": false
        },
        {
          "name": "Käsekrainer im Weckerl",
          "description": "Mit Senf oder Ketchup.",
          "price": "4.90",
          "isSoldOut": false,
          "isPopular": false,
          "isVegetarian": false
        },
        {
          "name": "Currywurst",
          "description": "Mit hauseigener Currysauce.",
          "price": "5.50",
          "isSoldOut": false,
          "isPopular": false,
          "isVegetarian": false
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
          "isVegetarian": false
        },
        {
          "name": "Cheeseburger",
          "description": "Der Klassiker, kompromisslos.",
          "price": "7.90",
          "isSoldOut": false,
          "isPopular": false,
          "isVegetarian": false
        },
        {
          "name": "Crispy-Chicken-Burger",
          "description": "Knuspriges Hähnchen, Coleslaw.",
          "price": "8.50",
          "isSoldOut": false,
          "isPopular": false,
          "isVegetarian": false
        },
        {
          "name": "Veggie-Burger",
          "description": "Pflanzlich, voller Geschmack.",
          "price": "8.90",
          "isSoldOut": false,
          "isPopular": false,
          "isVegetarian": true
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
          "isVegetarian": true
        },
        {
          "name": "Süßkartoffel-Pommes",
          "description": "Knusprige Süßkartoffeln.",
          "price": "4.50",
          "isSoldOut": false,
          "isPopular": false,
          "isVegetarian": true
        },
        {
          "name": "Wedges",
          "description": "Mit Sour-Cream-Dip.",
          "price": "4.20",
          "isSoldOut": false,
          "isPopular": false,
          "isVegetarian": true
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
          "isVegetarian": true
        },
        {
          "name": "Mineralwasser",
          "description": "Still oder prickelnd.",
          "price": "2.00",
          "isSoldOut": false,
          "isPopular": false,
          "isVegetarian": true
        },
        {
          "name": "Kaffee",
          "description": "Für den schnellen Wachmacher.",
          "price": "2.80",
          "isSoldOut": false,
          "isPopular": false,
          "isVegetarian": true
        },
        {
          "name": "Energy & Eistee",
          "description": "Erfrischende Kaltgetränke.",
          "price": "3.00",
          "isSoldOut": false,
          "isPopular": false,
          "isVegetarian": true
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
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Password, X-Menu-File",
    "Access-Control-Max-Age": "86400",
  };
}

export default {
  async fetch(request, env) {
    const corsHeaders = getCorsHeaders(request);

    // Handle Preflight OPTIONS request
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    try {
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

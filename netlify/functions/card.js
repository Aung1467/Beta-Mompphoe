import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore("pocket_money_cards");
  const url = new URL(req.url);

  if (req.method === "POST") {
    try {
      const data = await req.json();
      const id = Math.random().toString(36).substring(2, 8).toUpperCase();
      await store.setJSON(id, data);
      return new Response(JSON.stringify({ success: true, id }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  if (req.method === "GET") {
    const id = url.searchParams.get("id");
    if (!id) {
      return new Response(JSON.stringify({ error: "Missing ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    try {
      const cardData = await store.get(id, { type: "json" });
      if (!cardData) {
        return new Response(JSON.stringify({ error: "Card not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
      return new Response(JSON.stringify(cardData), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = {
  path: "/api/card"
};

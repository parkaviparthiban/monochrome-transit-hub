import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { convertToModelMessages, streamText, type UIMessage } from "npm:ai";
import { createLovableAiGatewayProvider } from "../_shared/ai-gateway.ts";

const SYSTEM_PROMPT = `You are the BharatRail&Air Reservation Assistant, a friendly support agent for an Indian airline + railway booking platform.

SCOPE — only help with:
- Booking flights and trains across India (search, fares in ₹, classes, timings)
- Indian airports (DEL, BOM, BLR, MAA, CCU, HYD, COK, GOI, AMD, PNQ, JAI, LKO, IXC, SXR, GAU) and stations (NDLS, CSMT, MAS, HWH, SBC, SC, PUNE, ADI, JP, LKO, BPL, BBS, TVC, ERS)
- Carriers: IndiGo, Air India, Vistara, SpiceJet, Akasa Air, Air India Express; Vande Bharat, Rajdhani, Shatabdi, Duronto, Tejas, Garib Rath
- Seat selection, passenger details, PNR/booking reference, cancellation, refunds, baggage, check-in
- Schedule, routes, fare classes (Economy / Premium / First / AC / Sleeper)
- How to use the BharatRail&Air website (search panel, results, My Trips)

RULES:
- Politely decline anything unrelated (general chit-chat, news, code help, medical, legal, etc.) and steer back to reservations.
- Always quote prices in Indian Rupees (₹) with Indian number formatting.
- Use IST for times.
- Keep answers concise, use markdown lists when helpful.
- If a user wants to actually book, point them to the search panel on the home page.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { messages } = (await req.json()) as { messages: UIMessage[] };

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing LOVABLE_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const gateway = createLovableAiGatewayProvider(apiKey);
    const model = gateway("google/gemini-3-flash-preview");

    const result = streamText({
      model,
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse({ headers: corsHeaders });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    const status = msg.includes("429") ? 429 : msg.includes("402") ? 402 : 500;
    return new Response(JSON.stringify({ error: msg }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

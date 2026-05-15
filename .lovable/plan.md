# Add Reservation Assistant Chatbot

A floating chat widget pinned to the bottom-right of every page. It answers reservation-related questions (booking, cancelling, seats, fares, schedules, baggage, refunds, PNR, etc.) using a real AI model — not hardcoded replies.

## What gets built

### 1. Backend (Lovable Cloud edge function)
- Enable Lovable Cloud (provisions backend + `LOVABLE_API_KEY` automatically).
- New edge function `supabase/functions/chat/index.ts`:
  - Accepts `{ messages: UIMessage[] }`.
  - Uses AI SDK (`streamText`) via Lovable AI Gateway with `google/gemini-3-flash-preview` (free, fast).
  - System prompt scopes the assistant to **BharatRail&Air reservation help only** — flights/trains in India, booking flow, seat selection, fares (₹), cancellation, refunds, PNR, baggage, schedules, stations/airports. Politely declines unrelated questions.
  - Streams responses; handles 429 (rate limit) and 402 (credits) with clear errors.
  - CORS headers included.

### 2. Frontend chatbot widget
- New `src/components/ChatBot.tsx` — floating bottom-right launcher button + collapsible chat panel.
- Mounted once in `src/pages/Index.tsx` (and `NotFound.tsx`) so it appears on every page.
- Uses AI SDK `useChat` + `DefaultChatTransport` pointed at the edge function.
- Renders `message.parts` with `react-markdown` for formatted answers.
- Editorial Swiss B&W styling matching the site: black border, mono labels, Fraunces heading, no rounded corners. Compact panel ~360×500px, responsive (full-width sheet on mobile).
- Empty state with 3 suggested prompts: "How do I cancel a booking?", "What's the baggage allowance?", "Show me trains from Delhi to Mumbai".
- Loading shimmer while `status === "submitted"`, disabled send button while streaming.
- Conversation kept in memory only (no persistence) — fresh on reload, matches MVP scope.

## Technical notes
- Packages to add: `ai`, `@ai-sdk/react`, `@ai-sdk/openai-compatible`, `react-markdown`.
- Shared gateway helper at `supabase/functions/_shared/ai-gateway.ts`.
- No database tables, no auth — pure stateless chat endpoint.
- Widget z-index above header (sticky z-40), uses semantic tokens only.

## Files
- enable Lovable Cloud
- create `supabase/functions/_shared/ai-gateway.ts`
- create `supabase/functions/chat/index.ts`
- create `src/components/ChatBot.tsx`
- edit `src/pages/Index.tsx` (mount widget)
- edit `src/pages/NotFound.tsx` (mount widget)

Ready to implement on approval.
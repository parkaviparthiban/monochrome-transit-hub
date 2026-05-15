import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ReactMarkdown from "react-markdown";
import { MessageSquare, X, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

const SUGGESTIONS = [
  "How do I cancel a booking?",
  "What's the baggage allowance?",
  "Trains from Delhi to Mumbai?",
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: `${SUPABASE_URL}/functions/v1/chat`,
      headers: { Authorization: `Bearer ${ANON_KEY}`, apikey: ANON_KEY },
    }),
    onError: (err) => {
      toast({ title: "Assistant error", description: err.message, variant: "destructive" });
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, status]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open, status]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t || isLoading) return;
    sendMessage({ text: t });
    setInput("");
  };

  return (
    <>
      {/* Launcher */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open reservation assistant"
          className="fixed bottom-5 right-5 md:bottom-8 md:right-8 z-50 bg-foreground text-background border border-foreground px-5 py-3 mono text-[11px] uppercase tracking-[0.18em] flex items-center gap-2 hover:bg-background hover:text-foreground transition-colors shadow-[4px_4px_0_0_hsl(var(--foreground))]"
        >
          <MessageSquare className="h-4 w-4" />
          Ask Assistant
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed inset-x-0 bottom-0 md:inset-auto md:bottom-6 md:right-6 z-50 md:w-[380px] md:h-[560px] h-[80vh] bg-background border border-foreground flex flex-col shadow-[6px_6px_0_0_hsl(var(--foreground))]">
          {/* Header */}
          <div className="border-b border-foreground px-4 py-3 flex items-center justify-between">
            <div>
              <div className="mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">No. 002 · Live</div>
              <div className="display text-lg leading-tight">Reservation <span className="italic">Desk</span></div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="border border-foreground p-1.5 hover:bg-foreground hover:text-background transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.length === 0 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Ask about flights, trains, fares, seats, cancellations, baggage, or anything reservation-related across India.
                </p>
                <div className="space-y-2">
                  <div className="mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Try asking</div>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="w-full text-left border border-foreground px-3 py-2 text-xs hover:bg-foreground hover:text-background transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => {
              const text = m.parts
                .map((p) => (p.type === "text" ? p.text : ""))
                .join("");
              const isUser = m.role === "user";
              return (
                <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={
                      isUser
                        ? "max-w-[85%] bg-foreground text-background px-3 py-2 text-sm"
                        : "max-w-[90%] text-sm leading-relaxed prose prose-sm prose-neutral max-w-none [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5"
                    }
                  >
                    {isUser ? text : <ReactMarkdown>{text || "…"}</ReactMarkdown>}
                  </div>
                </div>
              );
            })}

            {status === "submitted" && (
              <div className="flex justify-start">
                <div className="mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground animate-pulse">
                  Thinking…
                </div>
              </div>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-foreground p-3 flex items-end gap-2"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              placeholder="Type your question…"
              disabled={isLoading}
              className="flex-1 resize-none bg-transparent border border-foreground px-3 py-2 text-sm focus:outline-none focus:ring-0 max-h-32"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Send"
              className="bg-foreground text-background border border-foreground p-2.5 hover:bg-background hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

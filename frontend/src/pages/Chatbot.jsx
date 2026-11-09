
import { useEffect, useRef, useState } from "react";
import {
  Bot,
  User,
  Send,
  Sparkles,
  MessageCircle,
  LoaderCircle,
} from "lucide-react";

import { sendChatMessage } from "../services/api";

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI Student Support Assistant. You can ask me about academic difficulties, study planning, financial concerns, or student support.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();

    const userMessage = input.trim();

    if (!userMessage || loading) return;

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await sendChatMessage(userMessage);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: response.reply,
        },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);

      const errorMessage =
        error.response?.data?.detail ||
        "Sorry, I couldn't connect to the AI assistant. Please try again.";

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: errorMessage,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "How can I improve my academic performance?",
    "How should I prepare for my semester exams?",
    "What can I do if I have financial difficulties?",
    "How can I manage my study time?",
  ];

  return (
    <div className="flex h-full min-h-[calc(100vh-100px)] flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 p-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
          <Bot size={26} />
        </div>

        <div className="flex-1">
          <h2 className="text-lg font-bold text-slate-800">
            AI Student Assistant
          </h2>

          <p className="text-sm text-green-600">
            <span className="mr-1 inline-block h-2 w-2 rounded-full bg-green-500"></span>
            AI Assistant
          </p>
        </div>

        <div className="hidden items-center gap-2 rounded-full bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-600 sm:flex">
          <Sparkles size={14} />
          Powered by Groq AI
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 space-y-5 overflow-y-auto bg-slate-50 p-4 sm:p-6">

        {messages.length === 1 && (
          <div className="mx-auto mb-6 max-w-xl text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
              <MessageCircle size={28} />
            </div>

            <h3 className="mb-2 text-lg font-bold text-slate-800">
              How can I help you today?
            </h3>

            <p className="text-sm text-slate-500">
              Ask questions and get guidance for your academic journey.
            </p>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setInput(suggestion)}
                  className="rounded-xl border border-slate-200 bg-white p-3 text-left text-sm text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              message.role === "user"
                ? "flex-row-reverse"
                : "flex-row"
            }`}
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                message.role === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-indigo-100 text-indigo-600"
              }`}
            >
              {message.role === "user" ? (
                <User size={18} />
              ) : (
                <Bot size={19} />
              )}
            </div>

            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-7 shadow-sm sm:max-w-[75%] ${
                message.role === "user"
                  ? "rounded-tr-sm bg-indigo-600 text-white"
                  : "rounded-tl-sm border border-slate-200 bg-white text-slate-700"
              }`}
            >
              <p className="whitespace-pre-wrap break-words">
                {message.content}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              <Bot size={19} />
            </div>

            <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
              <LoaderCircle size={17} className="animate-spin" />
              AI is thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSend}
        className="border-t border-slate-200 bg-white p-4 sm:p-5"
      >
        <div className="flex items-center gap-3 rounded-xl border border-slate-300 bg-slate-50 p-2 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your question here..."
            disabled={loading}
            className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </div>

        <p className="mt-2 text-center text-xs text-slate-400">
          AI-generated guidance may not always be accurate. Verify important information with your college.
        </p>
      </form>
    </div>
  );
}

export default Chatbot;

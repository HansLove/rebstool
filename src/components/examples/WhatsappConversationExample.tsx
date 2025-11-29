/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import randomAvatar from "./random-avatar.png";
import { fullMessages } from "./fullMessages";

export default function WhatsappConversationExample() {
  const [messages, setMessages] = useState<any[]>([]);
  const [showTyping, setShowTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    const runSequence = async (idx: number) => {
      if (cancelled) return;

      if (idx < fullMessages.length) {
        setShowTyping(true);
        await new Promise((r) => setTimeout(r, 1000));
        if (cancelled) return;

        setMessages((prev) => [...prev, fullMessages[idx]]);
        setShowTyping(false);

        await new Promise((r) => setTimeout(r, 800));
        if (cancelled) return;

        runSequence(idx + 1);
      } else {
        await new Promise((r) => setTimeout(r, 5000));
        if (cancelled) return;
        setMessages([]);
        runSequence(0);
      }
    };

    runSequence(0);
    return () => { cancelled = true };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, showTyping]);

  return (
    <div className="w-full max-w-md mx-auto bg-[#111B21] text-white h-[600px] rounded-xl shadow-lg flex flex-col overflow-hidden border border-[#1f2c34]">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-[#263238] bg-[#202C33]">
        <img
          src={randomAvatar}
          alt="Avatar"
          className="w-10 h-10 rounded-full mr-4 border border-white/10"
        />
        <div className="flex flex-col">
          <span className="font-semibold text-sm">Aaron Johnson</span>
          <span className="text-xs text-green-400">online</span>
        </div>
      </div>

      {/* Chat messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 p-3 space-y-2 overflow-y-auto bg-[url('/chat-bg.png')] bg-cover scroll-smooth"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.from === "me" ? "justify-start" : "justify-end"} animate-fadeIn`}
          >
            <div
              className={`max-w-[75%] px-4 py-2 rounded-lg text-sm relative shadow-md leading-relaxed
                ${msg.from === "me"
                  ? "bg-[#2A3942] text-white rounded-bl-none"
                  : "bg-[#005C4B] text-white rounded-br-none"}`}
            >
              {msg.text}
              <div className="flex items-center justify-end gap-1 text-[11px] text-gray-300 mt-1">
                <span>{msg.time}</span>
                {msg.from === "other" && (
                  <IoCheckmarkDoneSharp size={15} color="#51bcd3" />
                )}
              </div>
            </div>
          </div>
        ))}

        {showTyping && (
          <div className="flex justify-end animate-fadeIn">
            <div className="bg-[#005C4B] px-4 py-2 rounded-lg rounded-br-none text-sm shadow-md flex items-center gap-1">
              <span className="typing-dots text-white">
                <span className="dot">.</span>
                <span className="dot">.</span>
                <span className="dot">.</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Animations & Styles */}
      <style>{`
        .typing-dots {
          display: flex;
          gap: 4px;
          font-size: 20px;
          font-weight: bold;
          letter-spacing: 1px;
        }
        .dot {
          animation: blink 1.2s infinite ease-in-out;
        }
        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes blink {
          0%, 100% { opacity: 0.3; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-2px); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-in-out both;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

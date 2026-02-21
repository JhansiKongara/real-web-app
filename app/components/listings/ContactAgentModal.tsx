"use client";

import { X, Send, User, Mail, Phone, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";

interface ContactAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle: string;
  agentName?: string;
}

export default function ContactAgentModal({
  isOpen,
  onClose,
  propertyTitle,
  agentName = "Agent",
}: ContactAgentModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(
    `I am interested in ${propertyTitle}. Please contact me.`,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.name) setName(user.name);
        if (user.email) setEmail(user.email);
        if (user.phone) setPhone(user.phone);
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      console.log("Inquiry sent:", { name, email, phone, message });
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
        setMessage(`I am interested in ${propertyTitle}. Please contact me.`);
      }, 2000);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[2000] animate-[fadeIn_0.3s_ease]"
      onClick={onClose}
    >
      <div
        className="bg-slate-900/90 border border-cyan-400/30 rounded-[20px] p-[30px] relative shadow-[0_20_50px_rgba(0,0,0,0.5)] animate-[slideUp_0.3s_ease] max-w-[500px] w-[90%]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-[15px] right-[15px] bg-transparent border-none text-slate-400 cursor-pointer p-[5px] rounded-full flex transition-all hover:bg-white/10 hover:text-white"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {!submitted ? (
          <>
            <div className="mb-6 text-center">
              <h3 className="font-['Outfit'] text-white text-2xl mb-1">
                Contact {agentName}
              </h3>
              <p className="text-slate-400 text-sm">
                Inquire about {propertyTitle}
              </p>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 text-xs font-semibold uppercase">
                  Name
                </label>
                <div className="relative flex items-center">
                  <User
                    size={16}
                    className="absolute left-3 text-slate-500 pointer-events-none"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-3 text-white text-sm outline-none transition-all focus:border-cyan-400 focus:bg-cyan-400/5"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 text-xs font-semibold uppercase">
                  Email
                </label>
                <div className="relative flex items-center">
                  <Mail
                    size={16}
                    className="absolute left-3 text-slate-500 pointer-events-none"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Your Email"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-3 text-white text-sm outline-none transition-all focus:border-cyan-400 focus:bg-cyan-400/5"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 text-xs font-semibold uppercase">
                  Phone
                </label>
                <div className="relative flex items-center">
                  <Phone
                    size={16}
                    className="absolute left-3 text-slate-500 pointer-events-none"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Your Phone Number"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-3 text-white text-sm outline-none transition-all focus:border-cyan-400 focus:bg-cyan-400/5"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 text-xs font-semibold uppercase">
                  Message
                </label>
                <div className="relative flex items-start">
                  <MessageSquare
                    size={16}
                    className="absolute left-3 top-3 text-slate-500 pointer-events-none"
                  />
                  <textarea
                    required
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-3 text-white text-sm outline-none transition-all focus:border-cyan-400 focus:bg-cyan-400/5 resize-y min-h-[100px]"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-2.5 bg-gradient-to-r from-[#06b6d4] via-[#a855f7] to-[#ec4899] border-none rounded-xl p-3.5 text-white font-bold font-['Outfit'] cursor-pointer flex items-center justify-center gap-2.5 transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(6,182,212,0.3)] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Inquiry"}{" "}
                <Send size={16} />
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-10 px-5">
            <div className="w-[60px] h-[60px] bg-cyan-400/10 border border-cyan-400 rounded-full text-cyan-400 flex items-center justify-center mx-auto mb-5">
              <Send size={32} />
            </div>
            <h3 className="text-white font-['Outfit'] text-[22px] mb-2.5">
              Inquiry Sent!
            </h3>
            <p className="text-slate-400">
              The agent will contact you shortly.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

// src/components/layout/whatsapp-button.tsx
"use client";

import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348000000000";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hello! I'm interested in your herbal and wellness products. Can you help me?",
);

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 whatsapp-pulse group"
      aria-label="Chat on WhatsApp"
    >
      {/* Expanded label on hover (desktop) */}
      <span className="hidden md:block pl-4 pr-1 text-sm font-semibold opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto group-hover:pr-2 transition-all duration-300 overflow-hidden whitespace-nowrap">
        Order via WhatsApp
      </span>
      <div className="w-14 h-14 flex items-center justify-center flex-shrink-0">
        <MessageCircle className="w-6 h-6 fill-white" />
      </div>
    </a>
  );
}

"use client"

import { useEffect, useState } from "react"
import { MessageCircle, X } from "lucide-react"

const CHAT_URL = "https://www.chatbase.co/chatbot-iframe/Vgo1sF-zU-ZT6p0PRfQe4"

export function MobileChatAssistant() {
  const [open, setOpen] = useState(false)
  const [viewportHeight, setViewportHeight] = useState<number | null>(null)

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    const updateHeight = () => setViewportHeight(window.visualViewport?.height ?? window.innerHeight)
    document.body.style.overflow = "hidden"
    updateHeight()
    window.addEventListener("resize", updateHeight)
    window.visualViewport?.addEventListener("resize", updateHeight)
    window.visualViewport?.addEventListener("scroll", updateHeight)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("resize", updateHeight)
      window.visualViewport?.removeEventListener("resize", updateHeight)
      window.visualViewport?.removeEventListener("scroll", updateHeight)
      setViewportHeight(null)
    }
  }, [open])

  return (
    <div className="md:hidden">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open AI assistant"
          className="fixed bottom-8 right-4 z-[1000] flex h-14 w-14 items-center justify-center rounded-full bg-[#111] text-white shadow-[0_8px_28px_rgba(0,0,0,0.24)] transition-transform hover:scale-105"
        >
          <MessageCircle className="h-6 w-6" aria-hidden="true" />
        </button>
      ) : (
        <div className="fixed inset-x-0 top-0 z-[1000] flex flex-col overflow-hidden bg-white text-[#111]" style={{ height: viewportHeight ? `${viewportHeight}px` : "100dvh" }} role="dialog" aria-modal="true" aria-label="AI assistant">
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-black/10 bg-white px-4" style={{ paddingTop: "env(safe-area-inset-top)" }}>
            <span className="text-sm font-medium">Riyadvi AI Assistant</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close AI assistant"
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/[0.05]"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <iframe
            title="Chat with the Riyadvi AI assistant"
            src={CHAT_URL}
            width="100%"
            frameBorder={0}
            className="min-h-0 w-full flex-1 border-0"
            style={{ height: "100%", minHeight: "min(700px, 100%)" }}
            allow="microphone"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      )}
    </div>
  )
}

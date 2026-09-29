"use client"

import { useEffect, useRef, useState } from "react"

const AGENTS = [
  {
    label: "WEB & APP",
    title: "Web & App Development",
    desc: "Purpose-built websites and applications shaped around your customers, business processes, and plans for growth.",
    stats: [{ v: "Web", l: "PRODUCTS" }, { v: "Mobile", l: "APPS" }],
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85",
  },
  {
    label: "UI/UX DESIGN",
    title: "UI/UX Design",
    desc: "Research-informed journeys and interfaces that make complex products feel clear, useful, and intuitive.",
    stats: [{ v: "User", l: "RESEARCH" }, { v: "Product", l: "DESIGN" }],
    img: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1200&q=85",
  },
  {
    label: "STRATEGY",
    title: "Business Strategy",
    desc: "Turn business goals into a focused digital roadmap, with priorities and practical next steps your team can act on.",
    stats: [{ v: "Goals", l: "ALIGNMENT" }, { v: "Clear", l: "ROADMAPS" }],
    img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=85",
  },
  {
    label: "AI & AUTOMATION",
    title: "AI & Automation",
    desc: "Find responsible ways to reduce repetitive work and connect intelligent workflows to real business needs.",
    stats: [{ v: "AI", l: "SOLUTIONS" }, { v: "Smart", l: "WORKFLOWS" }],
    img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=85",
  },
  {
    label: "CLOUD & DEVOPS",
    title: "Cloud & DevOps",
    desc: "Build a dependable foundation for shipping, operating, and evolving digital products as needs change.",
    stats: [{ v: "Cloud", l: "FOUNDATIONS" }, { v: "Release", l: "PRACTICES" }],
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=85",
  },
  {
    label: "QUALITY",
    title: "Software Quality",
    desc: "Build confidence into delivery with thoughtful testing, clear review practices, and reliable product experiences.",
    stats: [{ v: "Quality", l: "PRACTICES" }, { v: "Product", l: "CONFIDENCE" }],
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85",
  },
]

const STICKY_TOP   = 80   // matches top: 80px on first card
const STICKY_STEP  = 16   // each card stacks 16px lower
const SCALE_STEP   = 0.04 // scale reduction per card stacked on top
const OFFSET_STEP  = 8    // px pushed down per card stacked on top

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] tracking-widest font-sans text-black/40 bg-black/[0.04]">
      {children}
    </span>
  )
}

export function StackingAgentCards() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [contactFor, setContactFor] = useState<string | null>(null)
  // depth[i] = 0..N how many cards are currently stacked on top of card i
  const [depth, setDepth] = useState<number[]>(AGENTS.map(() => 0))

  useEffect(() => {
    function onScroll() {
      const nextDepth = AGENTS.map((_, i) => {
        // Count how many cards j > i are currently in sticky position (i.e. have scrolled past card i)
        let count = 0
        for (let j = i + 1; j < AGENTS.length; j++) {
          const el = cardRefs.current[j]
          if (!el) continue
          const rect = el.getBoundingClientRect()
          const stickyTopJ = STICKY_TOP + j * STICKY_STEP
          // Card j is "on top of" card i when it has reached its sticky position
          if (rect.top <= stickyTopJ + 2) count++
        }
        return count
      })
      setDepth(nextDepth)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="flex flex-col" style={{ perspective: "1400px", perspectiveOrigin: "50% 0%" }}>
      {AGENTS.map((agent, i) => {
        const d         = depth[i]
        const scale     = 1 - d * SCALE_STEP
        const translateY = d * OFFSET_STEP

        return (
          <div
            key={agent.label}
            ref={el => { cardRefs.current[i] = el }}
            className="sticky mb-4"
            style={{ top: `${STICKY_TOP + i * STICKY_STEP}px`, zIndex: 10 + i }}
          >
            <div
              style={{
                transform:      `scale(${scale}) translateY(${translateY}px)`,
                transformOrigin: "top center",
                transition:     "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
                willChange:     "transform",
              }}
            >
              <div className="group relative bg-[#faf9f7] rounded-2xl border border-black/[0.07] overflow-hidden cursor-pointer">

                
                {agent.img && (
                  <div className="relative w-full h-52 pointer-events-none md:hidden">
                    <img
                      src={agent.img}
                      alt={agent.label}
                      className="absolute inset-0 w-full h-full object-cover object-center"
                      style={{
                        maskImage: "linear-gradient(to bottom, black 0%, black 35%, transparent 85%)",
                        WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 35%, transparent 85%)",
                      }}
                    />
                  </div>
                )}

                
                {agent.img && (
                  <div className="hidden md:block absolute inset-y-0 right-0 w-1/2 pointer-events-none">
                    <img
                      src={agent.img}
                      alt={agent.label}
                      className="w-full h-full object-cover object-center"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(to right, #faf9f7 0%, transparent 55%)",
                      }}
                    />
                  </div>
                )}

                
                <div
                  className="relative z-10 p-8"
                  style={{ maxWidth: agent.img ? undefined : "100%" }}
                  // On desktop limit to left 60% so text doesn't overlap image
                >
                  <div className="md:max-w-[60%]">
                    <div className="flex items-start justify-between mb-6">
                      <Tag>{agent.label}</Tag>
                    </div>
                    <h3 className="text-xl font-light mb-3">{agent.title}</h3>
                    <p className="text-sm text-black/45 leading-relaxed mb-8">{agent.desc}</p>
                  </div>
                  <div className="flex gap-8 pt-6 border-t border-black/[0.06]">
                    {agent.stats.map(s => (
                      <div key={s.l}>
                        <div className="text-2xl font-light">{s.v}</div>
                        <div className="text-[11px] text-black/35 tracking-widest mt-0.5">{s.l}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <button
                      type="button"
                      aria-expanded={contactFor === agent.label}
                      onClick={() => setContactFor(contactFor === agent.label ? null : agent.label)}
                      className="inline-flex items-center justify-center rounded-xl bg-[#111] px-5 py-3 text-xs tracking-widest text-white transition-colors hover:bg-[#333]"
                    >
                      CONTACT US
                    </button>
                    {contactFor === agent.label && (
                      <div className="mt-3 flex flex-wrap gap-3" aria-label={`Contact us about ${agent.title}`}>
                        <a
                          className="inline-flex items-center rounded-xl border border-black/10 px-4 py-2.5 text-xs text-black/70 transition-colors hover:bg-black/[0.04]"
                          href={`mailto:info@riyadvisoftwaretechnologies.com?subject=${encodeURIComponent(`Enquiry: ${agent.title}`)}`}
                        >
                          Email us
                        </a>
                        <a
                          className="inline-flex items-center rounded-xl border border-black/10 px-4 py-2.5 text-xs text-black/70 transition-colors hover:bg-black/[0.04]"
                          href={`https://wa.me/918072487427?text=${encodeURIComponent(`Hi, I'm interested in ${agent.title}.`)}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          WhatsApp
                        </a>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

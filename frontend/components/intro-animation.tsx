"use client"

import { useEffect, useState } from "react"

const INTRO_LINES = [["RIYADVI"], ["SOFTWARE", " TECHNOLOGIES"]]
const LETTER_COUNT = INTRO_LINES.flat().reduce((count, word) => count + word.length, 0)

const LETTER_IN_STAGGER = 26
const LETTER_IN_DUR = 550
const HOLD_DURATION = 250
const LETTERS_IN_TOTAL = LETTER_IN_STAGGER * (LETTER_COUNT - 1) + LETTER_IN_DUR + HOLD_DURATION

const LETTER_OUT_STAGGER = 20
const LETTER_OUT_DUR = 350
const LETTERS_OUT_TOTAL = LETTER_OUT_STAGGER * (LETTER_COUNT - 1) + LETTER_OUT_DUR

const CURTAIN_DELAY = LETTERS_IN_TOTAL + 100
const CURTAIN_DURATION = 1300
const ANIM_TOTAL = CURTAIN_DELAY + LETTERS_OUT_TOTAL + 1400

export const INTRO_DURATION_MS = CURTAIN_DELAY + CURTAIN_DURATION
export const HERO_REVEAL_MS = CURTAIN_DELAY + CURTAIN_DURATION - 150

type Phase = "idle" | "in" | "out" | "done"

export function IntroAnimation({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle")
  const [curtainUp, setCurtainUp] = useState(false)

  useEffect(() => {
    const t0 = setTimeout(() => setPhase("in"), 80)
    const t1 = setTimeout(() => setPhase("out"), LETTERS_IN_TOTAL)
    const t2 = setTimeout(() => setCurtainUp(true), CURTAIN_DELAY)
    const t3 = setTimeout(() => onDone(), HERO_REVEAL_MS)
    const t4 = setTimeout(() => setPhase("done"), ANIM_TOTAL)

    return () => {
      clearTimeout(t0)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [onDone])

  if (phase === "done") return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[100]" aria-hidden="true">
      <div
        className="absolute inset-x-0 top-0"
        style={{
          bottom: curtainUp ? "100%" : "0%",
          transition: curtainUp ? "bottom 1.3s cubic-bezier(0.76, 0, 0.24, 1)" : "none",
          background: "#f5f4f1",
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 sm:gap-3">
          {INTRO_LINES.map((words, lineIndex) => {
            const lineStart = INTRO_LINES.slice(0, lineIndex).flat().reduce((count, word) => count + word.length, 0)
            let letterIndex = lineStart

            return (
              <div key={lineIndex} className="flex items-center justify-center gap-[0.3em]">
                {words.map((word) => (
                  <div key={word} className="flex" style={{ gap: "0.015em" }}>
                    {Array.from(word).map((letter) => {
                      const index = letterIndex++
                      const inDelay = index * LETTER_IN_STAGGER
                      const outDelay = index * LETTER_OUT_STAGGER
                      const isIdle = phase === "idle"
                      const isIn = phase === "in"
                      const isOut = phase === "out"
                      const opacity = isIdle ? 0 : isIn ? 1 : 0
                      const blur = isIdle ? 36 : isIn ? 0 : 24
                      const translateY = isIdle ? 48 : isIn ? 0 : -20
                      const transition = isOut
                        ? `opacity ${LETTER_OUT_DUR}ms cubic-bezier(0.4,0,1,1) ${outDelay}ms, filter ${LETTER_OUT_DUR}ms cubic-bezier(0.4,0,1,1) ${outDelay}ms, transform ${LETTER_OUT_DUR}ms cubic-bezier(0.4,0,1,1) ${outDelay}ms`
                        : isIn
                          ? `opacity ${LETTER_IN_DUR}ms cubic-bezier(0.16,1,0.3,1) ${inDelay}ms, filter ${LETTER_IN_DUR}ms cubic-bezier(0.16,1,0.3,1) ${inDelay}ms, transform ${LETTER_IN_DUR}ms cubic-bezier(0.16,1,0.3,1) ${inDelay}ms`
                          : "none"

                      return (
                        <span
                          key={index}
                          className="select-none font-sans text-[clamp(18px,6.5vw,96px)] font-bold leading-none text-[#111]"
                          style={{
                            letterSpacing: "0.02em",
                            opacity,
                            filter: `blur(${blur}px)`,
                            transform: `translateY(${translateY}px)`,
                            transition,
                            willChange: "opacity, filter, transform",
                          }}
                        >
                          {letter}
                        </span>
                      )
                    })}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

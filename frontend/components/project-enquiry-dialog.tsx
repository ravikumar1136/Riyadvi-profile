"use client"

import { useState, type FormEvent } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type EnquiryForm = {
  name: string
  company: string
  email: string
  phone: string
  service: string
  goals: string
}

const INITIAL_FORM: EnquiryForm = {
  name: "",
  company: "",
  email: "",
  phone: "",
  service: "",
  goals: "",
}

const INPUT_CLASS = "mt-1.5 w-full rounded-md border border-black/15 bg-white px-3 py-2.5 text-sm text-[#111] placeholder:text-black/35 focus:border-black/50 focus:outline-none focus:ring-2 focus:ring-black/10"
const LABEL_CLASS = "block text-xs font-medium tracking-wide text-black/65"

export function ProjectEnquiryDialog() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(INITIAL_FORM)
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle")
  const [submitting, setSubmitting] = useState(false)

  function updateField(field: keyof EnquiryForm, value: string) {
    setForm(current => ({ ...current, [field]: value }))
  }

  async function submitEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setStatus("idle")
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/enquiries/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!response.ok) throw new Error("Enquiry submission failed")
      setStatus("sent")
      setForm(INITIAL_FORM)
    } catch {
      setStatus("error")
    } finally {
      setSubmitting(false)
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) {
      setStatus("idle")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="w-full rounded-xl bg-[#111] py-3 text-center text-sm tracking-widest text-white transition-colors hover:bg-[#333]"
        >
          PLAN A PROJECT
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-black/10 bg-[#F5F4F0] text-[#111] sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light">Plan a project</DialogTitle>
          <DialogDescription className="text-left text-black/55">
            Tell us a little about your goals. Our team will follow up by email.
          </DialogDescription>
        </DialogHeader>

        {status === "sent" ? (
          <div className="space-y-4 py-4" role="status">
            <p className="text-sm leading-relaxed text-black/70">Thanks for reaching out. Your enquiry has been saved for our team to review.</p>
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="w-full rounded-xl bg-[#111] py-3 text-sm tracking-widest text-white transition-colors hover:bg-[#333]"
            >
              DONE
            </button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={submitEnquiry}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={LABEL_CLASS}>
                Your name
                <input className={INPUT_CLASS} name="name" autoComplete="name" maxLength={100} value={form.name} onChange={event => updateField("name", event.target.value)} required />
              </label>
              <label className={LABEL_CLASS}>
                Company
                <input className={INPUT_CLASS} name="company" autoComplete="organization" maxLength={120} value={form.company} onChange={event => updateField("company", event.target.value)} required />
              </label>
              <label className={LABEL_CLASS}>
                Work email
                <input className={INPUT_CLASS} name="email" type="email" autoComplete="email" maxLength={254} value={form.email} onChange={event => updateField("email", event.target.value)} required />
              </label>
              <label className={LABEL_CLASS}>
                Phone
                <input className={INPUT_CLASS} name="phone" type="tel" autoComplete="tel" maxLength={30} value={form.phone} onChange={event => updateField("phone", event.target.value)} required />
              </label>
            </div>

            <label className={LABEL_CLASS}>
              What would you like to work on?
              <select className={INPUT_CLASS} name="service" value={form.service} onChange={event => updateField("service", event.target.value)} required>
                <option value="" disabled>Select a project area</option>
                <option>Web or app development</option>
                <option>UI/UX design</option>
                <option>Business strategy</option>
                <option>AI and automation</option>
                <option>Cloud and DevOps</option>
                <option>Something else</option>
              </select>
            </label>

            <label className={LABEL_CLASS}>
              Project goals
              <textarea className={`${INPUT_CLASS} min-h-28 resize-y`} name="goals" maxLength={3000} value={form.goals} onChange={event => updateField("goals", event.target.value)} placeholder="What are you hoping to achieve?" required />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-[#111] py-3 text-sm tracking-widest text-white transition-colors hover:bg-[#333]"
            >
              {submitting ? "SENDING…" : "SEND ENQUIRY"}
            </button>
            {status === "error" && <p className="text-sm text-red-700" role="alert">We could not submit your enquiry. Please try again.</p>}
            <p className="text-xs leading-relaxed text-black/45">
              Your details will only be used to respond to this enquiry.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

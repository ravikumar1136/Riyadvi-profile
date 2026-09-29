const RECIPIENT = process.env.RIYADVI_ENQUIRY_TO || "info@riyadvisoftwaretechnologies.com"
const MAX_LENGTHS = {
  name: 100,
  company: 120,
  email: 254,
  phone: 30,
  service: 100,
  goals: 3000,
} as const

type EnquiryField = keyof typeof MAX_LENGTHS

function readField(body: Record<string, unknown>, field: EnquiryField): string | null {
  const value = body[field]
  if (typeof value !== "string") return null

  const trimmed = value.trim()
  if (!trimmed || trimmed.length > MAX_LENGTHS[field]) return null
  return trimmed
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Please submit a valid enquiry." }, { status: 400 })
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json({ error: "Please submit a valid enquiry." }, { status: 400 })
  }

  const fields = body as Record<string, unknown>
  const name = readField(fields, "name")
  const company = readField(fields, "company")
  const email = readField(fields, "email")
  const phone = readField(fields, "phone")
  const service = readField(fields, "service")
  const goals = readField(fields, "goals")

  if (!name || !company || !email || !phone || !service || !goals) {
    return Response.json({ error: "Please complete every field before submitting." }, { status: 400 })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  if (!apiKey || !from) {
    return Response.json(
      { error: "Email delivery is not configured yet. Please use the email link below for now." },
      { status: 503 },
    )
  }

  const message = [
    "New project enquiry from the Riyadvi website",
    "",
    `Name: ${name}`,
    `Company: ${company}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Project area: ${service}`,
    "",
    "Project goals:",
    goals,
  ].join("\n")

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [RECIPIENT],
        reply_to: email,
        subject: `Project enquiry: ${company}`,
        text: message,
      }),
    })

    if (!response.ok) {
      console.error("Riyadvi enquiry email provider returned status", response.status)
      return Response.json({ error: "We could not deliver your enquiry right now. Please try again or email us directly." }, { status: 502 })
    }

    return Response.json({ ok: true }, { status: 201 })
  } catch {
    return Response.json({ error: "We could not reach the email service. Please try again or email us directly." }, { status: 502 })
  }
}

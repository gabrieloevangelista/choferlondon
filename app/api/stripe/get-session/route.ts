import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe-config"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("session_id")

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID não fornecido" }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return NextResponse.json(session)
  } catch (error) {
    console.error("Erro ao buscar sessão:", error)
    return NextResponse.json(
      { error: "Erro ao buscar detalhes da sessão" },
      { status: 500 }
    )
  }
}

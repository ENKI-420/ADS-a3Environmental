import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = await streamText({
    model: openai("gpt-4o"),
    system: `You are an AI assistant for A3E Environmental. 
             Your name is IRIS. You answer questions about environmental reports, 
             project timelines, and incident logs based on the context provided by the user. 
             Be concise, professional, and helpful.`,
    messages,
  })

  return result.toDataStreamResponse()
}

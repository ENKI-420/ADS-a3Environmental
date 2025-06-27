"use client"

import { useChat } from "@ai-sdk/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, User } from "lucide-react"

export function AskIrisChat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat()

  return (
    <Card className="flex flex-col h-[500px]">
      <CardHeader>
        <CardTitle>Ask IRIS</CardTitle>
        <CardDescription>Ask questions about your project status, reports, or timelines.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex items-start gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
                {m.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-emerald-600" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-lg max-w-sm ${m.role === "user" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
                >
                  {m.content}
                </div>
                {m.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input value={input} onChange={handleInputChange} placeholder="e.g., Summarize the latest incident..." />
          <Button type="submit">Send</Button>
        </div>
      </form>
    </Card>
  )
}

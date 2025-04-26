"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar } from "@/components/ui/avatar"
import { Send, User, Bot } from "lucide-react"

type Message = {
  role: "user" | "assistant"
  content: string
}

const FALLBACK_RESPONSES = [
  "I'm a medical assistant that can provide general health information. How can I help you today?",
  "That's an interesting question. In general, it's best to consult with your healthcare provider for personalized advice.",
  "I understand your concern. Many people have questions about this topic. Remember that general information is not a substitute for professional medical advice.",
  "Thank you for sharing that information. It's important to discuss these symptoms with your doctor for proper evaluation.",
  "I'm here to provide general health information, but I can't diagnose conditions or prescribe treatments. Please consult with a healthcare professional.",
]

export function FallbackChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm MediBot, your medical assistant. How can I help you with medical information today?",
    },
  ])
  const [input, setInput] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current
      scrollContainer.scrollTop = scrollContainer.scrollHeight
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    const userMessage: Message = {
      role: "user",
      content: input,
    }

    // Update UI with user message
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate AI response with a random fallback message
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * FALLBACK_RESPONSES.length)
      const botResponse: Message = {
        role: "assistant",
        content: FALLBACK_RESPONSES[randomIndex],
      }
      setMessages((prev) => [...prev, botResponse])
    }, 1000)
  }

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          MediBot
        </CardTitle>
        <CardDescription>Ask me any medical questions or for health information</CardDescription>
      </CardHeader>

      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-[420px] p-4" ref={scrollAreaRef}>
          <div className="flex flex-col gap-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}>
                <div className="flex items-start gap-3 max-w-[80%]">
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8 bg-primary/10">
                      <Bot className="h-4 w-4 text-primary" />
                    </Avatar>
                  )}

                  <div
                    className={`rounded-lg px-4 py-2 text-sm ${
                      message.role === "assistant" ? "bg-muted" : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {message.content}
                  </div>

                  {message.role === "user" && (
                    <Avatar className="h-8 w-8 bg-primary">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="pt-0">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            placeholder="Type your medical question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

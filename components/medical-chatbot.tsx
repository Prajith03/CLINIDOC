"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar } from "@/components/ui/avatar"
import { Loader2, Send, User, Bot } from "lucide-react"
import { chatWithMedicalAI, type Message } from "@/app/actions/chat-action"
import { useToast } from "@/hooks/use-toast"

export function MedicalChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm MediBot, your medical assistant. How can I help you with medical information today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current
      scrollContainer.scrollTop = scrollContainer.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    const userMessage: Message = {
      role: "user",
      content: input,
    }

    // Update UI immediately with user message
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Send to server action with all conversation history
      const conversationHistory = [...messages, userMessage]
      const response = await chatWithMedicalAI(conversationHistory)

      // Update with AI response
      setMessages((prev) => [...prev, response])
    } catch (error) {
      console.error("Chat error:", error)
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-3 max-w-[80%]">
                  <Avatar className="h-8 w-8 bg-primary/10">
                    <Bot className="h-4 w-4 text-primary" />
                  </Avatar>
                  <div className="rounded-lg px-4 py-2 text-sm bg-muted flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Thinking...
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="pt-0">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            placeholder="Type your medical question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

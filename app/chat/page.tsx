"use client"

import { useState, useEffect } from "react"
import { MedicalChatbot } from "@/components/medical-chatbot"
import { FallbackChatbot } from "@/components/fallback-chatbot"

export default function ChatPage() {
  const [isAIAvailable, setIsAIAvailable] = useState(true)

  // Check if AI integration is available
  useEffect(() => {
    const checkAIAvailability = async () => {
      try {
        // Simple check to see if we can import the AI SDK
        await import("ai")
        await import("@ai-sdk/groq")
        setIsAIAvailable(true)
      } catch (error) {
        console.error("AI SDK not available:", error)
        setIsAIAvailable(false)
      }
    }

    checkAIAvailability()
  }, [])

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-6">Medical Assistant</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Chat with our AI medical assistant for information about health topics, medical conditions, and general wellness
        advice
      </p>

      <div className="max-w-3xl mx-auto">
        {isAIAvailable ? <MedicalChatbot /> : <FallbackChatbot />}

        <div className="mt-8 p-4 bg-muted rounded-lg text-sm">
          <h3 className="font-medium mb-2">Important Note</h3>
          <p>
            This AI assistant provides general medical information for educational purposes only. It is not a substitute
            for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare
            provider for medical concerns.
          </p>
        </div>
      </div>
    </div>
  )
}

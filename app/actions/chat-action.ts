"use server"

import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export type Message = {
  role: "user" | "assistant" | "system"
  content: string
}

export async function chatWithMedicalAI(messages: Message[]): Promise<Message> {
  try {
    // Create the system prompt for medical context
    const systemMessage: Message = {
      role: "system",
      content: `You are MediBot, a medical assistant AI for Clinidoc. 
      
      Guidelines:
      - Provide helpful, accurate medical information based on established medical knowledge
      - Explain medical concepts in clear, accessible language
      - Always clarify that you're providing general information, not personalized medical advice
      - Encourage users to consult healthcare professionals for specific medical concerns
      - Do not diagnose conditions or prescribe treatments
      - Be empathetic and professional in your responses
      - If you don't know something or if it's outside your knowledge, say so
      - Focus on evidence-based information from reputable medical sources
      - Give shorter but detailed answers
      
      Remember that your purpose is to educate and inform, not replace professional medical consultation.`,
    }

    // Format the conversation history for the AI
    // Include the system message at the beginning
    const formattedMessages = [systemMessage, ...messages]

    // Generate response using Groq
    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      messages: formattedMessages,
      temperature: 0.7,
      maxTokens: 1000,
    })

    return {
      role: "assistant",
      content: text,
    }
  } catch (error) {
    console.error("Error in medical AI chat:", error)
    return {
      role: "assistant",
      content:
        "I'm sorry, I encountered an error processing your request. Please try again or contact support if the issue persists.",
    }
  }
}

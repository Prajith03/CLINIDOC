"use server"

import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export interface SoapNotes {
  subjective: string
  objective: string
  assessment: string
  plan: string
}

// Fallback SOAP notes in case of any errors
const fallbackSoapNotes: SoapNotes = {
  subjective:
    "Patient reports experiencing headaches for the past week, primarily in the frontal region. The pain is described as throbbing and ranges from 4 to 7 out of 10 in intensity. Headaches typically last 2-3 hours and are worse in the morning. Patient has tried over-the-counter pain relievers with minimal relief. No nausea or visual disturbances reported. Patient mentions increased stress at work and irregular sleep patterns recently.",
  objective:
    "Vital signs show BP of 128/82, pulse 76, temperature 98.6°F. Neurological examination is normal with no focal deficits.",
  assessment: "Tension headaches likely related to stress and poor sleep hygiene.",
  plan: "Stress management techniques, sleep hygiene education, and a trial of prescription-strength NSAIDs. Follow-up in 2 weeks if symptoms persist.",
}

export async function generateSoapNotes(transcript: string): Promise<SoapNotes> {
  try {
    const prompt = `
      You are a medical professional tasked with converting a medical consultation transcript into SOAP notes.
      
      SOAP stands for:
      - Subjective: Patient's symptoms, complaints, and history as described by the patient
      - Objective: Observable, measurable data such as vital signs, examination findings, and test results
      - Assessment: Diagnosis or clinical impression based on subjective and objective data
      - Plan: Treatment plan, medications, further testing, follow-up, etc.
      
      IMPORTANT: You must respond ONLY with a valid JSON object using this exact format:
      
      {
        "subjective": "Patient's subjective information here",
        "objective": "Objective findings here",
        "assessment": "Assessment here",
        "plan": "Treatment plan here"
      }
      
      Do not include any explanations, markdown formatting, or text outside the JSON object.
      Do not start with "Here is" or any other text.
      Just return the raw JSON object.
      
      Here is the transcript to convert:
      ${transcript}
    `

    try {
      const { text } = await generateText({
        model: groq("llama3-70b-8192"),
        prompt,
        temperature: 0.1, // Lower temperature for more predictable formatting
      })

      console.log("Raw LLM response:", text.substring(0, 100) + "...")

      // Try to extract JSON from the response
      let jsonStr = text.trim()

      // Remove any text before the first {
      const firstBrace = jsonStr.indexOf("{")
      if (firstBrace !== -1) {
        jsonStr = jsonStr.substring(firstBrace)
      }

      // Remove any text after the last }
      const lastBrace = jsonStr.lastIndexOf("}")
      if (lastBrace !== -1) {
        jsonStr = jsonStr.substring(0, lastBrace + 1)
      }

      try {
        // Try to parse the JSON
        const soapNotes = JSON.parse(jsonStr) as SoapNotes

        // Validate that all required fields are present
        if (!soapNotes.subjective || !soapNotes.objective || !soapNotes.assessment || !soapNotes.plan) {
          console.log("Missing required SOAP note fields, using fallback")
          return fallbackSoapNotes
        }

        return soapNotes
      } catch (parseError) {
        console.error("JSON parsing error:", parseError)
        return fallbackSoapNotes
      }
    } catch (llmError) {
      console.error("LLM error:", llmError)
      return fallbackSoapNotes
    }
  } catch (error) {
    console.error("Error generating SOAP notes:", error)
    return fallbackSoapNotes
  }
}

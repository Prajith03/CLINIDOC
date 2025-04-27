"use server"

import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export interface SoapNotes {
  subjective: string
  objective: string
  assessment: string
  plan: string
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
        throw new Error("Missing required SOAP note fields")
      }

      return soapNotes
    } catch (parseError) {
      console.error("JSON parsing error:", parseError)

      // Fallback: Extract SOAP sections manually
      return extractSoapSections(text)
    }
  } catch (error) {
    console.error("Error generating SOAP notes:", error)

    // Provide fallback SOAP notes in case of error
    return {
      subjective: "Unable to generate subjective notes from the transcript.",
      objective: "Unable to generate objective notes from the transcript.",
      assessment: "Unable to generate assessment from the transcript.",
      plan: "Unable to generate plan from the transcript.",
    }
  }
}

// Fallback function to extract SOAP sections from text
function extractSoapSections(text: string): SoapNotes {
  // Default values
  let subjective = "Unable to extract subjective section."
  let objective = "Unable to extract objective section."
  let assessment = "Unable to extract assessment section."
  let plan = "Unable to extract plan section."

  // Try to find sections using common patterns
  const subjectiveMatch = text.match(/subjective:?\s*([^]*?)(?=objective:|assessment:|plan:|$)/i)
  const objectiveMatch = text.match(/objective:?\s*([^]*?)(?=subjective:|assessment:|plan:|$)/i)
  const assessmentMatch = text.match(/assessment:?\s*([^]*?)(?=subjective:|objective:|plan:|$)/i)
  const planMatch = text.match(/plan:?\s*([^]*?)(?=subjective:|objective:|assessment:|$)/i)

  // Update values if matches found
  if (subjectiveMatch && subjectiveMatch[1].trim()) subjective = subjectiveMatch[1].trim()
  if (objectiveMatch && objectiveMatch[1].trim()) objective = objectiveMatch[1].trim()
  if (assessmentMatch && assessmentMatch[1].trim()) assessment = assessmentMatch[1].trim()
  if (planMatch && planMatch[1].trim()) plan = planMatch[1].trim()

  return { subjective, objective, assessment, plan }
}

"use server"
import { revalidatePath } from "next/cache"
import { generateSoapNotes } from "@/lib/generate-soap-notes"

export async function transcribeAudio(formData: FormData) {
  try {
    // For demo purposes, we'll always use a simulated transcript
    // This avoids issues with blob URLs and file processing in the preview environment

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate a simulated transcript
    const simulatedTranscript =
      "Patient reports experiencing headaches for the past week, primarily in the frontal region. " +
      "The pain is described as throbbing and ranges from 4 to 7 out of 10 in intensity. " +
      "Headaches typically last 2-3 hours and are worse in the morning. " +
      "Patient has tried over-the-counter pain relievers with minimal relief. " +
      "No nausea or visual disturbances reported. " +
      "Patient mentions increased stress at work and irregular sleep patterns recently. " +
      "Vital signs show BP of 128/82, pulse 76, temperature 98.6°F. " +
      "Neurological examination is normal with no focal deficits. " +
      "Assessment indicates tension headaches likely related to stress and poor sleep hygiene. " +
      "Plan includes stress management techniques, sleep hygiene education, and a trial of prescription-strength NSAIDs. " +
      "Follow-up in 2 weeks if symptoms persist."

    console.log("Using simulated transcript for demo")

    try {
      // Generate SOAP notes from the transcript using Groq
      const soapNotes = await generateSoapNotes(simulatedTranscript)

      // Store the SOAP notes in your database or state management
      revalidatePath("/")

      return { transcript: simulatedTranscript, soapNotes }
    } catch (soapError) {
      console.error("Error generating SOAP notes:", soapError)

      // Return the transcript but with default SOAP notes
      return {
        transcript: simulatedTranscript,
        soapNotes: {
          subjective:
            "Patient reports experiencing headaches for the past week, primarily in the frontal region. The pain is described as throbbing and ranges from 4 to 7 out of 10 in intensity. Headaches typically last 2-3 hours and are worse in the morning. Patient has tried over-the-counter pain relievers with minimal relief. No nausea or visual disturbances reported. Patient mentions increased stress at work and irregular sleep patterns recently.",
          objective:
            "Vital signs show BP of 128/82, pulse 76, temperature 98.6°F. Neurological examination is normal with no focal deficits.",
          assessment: "Tension headaches likely related to stress and poor sleep hygiene.",
          plan: "Stress management techniques, sleep hygiene education, and a trial of prescription-strength NSAIDs. Follow-up in 2 weeks if symptoms persist.",
        },
      }
    }
  } catch (error) {
    console.error("Transcription error:", error)

    // Provide fallback data even in case of error
    return {
      transcript: "Error retrieving transcript. Please try again.",
      soapNotes: {
        subjective: "Unable to generate subjective notes.",
        objective: "Unable to generate objective notes.",
        assessment: "Unable to generate assessment.",
        plan: "Unable to generate plan.",
      },
    }
  }
}

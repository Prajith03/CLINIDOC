"use server"

export interface SoapNotes {
  subjective: string
  objective: string
  assessment: string
  plan: string
}

// Sample SOAP notes for different conditions
const sampleSoapNotesLibrary = [
  {
    subjective:
      "Patient reports experiencing headaches for the past two weeks, primarily on one side of the head. The pain is described as throbbing and is sometimes accompanied by nausea. Headaches occur almost daily and last for hours. Patient notes that stress and bright lights seem to trigger or worsen the headaches. Family history positive for migraines (mother).",
    objective:
      "Vital signs: BP 130/85 mmHg, temperature 98.6°F. Physical examination reveals tenderness on palpation of the right temporal region. No focal neurological deficits observed.",
    assessment:
      "Migraine headaches, likely with genetic predisposition. Triggers identified include stress and photosensitivity.",
    plan: "1. Start sumatriptan 50mg at onset of headache, may repeat after 2 hours if needed, not to exceed 200mg in 24 hours. 2. Lifestyle modifications including stress management techniques and avoiding bright light when possible. 3. Maintain headache diary to identify additional triggers. 4. Follow-up in 4 weeks to assess treatment efficacy.",
  },
  {
    subjective:
      "Patient presents with complaints of sore throat, nasal congestion, and cough for the past 3 days. Reports mild fever and fatigue. Denies shortness of breath or chest pain. Has been taking over-the-counter acetaminophen with minimal relief. No known sick contacts.",
    objective:
      "Vital signs: Temperature 100.2°F, BP 122/78 mmHg, HR 88 bpm, RR 16, O2 sat 98% on room air. Physical exam: Oropharynx erythematous with mild tonsillar enlargement, no exudate. Nasal mucosa erythematous with clear discharge. Lungs clear to auscultation bilaterally. No cervical lymphadenopathy.",
    assessment: "Acute viral upper respiratory infection, likely common cold or mild influenza.",
    plan: "1. Symptomatic treatment with acetaminophen or ibuprofen for fever and discomfort. 2. Increase fluid intake and rest. 3. Saline nasal spray for congestion. 4. Return if symptoms worsen or fail to improve within 7 days. 5. Consider COVID-19 testing if symptoms persist or worsen.",
  },
  {
    subjective:
      "Patient reports lower back pain that began 2 days ago after lifting heavy boxes while moving. Describes pain as dull and aching, rated 6/10. Pain worsens with movement and improves with rest. Denies radiation of pain to legs, numbness, tingling, or weakness. No bowel or bladder dysfunction. Has been taking ibuprofen with moderate relief.",
    objective:
      "Vital signs within normal limits. Physical exam: Tenderness to palpation over lumbar paraspinal muscles bilaterally. Limited range of motion with flexion and extension due to pain. Negative straight leg raise test bilaterally. Normal strength, sensation, and reflexes in lower extremities.",
    assessment: "Acute lumbar strain secondary to heavy lifting.",
    plan: "1. Continue ibuprofen 600mg every 6 hours as needed for pain, with food. 2. Apply ice for 20 minutes every 2-3 hours for the first 48 hours, then switch to heat. 3. Avoid heavy lifting and strenuous activity for 1-2 weeks. 4. Begin gentle stretching exercises as tolerated. 5. Return if pain worsens or if new neurological symptoms develop.",
  },
]

export async function generateSoapNotes(transcript: string): Promise<SoapNotes> {
  try {
    // Instead of calling an AI service, we'll use sample SOAP notes
    const randomIndex = Math.floor(Math.random() * sampleSoapNotesLibrary.length)
    const soapNotes = sampleSoapNotesLibrary[randomIndex]

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return soapNotes
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

"use server"
import { revalidatePath } from "next/cache"

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

// Sample transcripts for different conditions
const sampleTranscripts = [
  `
  Doctor: Good morning. How are you feeling today?
  Patient: Not great, doctor. I've been having these headaches for about two weeks now.
  Doctor: I'm sorry to hear that. Can you describe the headaches for me?
  Patient: They're usually on one side of my head, throbbing, and sometimes I feel nauseous.
  Doctor: How often do they occur?
  Patient: Almost daily now, and they last for hours.
  Doctor: Any history of migraines in your family?
  Patient: Yes, my mother had them.
  Doctor: Are there any triggers you've noticed?
  Patient: Stress definitely makes them worse. And bright lights.
  Doctor: Let me check your vitals. Your blood pressure is 130/85, which is slightly elevated. Temperature is normal at 98.6°F.
  Doctor: I'm going to examine your head and neck now. Any tenderness here?
  Patient: Yes, especially on the right side.
  Doctor: I believe you're experiencing migraine headaches. Let's discuss treatment options.
  `,
  `
  Doctor: Hello, what brings you in today?
  Patient: I've been feeling really congested and my throat is killing me for the past few days.
  Doctor: I'm sorry to hear that. When did these symptoms start?
  Patient: About three days ago. I woke up with a scratchy throat, and it's gotten worse. Now I'm all stuffed up too.
  Doctor: Any fever or chills?
  Patient: I think I had a low-grade fever yesterday. I've been taking Tylenol but it's not helping much.
  Doctor: Any cough or difficulty breathing?
  Patient: I have a cough, but no trouble breathing. Just feel really tired.
  Doctor: Let me check your vitals and examine you. Your temperature is slightly elevated at 100.2°F. Let me look at your throat... it's quite red, but I don't see any white patches. Your lungs sound clear.
  Patient: Is it just a cold?
  Doctor: It appears to be a viral upper respiratory infection. Let's talk about how to manage your symptoms.
  `,
  `
  Doctor: Good afternoon. What seems to be the problem today?
  Patient: I hurt my back a couple of days ago while moving apartments. It's really painful.
  Doctor: I'm sorry to hear that. Can you describe the pain and show me where it hurts?
  Patient: It's here in my lower back. It's a dull, aching pain. Gets worse when I move.
  Doctor: On a scale of 1 to 10, how would you rate the pain?
  Patient: About a 6 out of 10. It was worse yesterday.
  Doctor: Does the pain radiate down your legs at all?
  Patient: No, it stays in my back.
  Doctor: Any numbness, tingling, or weakness in your legs?
  Patient: No, nothing like that.
  Doctor: Have you taken anything for the pain?
  Patient: Some ibuprofen. It helps a little.
  Doctor: Let me examine your back. Tell me if this causes any pain... I see you have some muscle tenderness here. Your reflexes and strength look normal.
  Patient: So what's wrong with my back?
  Doctor: Based on your history and examination, you have what we call an acute lumbar strain from lifting. Let's talk about treatment options.
  `,
]

export async function transcribeAudio(formData: FormData) {
  try {
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      throw new Error("No audio file provided")
    }

    // Get audio duration (for uploaded files, we'll simulate this)
    let audioDuration = 0

    // For demo purposes, we'll use the file size as a proxy for duration
    // In a real app, you would extract the actual duration from the audio file
    const fileSizeInMB = audioFile.size / (1024 * 1024)
    audioDuration = fileSizeInMB * 60 // Rough estimate: 1MB ≈ 60 seconds of audio

    console.log(`Estimated audio duration: ${audioDuration} seconds`)

    // Check if audio is too short (less than 1 minute)
    if (audioDuration < 60) {
      // Wait for 5 seconds to simulate processing
      await new Promise((resolve) => setTimeout(resolve, 5000))

      return {
        transcript: "Audio recording too short. Please provide a recording of at least 1 minute for proper analysis.",
        soapNotes: {
          subjective: "Not a valid conversation. The audio recording was too short (less than 1 minute).",
          objective: "Unable to extract objective data from insufficient audio.",
          assessment: "Unable to provide assessment from insufficient audio.",
          plan: "Please provide a longer recording that includes a complete patient-doctor conversation.",
        },
      }
    }

    // Simulate processing time (at least 30 seconds for transcription)
    console.log("Starting transcription process...")
    await new Promise((resolve) => setTimeout(resolve, 30000))

    // Select a random sample transcript and SOAP notes
    const randomIndex = Math.floor(Math.random() * sampleTranscripts.length)
    const simulatedTranscript = sampleTranscripts[randomIndex]
    const soapNotes = sampleSoapNotesLibrary[randomIndex]

    console.log("Transcription complete")

    // Store the SOAP notes in your database or state management
    revalidatePath("/")

    return { transcript: simulatedTranscript, soapNotes }
  } catch (error) {
    console.error("Transcription error:", error)
    throw new Error("Failed to transcribe audio: " + (error instanceof Error ? error.message : "Unknown error"))
  }
}

"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Square, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SoapNotes {
  subjective: string
  objective: string
  assessment: string
  plan: string
}

interface TranscriptionResult {
  transcript: string
  soapNotes: SoapNotes
}

interface AudioRecorderProps {
  onTranscriptionComplete?: (result: TranscriptionResult) => void
  onStartTranscription?: () => void
}

// Sample SOAP notes for first recording
const firstSoapNotes = {
  subjective:
    "Patient is a 45-year-old male presenting with complaints of persistent headache for the past 3 days. Describes the pain as throbbing, primarily located in the frontal region. Pain is rated as 7/10 in intensity. Reports that the headache worsens with bright lights and noise. Has tried over-the-counter ibuprofen with minimal relief. Denies nausea, vomiting, or visual disturbances. No history of recent head trauma. Patient mentions increased work stress over the past week and irregular sleep patterns.",
  objective:
    "Vital signs: BP 138/85 mmHg, HR 76 bpm, RR 16, Temp 98.6°F. Alert and oriented x3. No apparent distress. HEENT: Pupils equal, round, and reactive to light. No scleral icterus. No papilledema on fundoscopic exam. No sinus tenderness. Neck is supple with full range of motion, no meningeal signs. Neurological exam reveals no focal deficits. Cranial nerves II-XII intact. Motor strength 5/5 in all extremities. Sensory exam normal.",
  assessment:
    "Tension headache, likely related to stress and poor sleep hygiene. Differential diagnoses include migraine headache, cluster headache, and sinusitis. No red flags for secondary headache disorders such as increased intracranial pressure or meningitis.",
  plan: "1. Increase ibuprofen to 600mg every 6 hours for pain relief, to be taken with food.\n2. Recommend stress management techniques including mindfulness meditation and regular exercise.\n3. Advise on sleep hygiene: regular sleep schedule, avoiding screens before bedtime, and creating a comfortable sleep environment.\n4. Maintain hydration with at least 8 glasses of water daily.\n5. Return if symptoms worsen or if no improvement in 5-7 days.\n6. Consider referral to neurology if headaches persist beyond 2 weeks.",
}

// Sample SOAP notes for second recording
const secondSoapNotes = {
  subjective:
    "Patient is a 38-year-old female presenting with complaints of lower back pain that began 2 days ago after lifting heavy boxes while moving apartments. Describes the pain as dull and aching, rated 6/10 in intensity. Pain is localized to the lumbar region without radiation to the legs. Reports that pain worsens with movement, particularly bending and lifting, and improves with rest. Has been taking acetaminophen with minimal relief. Denies numbness, tingling, or weakness in the lower extremities. No bowel or bladder dysfunction. No history of chronic back problems or previous injuries.",
  objective:
    "Vital signs: BP 122/78 mmHg, HR 72 bpm, RR 14, Temp 98.4°F. Patient appears uncomfortable when changing positions. Gait is slow but stable. Musculoskeletal exam reveals tenderness to palpation over the lumbar paraspinal muscles bilaterally. Limited range of motion with flexion and extension due to pain. Negative straight leg raise test bilaterally. Normal strength, sensation, and reflexes in lower extremities. No midline spinal tenderness. No visible bruising or deformity.",
  assessment:
    "Acute lumbar strain secondary to heavy lifting. Symptoms and examination findings are consistent with muscular injury without evidence of nerve root compression or more serious pathology. Patient's presentation is typical for mechanical low back pain.",
  plan: "1. Recommend ibuprofen 600mg every 6 hours for pain and inflammation, to be taken with food.\n2. Apply ice for 20 minutes every 2-3 hours for the first 48 hours, then switch to heat.\n3. Rest from strenuous activity for 2-3 days, but encourage gentle movement as tolerated.\n4. Provide patient education on proper lifting techniques and body mechanics.\n5. Prescribe gentle stretching exercises to begin in 2-3 days as pain allows.\n6. Return if pain worsens, if new symptoms develop (especially leg numbness/weakness), or if not improving within 7 days.\n7. Consider physical therapy referral if not improved in 2 weeks.",
}

// Sample transcripts for each recording
const firstTranscript = `
Doctor: Good morning. What brings you in today?
Patient: I've been having these terrible headaches for the past three days.
Doctor: I'm sorry to hear that. Can you describe the headache for me?
Patient: It's a throbbing pain, mostly in the front of my head. I'd say it's about a 7 out of 10.
Doctor: Does anything make it better or worse?
Patient: Bright lights and noise definitely make it worse. I've tried taking some ibuprofen, but it barely helps.
Doctor: Any nausea, vomiting, or changes in your vision?
Patient: No, nothing like that.
Doctor: Have you hit your head recently or had any injuries?
Patient: No, no injuries.
Doctor: Any changes in your routine or stress levels recently?
Patient: Work has been really stressful this past week, and I haven't been sleeping well.
Doctor: Let me check your vital signs and do a quick examination.
[Doctor performs examination]
Doctor: Your vital signs look good. Your neurological exam is normal. Based on your symptoms and examination, this appears to be a tension headache, likely related to your increased stress and poor sleep.
Patient: That makes sense. What should I do about it?
Doctor: I'd recommend increasing your ibuprofen to 600mg every 6 hours, always with food. Try some stress management techniques like meditation. Also, work on your sleep habits - regular schedule, no screens before bed. Stay hydrated too. If things don't improve in a week or get worse, come back and we might consider a neurology referral.
`

const secondTranscript = `
Doctor: Hello, what seems to be the problem today?
Patient: I hurt my back a couple of days ago while moving apartments. I was lifting some heavy boxes.
Doctor: I'm sorry to hear that. Can you describe the pain?
Patient: It's a dull, aching pain in my lower back. I'd rate it about a 6 out of 10.
Doctor: Does the pain travel down your legs at all?
Patient: No, it stays in my lower back.
Doctor: What makes it better or worse?
Patient: It definitely gets worse when I move, especially bending or lifting. Resting helps a bit.
Doctor: Have you taken anything for the pain?
Patient: Just some Tylenol, but it's not helping much.
Doctor: Any numbness, tingling, or weakness in your legs? Any problems with bladder or bowel function?
Patient: No, nothing like that.
Doctor: Have you had back problems before?
Patient: No, this is the first time.
Doctor: Let me examine your back.
[Doctor performs examination]
Doctor: Based on your symptoms and my examination, you have an acute lumbar strain from lifting those heavy boxes. The good news is there's no sign of nerve involvement.
Patient: What should I do for it?
Doctor: I recommend ibuprofen for pain and inflammation. Use ice for the next couple of days, then switch to heat. Rest for 2-3 days, but don't stay completely still - gentle movement is good. I'll show you some proper lifting techniques and give you some stretches to start in a few days. If things get worse or you develop leg symptoms, come back right away.
`

export function AudioRecorder({ onTranscriptionComplete, onStartTranscription }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordingCount, setRecordingCount] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" })
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      toast({
        title: "Microphone Error",
        description: "Could not access your microphone. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  const stopRecording = async () => {
    if (!mediaRecorderRef.current) return

    mediaRecorderRef.current.stop()
    if (timerRef.current) clearInterval(timerRef.current)
    setIsRecording(false)
    setIsProcessing(true)

    // Notify parent component to show loading state
    if (onStartTranscription) {
      onStartTranscription()
    }

    // Wait for the final dataavailable event
    await new Promise<void>((resolve) => {
      if (!mediaRecorderRef.current) {
        resolve()
        return
      }

      mediaRecorderRef.current.onstop = () => {
        resolve()
      }
    })

    try {
      // Ensure we have audio data
      if (audioChunksRef.current.length === 0) {
        throw new Error("No audio data recorded")
      }

      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })

      // Debug: Log the audio blob size
      console.log("Audio blob size:", audioBlob.size, "bytes")
      console.log("Recording duration:", recordingTime, "seconds")

      if (audioBlob.size < 100) {
        throw new Error("Audio recording too short or empty")
      }

      // Check if recording is less than 1 minute
      if (recordingTime < 60) {
        toast({
          title: "Recording Too Short",
          description: "Please record for at least 1 minute to capture a valid conversation.",
          variant: "destructive",
        })

        // Return invalid conversation result
        if (onTranscriptionComplete) {
          onTranscriptionComplete({
            transcript:
              "Audio recording too short. Please provide a recording of at least 1 minute for proper analysis.",
            soapNotes: {
              subjective: "Not a valid conversation. The audio recording was too short (less than 1 minute).",
              objective: "Unable to extract objective data from insufficient audio.",
              assessment: "Unable to provide assessment from insufficient audio.",
              plan: "Please provide a longer recording that includes a complete patient-doctor conversation.",
            },
          })
        }

        setIsProcessing(false)

        // Stop all tracks in the stream to release the microphone
        if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
          mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
        }

        return
      }

      // Simulate a 10-second processing time (reduced from 30 for demo)
      await new Promise((resolve) => setTimeout(resolve, 10000))

      // Determine which sample to use based on recording count
      const currentRecordingCount = recordingCount + 1
      setRecordingCount(currentRecordingCount)

      let result: TranscriptionResult

      if (currentRecordingCount % 2 === 1) {
        // First recording or odd-numbered recordings
        result = {
          transcript: firstTranscript,
          soapNotes: firstSoapNotes,
        }
        toast({
          title: "Transcription Complete",
          description: "Headache consultation transcribed successfully.",
        })
      } else {
        // Second recording or even-numbered recordings
        result = {
          transcript: secondTranscript,
          soapNotes: secondSoapNotes,
        }
        toast({
          title: "Transcription Complete",
          description: "Back pain consultation transcribed successfully.",
        })
      }

      console.log("Transcription result:", result)

      // Call the callback function if provided
      if (onTranscriptionComplete) {
        onTranscriptionComplete(result)
      }
    } catch (error) {
      console.error("Error processing audio:", error)
      toast({
        title: "Processing Error",
        description: error instanceof Error ? error.message : "There was an error processing your audio.",
        variant: "destructive",
      })

      // Reset loading state in case of error
      if (onTranscriptionComplete) {
        onTranscriptionComplete({
          transcript: "Error processing audio.",
          soapNotes: {
            subjective: "Error processing audio.",
            objective: "Error processing audio.",
            assessment: "Error processing audio.",
            plan: "Error processing audio.",
          },
        })
      }
    } finally {
      setIsProcessing(false)

      // Stop all tracks in the stream to release the microphone
      if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full h-24 bg-muted rounded-md flex items-center justify-center">
        {isRecording ? (
          <div className="text-2xl font-mono">{formatTime(recordingTime)}</div>
        ) : (
          <div className="text-muted-foreground">{isProcessing ? "Processing audio..." : "Ready to record"}</div>
        )}
      </div>

      <div className="flex gap-4">
        {!isRecording ? (
          <Button onClick={startRecording} disabled={isProcessing} className="gap-2">
            <Mic className="h-4 w-4" />
            Start Recording
          </Button>
        ) : (
          <Button onClick={stopRecording} variant="destructive" className="gap-2">
            <Square className="h-4 w-4" />
            Stop Recording
          </Button>
        )}
      </div>

      {isProcessing && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Processing audio...
        </div>
      )}

      {isRecording && recordingTime < 60 && (
        <div className="text-xs text-amber-500">
          Recording must be at least 1 minute long for valid analysis ({60 - recordingTime} seconds remaining)
        </div>
      )}
    </div>
  )
}

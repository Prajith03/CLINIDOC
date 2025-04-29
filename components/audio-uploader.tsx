"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Loader2 } from "lucide-react"
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

interface AudioUploaderProps {
  onTranscriptionComplete?: (result: TranscriptionResult) => void
  onStartTranscription?: () => void
}

// Sample SOAP notes for first upload
const firstSoapNotes = {
  subjective:
    "Patient is a 45-year-old male presenting with complaints of persistent headache for the past 3 days. Describes the pain as throbbing, primarily located in the frontal region. Pain is rated as 7/10 in intensity. Reports that the headache worsens with bright lights and noise. Has tried over-the-counter ibuprofen with minimal relief. Denies nausea, vomiting, or visual disturbances. No history of recent head trauma. Patient mentions increased work stress over the past week and irregular sleep patterns.",
  objective:
    "Vital signs: BP 138/85 mmHg, HR 76 bpm, RR 16, Temp 98.6°F. Alert and oriented x3. No apparent distress. HEENT: Pupils equal, round, and reactive to light. No scleral icterus. No papilledema on fundoscopic exam. No sinus tenderness. Neck is supple with full range of motion, no meningeal signs. Neurological exam reveals no focal deficits. Cranial nerves II-XII intact. Motor strength 5/5 in all extremities. Sensory exam normal.",
  assessment:
    "Tension headache, likely related to stress and poor sleep hygiene. Differential diagnoses include migraine headache, cluster headache, and sinusitis. No red flags for secondary headache disorders such as increased intracranial pressure or meningitis.",
  plan: "1. Increase ibuprofen to 600mg every 6 hours for pain relief, to be taken with food.\n2. Recommend stress management techniques including mindfulness meditation and regular exercise.\n3. Advise on sleep hygiene: regular sleep schedule, avoiding screens before bedtime, and creating a comfortable sleep environment.\n4. Maintain hydration with at least 8 glasses of water daily.\n5. Return if symptoms worsen or if no improvement in 5-7 days.\n6. Consider referral to neurology if headaches persist beyond 2 weeks.",
}

// Sample SOAP notes for second upload
const secondSoapNotes = {
  subjective:
    "Patient is a 38-year-old female presenting with complaints of lower back pain that began 2 days ago after lifting heavy boxes while moving apartments. Describes the pain as dull and aching, rated 6/10 in intensity. Pain is localized to the lumbar region without radiation to the legs. Reports that pain worsens with movement, particularly bending and lifting, and improves with rest. Has been taking acetaminophen with minimal relief. Denies numbness, tingling, or weakness in the lower extremities. No bowel or bladder dysfunction. No history of chronic back problems or previous injuries.",
  objective:
    "Vital signs: BP 122/78 mmHg, HR 72 bpm, RR 14, Temp 98.4°F. Patient appears uncomfortable when changing positions. Gait is slow but stable. Musculoskeletal exam reveals tenderness to palpation over the lumbar paraspinal muscles bilaterally. Limited range of motion with flexion and extension due to pain. Negative straight leg raise test bilaterally. Normal strength, sensation, and reflexes in lower extremities. No midline spinal tenderness. No visible bruising or deformity.",
  assessment:
    "Acute lumbar strain secondary to heavy lifting. Symptoms and examination findings are consistent with muscular injury without evidence of nerve root compression or more serious pathology. Patient's presentation is typical for mechanical low back pain.",
  plan: "1. Recommend ibuprofen 600mg every 6 hours for pain and inflammation, to be taken with food.\n2. Apply ice for 20 minutes every 2-3 hours for the first 48 hours, then switch to heat.\n3. Rest from strenuous activity for 2-3 days, but encourage gentle movement as tolerated.\n4. Provide patient education on proper lifting techniques and body mechanics.\n5. Prescribe gentle stretching exercises to begin in 2-3 days as pain allows.\n6. Return if pain worsens, if new symptoms develop (especially leg numbness/weakness), or if not improving within 7 days.\n7. Consider physical therapy referral if not improved in 2 weeks.",
}

// Sample transcripts for each upload
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

export function AudioUploader({ onTranscriptionComplete, onStartTranscription }: AudioUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadCount, setUploadCount] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select an audio file to upload.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    // Notify parent component to show loading state
    if (onStartTranscription) {
      onStartTranscription()
    }

    // Simulate progress over 40 seconds
    progressIntervalRef.current = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + 100 / 40 // Increase by ~2.5% every second
        return newProgress > 99 ? 99 : newProgress
      })
    }, 1000)

    try {
      console.log("Selected file:", selectedFile.name, selectedFile.type, selectedFile.size, "bytes")

      // Check file size
      if (selectedFile.size < 100) {
        throw new Error("Audio file too small or possibly corrupted")
      }

      // Wait for 40 seconds to simulate processing
      await new Promise((resolve) => setTimeout(resolve, 40000)) // Full 40 seconds as requested

      // Clear the progress interval
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }

      // Set progress to 100%
      setUploadProgress(100)

      // Determine which sample to use based on upload count
      const currentUploadCount = uploadCount + 1
      setUploadCount(currentUploadCount)

      let result: TranscriptionResult

      if (currentUploadCount % 2 === 1) {
        // First upload or odd-numbered uploads
        result = {
          transcript: firstTranscript,
          soapNotes: firstSoapNotes,
        }
        toast({
          title: "Transcription Complete",
          description: "Headache consultation transcribed successfully.",
        })
      } else {
        // Second upload or even-numbered uploads
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

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      setSelectedFile(null)
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
      setIsUploading(false)
      setUploadProgress(0)

      // Clear the progress interval if it's still running
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md border-muted-foreground/25 px-4">
        <label htmlFor="audio-file" className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
            <p className="mb-2 text-sm text-muted-foreground">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">MP3, WAV, M4A, or WEBM (max. 30MB)</p>
          </div>
          <input
            id="audio-file"
            type="file"
            className="hidden"
            accept="audio/*"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </label>
      </div>

      {selectedFile && (
        <div className="text-sm">
          Selected file: <span className="font-medium">{selectedFile.name}</span> (
          {Math.round(selectedFile.size / 1024)} KB)
        </div>
      )}

      {isUploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${uploadProgress}%` }}
          ></div>
          <p className="text-xs text-muted-foreground mt-1 text-center">Processing: {Math.round(uploadProgress)}%</p>
        </div>
      )}

      <Button onClick={handleUpload} disabled={!selectedFile || isUploading} className="gap-2">
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            Upload and Transcribe
          </>
        )}
      </Button>
    </div>
  )
}

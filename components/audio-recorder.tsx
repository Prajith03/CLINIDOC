"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Square, Loader2 } from "lucide-react"
import { transcribeAudio } from "@/app/actions/transcribe-action"
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

export function AudioRecorder({ onTranscriptionComplete, onStartTranscription }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
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

      if (audioBlob.size < 100) {
        throw new Error("Audio recording too short or empty")
      }

      const formData = new FormData()
      formData.append("audio", audioBlob, "recording.webm")

      const result = await transcribeAudio(formData)
      console.log("Transcription result:", result)

      toast({
        title: "Transcription Complete",
        description: "Your audio has been successfully transcribed.",
      })

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
    </div>
  )
}

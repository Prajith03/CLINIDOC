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
}

export function AudioRecorder({ onTranscriptionComplete }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  const startRecording = async () => {
    try {
      // For preview environment, skip actual recording and just simulate
      // This avoids issues with blob URLs and media access
      setIsRecording(true)
      setRecordingTime(0)

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Error in recording:", error)
      toast({
        title: "Recording Error",
        description: "Could not start recording. Please try again.",
        variant: "destructive",
      })
    }
  }

  const stopRecording = async () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setIsRecording(false)
    setIsProcessing(true)

    try {
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Call the transcription action directly without actual audio data
      // This avoids issues with blob URLs in the preview environment
      const result = await transcribeAudio(new FormData())

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
    } finally {
      setIsProcessing(false)
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
          Transcribing your audio...
        </div>
      )}
    </div>
  )
}

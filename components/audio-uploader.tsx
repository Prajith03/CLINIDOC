"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Loader2 } from "lucide-react"
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

interface AudioUploaderProps {
  onTranscriptionComplete?: (result: TranscriptionResult) => void
  onStartTranscription?: () => void
}

export function AudioUploader({ onTranscriptionComplete, onStartTranscription }: AudioUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
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

      const formData = new FormData()
      formData.append("audio", selectedFile)

      // Wait for 40 seconds to simulate processing
      await new Promise((resolve) => setTimeout(resolve, 40000))

      // Clear the progress interval
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }

      // Set progress to 100%
      setUploadProgress(100)

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

"use client"

import { useState } from "react"
import { AudioRecorder } from "@/components/audio-recorder"
import { AudioUploader } from "@/components/audio-uploader"
import { SoapNotesDisplay } from "@/components/soap-notes-display"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

export default function HomePage() {
  const [soapNotes, setSoapNotes] = useState<SoapNotes | null>(null)
  const [transcript, setTranscript] = useState<string | null>(null)

  // Function to be called after successful transcription
  const handleTranscriptionComplete = (result: TranscriptionResult) => {
    setTranscript(result.transcript)
    setSoapNotes(result.soapNotes)
  }

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-6">Medical Transcription</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Record or upload audio to generate SOAP notes for your patient consultations
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Tabs defaultValue="record" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="record">Record Audio</TabsTrigger>
            <TabsTrigger value="upload">Upload Audio</TabsTrigger>
          </TabsList>
          <TabsContent value="record">
            <Card>
              <CardHeader>
                <CardTitle>Record Consultation</CardTitle>
                <CardDescription>Record your patient consultation directly in the browser</CardDescription>
              </CardHeader>
              <CardContent>
                <AudioRecorder onTranscriptionComplete={handleTranscriptionComplete} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload Audio File</CardTitle>
                <CardDescription>Upload an existing audio recording of your consultation</CardDescription>
              </CardHeader>
              <CardContent>
                <AudioUploader onTranscriptionComplete={handleTranscriptionComplete} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="h-full">
          <CardHeader>
            <CardTitle>SOAP Notes</CardTitle>
            <CardDescription>Your transcribed consultation will appear here in SOAP format</CardDescription>
          </CardHeader>
          <CardContent>
            <SoapNotesDisplay soapNotes={soapNotes} />
          </CardContent>
        </Card>
      </div>

      {transcript && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Transcript</CardTitle>
            <CardDescription>Raw transcript of your audio recording</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border p-4 max-h-[200px] overflow-y-auto">
              <p className="text-sm">{transcript}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

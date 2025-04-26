"use client"

import { useState } from "react"
import { AudioRecorder } from "@/components/audio-recorder"
import { AudioUploader } from "@/components/audio-uploader"
import { SoapNotesDisplay } from "@/components/soap-notes-display"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"
import { AddPatientForm } from "@/components/add-patient-form"
import { useSoapNotes } from "@/context/soap-notes-context"
import { ManualSoapEntry } from "@/components/manual-soap-entry"

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
  const { patients, currentPatient, setCurrentPatient, soapNotes: contextSoapNotes, setSoapNotes } = useSoapNotes()
  const [localSoapNotes, setLocalSoapNotes] = useState<SoapNotes | null>(null)
  const [transcript, setTranscript] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Use either context SOAP notes or local SOAP notes
  const displaySoapNotes = contextSoapNotes || localSoapNotes

  // Function to be called after successful transcription
  const handleTranscriptionComplete = (result: TranscriptionResult) => {
    setTranscript(result.transcript)
    setLocalSoapNotes(result.soapNotes)
    setSoapNotes(result.soapNotes)
    setIsLoading(false)
  }

  // Function to handle starting the transcription process
  const handleStartTranscription = () => {
    setIsLoading(true)
    // The actual transcription will be handled by the AudioRecorder or AudioUploader components
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold">Medical Transcription</h1>
          <p className="text-lg text-muted-foreground">
            Record or upload audio to generate SOAP notes for your patient consultations
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Current Patient:</span>
            <select
              className="border rounded-md px-3 py-1 text-sm"
              value={currentPatient}
              onChange={(e) => setCurrentPatient(e.target.value)}
            >
              {patients.map((patient) => (
                <option key={patient.id} value={patient.name}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>
          <AddPatientForm />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Tabs defaultValue="record" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="record">Record Audio</TabsTrigger>
            <TabsTrigger value="upload">Upload Audio</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>
          <TabsContent value="record">
            <Card>
              <CardHeader>
                <CardTitle>Record Consultation</CardTitle>
                <CardDescription>Record your patient consultation directly in the browser</CardDescription>
              </CardHeader>
              <CardContent>
                <AudioRecorder
                  onTranscriptionComplete={handleTranscriptionComplete}
                  onStartTranscription={handleStartTranscription}
                />
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
                <AudioUploader
                  onTranscriptionComplete={handleTranscriptionComplete}
                  onStartTranscription={handleStartTranscription}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="manual">
            <ManualSoapEntry />
          </TabsContent>
        </Tabs>

        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>SOAP Notes</CardTitle>
              <CardDescription>Your transcribed consultation will appear here in SOAP format</CardDescription>
            </div>
            {displaySoapNotes && (
              <Button size="sm" className="gap-2">
                <Save className="h-4 w-4" />
                Save to Patient Record
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <SoapNotesDisplay soapNotes={displaySoapNotes} isLoading={isLoading} />
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

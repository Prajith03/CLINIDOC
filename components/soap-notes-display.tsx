import { Loader2 } from "lucide-react"

interface SoapNotes {
  subjective: string
  objective: string
  assessment: string
  plan: string
}

interface SoapNotesDisplayProps {
  soapNotes: SoapNotes | null
  isLoading?: boolean
}

export function SoapNotesDisplay({ soapNotes, isLoading = false }: SoapNotesDisplayProps) {
  if (isLoading) {
    return (
      <div className="rounded-md border p-4 h-[400px] overflow-y-auto flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-sm text-muted-foreground">Generating SOAP notes from transcript...</p>
        <p className="text-xs text-muted-foreground mt-2">This may take up to 30 seconds</p>
      </div>
    )
  }

  if (!soapNotes) {
    return (
      <div className="rounded-md border p-4 h-[400px] overflow-y-auto">
        <p className="text-sm text-muted-foreground italic">Record or upload audio to generate SOAP notes</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border p-4 h-[400px] overflow-y-auto">
      <div className="space-y-4">
        <div className="border-b pb-3">
          <h3 className="font-medium text-sm">Subjective</h3>
          <p className="text-sm mt-1">{soapNotes.subjective}</p>
        </div>
        <div className="border-b pb-3">
          <h3 className="font-medium text-sm">Objective</h3>
          <p className="text-sm mt-1">{soapNotes.objective}</p>
        </div>
        <div className="border-b pb-3">
          <h3 className="font-medium text-sm">Assessment</h3>
          <p className="text-sm mt-1">{soapNotes.assessment}</p>
        </div>
        <div>
          <h3 className="font-medium text-sm">Plan</h3>
          <p className="text-sm mt-1">{soapNotes.plan}</p>
        </div>
      </div>
    </div>
  )
}

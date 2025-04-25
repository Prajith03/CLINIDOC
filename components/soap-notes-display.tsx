interface SoapNotes {
  subjective: string
  objective: string
  assessment: string
  plan: string
}

interface SoapNotesDisplayProps {
  soapNotes: SoapNotes | null
}

export function SoapNotesDisplay({ soapNotes }: SoapNotesDisplayProps) {
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

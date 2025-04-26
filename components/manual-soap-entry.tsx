"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Save } from "lucide-react"
import { useSoapNotes } from "@/context/soap-notes-context"

export function ManualSoapEntry() {
  const { setSoapNotes } = useSoapNotes()
  const [formData, setFormData] = useState({
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSoapNotes(formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manual SOAP Notes Entry</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subjective">Subjective</Label>
            <Textarea
              id="subjective"
              name="subjective"
              placeholder="Patient's symptoms, complaints, and history as described by the patient"
              value={formData.subjective}
              onChange={handleChange}
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="objective">Objective</Label>
            <Textarea
              id="objective"
              name="objective"
              placeholder="Observable, measurable data such as vital signs, examination findings, and test results"
              value={formData.objective}
              onChange={handleChange}
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assessment">Assessment</Label>
            <Textarea
              id="assessment"
              name="assessment"
              placeholder="Diagnosis or clinical impression based on subjective and objective data"
              value={formData.assessment}
              onChange={handleChange}
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="plan">Plan</Label>
            <Textarea
              id="plan"
              name="plan"
              placeholder="Treatment plan, medications, further testing, follow-up, etc."
              value={formData.plan}
              onChange={handleChange}
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="gap-2">
            <Save className="h-4 w-4" />
            Save SOAP Notes
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Clock,
  FileText,
  Activity,
  Pill,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
} from "lucide-react"
import { useSoapNotes } from "@/context/soap-notes-context"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { generatePatientPDF } from "@/lib/generate-pdf"
import { useToast } from "@/hooks/use-toast"

// Sample blood pressure data for each patient
const bpData = {
  1: [
    { month: "Jan", systolic: 135, diastolic: 85 },
    { month: "Feb", systolic: 138, diastolic: 87 },
    { month: "Mar", systolic: 132, diastolic: 84 },
    { month: "Apr", systolic: 130, diastolic: 82 },
    { month: "May", systolic: 128, diastolic: 80 },
    { month: "Jun", systolic: 129, diastolic: 81 },
  ],
  2: [
    { month: "Jan", systolic: 120, diastolic: 75 },
    { month: "Feb", systolic: 118, diastolic: 73 },
    { month: "Mar", systolic: 122, diastolic: 76 },
    { month: "Apr", systolic: 119, diastolic: 74 },
    { month: "May", systolic: 121, diastolic: 75 },
    { month: "Jun", systolic: 120, diastolic: 74 },
  ],
  3: [
    { month: "Jan", systolic: 145, diastolic: 90 },
    { month: "Feb", systolic: 142, diastolic: 88 },
    { month: "Mar", systolic: 140, diastolic: 87 },
    { month: "Apr", systolic: 138, diastolic: 86 },
    { month: "May", systolic: 135, diastolic: 84 },
    { month: "Jun", systolic: 132, diastolic: 82 },
  ],
}

// Sample secondary data for each patient (glucose, migraine, heart rate)
const secondaryData = {
  1: [
    { month: "Jan", value: 145 },
    { month: "Feb", value: 139 },
    { month: "Mar", value: 142 },
    { month: "Apr", value: 135 },
    { month: "May", value: 130 },
    { month: "Jun", value: 128 },
  ],
  2: [
    { month: "Jan", value: 4 },
    { month: "Feb", value: 5 },
    { month: "Mar", value: 3 },
    { month: "Apr", value: 2 },
    { month: "May", value: 3 },
    { month: "Jun", value: 2 },
  ],
  3: [
    { month: "Jan", value: 82 },
    { month: "Feb", value: 80 },
    { month: "Mar", value: 78 },
    { month: "Apr", value: 76 },
    { month: "May", value: 75 },
    { month: "Jun", value: 74 },
  ],
}

export default function PatientPage() {
  const { patients, currentPatient, setCurrentPatient } = useSoapNotes()
  const { toast } = useToast()
  const [currentPatientIndex, setCurrentPatientIndex] = useState(() => {
    const index = patients.findIndex((p) => p.name === currentPatient)
    return index >= 0 ? index : 0
  })
  const [isPdfLoading, setIsPdfLoading] = useState(false)

  const patient = patients[currentPatientIndex]

  const nextPatient = () => {
    const newIndex = (currentPatientIndex + 1) % patients.length
    setCurrentPatientIndex(newIndex)
    setCurrentPatient(patients[newIndex].name)
  }

  const prevPatient = () => {
    const newIndex = (currentPatientIndex - 1 + patients.length) % patients.length
    setCurrentPatientIndex(newIndex)
    setCurrentPatient(patients[newIndex].name)
  }

  const handleDownloadPDF = async () => {
    try {
      setIsPdfLoading(true)
      await generatePatientPDF(patient)
      toast({
        title: "PDF Generated",
        description: `Medical record for ${patient.name} has been downloaded.`,
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPdfLoading(false)
    }
  }

  // Get the appropriate data for the current patient
  const patientBPData = bpData[patient.id as keyof typeof bpData] || bpData[1]
  const patientSecondaryData = secondaryData[patient.id as keyof typeof secondaryData] || secondaryData[1]

  // Get the appropriate label for the secondary chart
  const secondaryChartLabel =
    patient.id === 1
      ? "Blood Glucose (mg/dL)"
      : patient.id === 2
        ? "Migraine Frequency (episodes/month)"
        : "Heart Rate (bpm)"

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold">Patient Details</h1>
          <p className="text-lg text-muted-foreground mt-2">
            {patient.name}, {patient.age} years old, {patient.gender}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={prevPatient}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Patient {currentPatientIndex + 1} of {patients.length}
          </span>
          <Button variant="outline" size="icon" onClick={nextPatient}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleDownloadPDF} disabled={isPdfLoading}>
            {isPdfLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="history">Medical History</TabsTrigger>
          <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
        </TabsList>

        <TabsContent value="history">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Medical History
                </CardTitle>
                <CardDescription>Patient's medical background and history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Chronic Conditions</h3>
                    <ul className="list-disc list-inside text-sm mt-1 text-muted-foreground">
                      {patient.medicalHistory.chronicConditions.length > 0 ? (
                        patient.medicalHistory.chronicConditions.map((condition, index) => (
                          <li key={index}>
                            {condition.name} (diagnosed {condition.diagnosedYear})
                          </li>
                        ))
                      ) : (
                        <li>No chronic conditions reported</li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium">Surgeries</h3>
                    <ul className="list-disc list-inside text-sm mt-1 text-muted-foreground">
                      {patient.medicalHistory.surgeries.length > 0 ? (
                        patient.medicalHistory.surgeries.map((surgery, index) => (
                          <li key={index}>
                            {surgery.name} ({surgery.year})
                          </li>
                        ))
                      ) : (
                        <li>No surgeries reported</li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium">Allergies</h3>
                    <ul className="list-disc list-inside text-sm mt-1 text-muted-foreground">
                      {patient.medicalHistory.allergies.length > 0 ? (
                        patient.medicalHistory.allergies.map((allergy, index) => (
                          <li key={index}>
                            {allergy.name} ({allergy.severity})
                          </li>
                        ))
                      ) : (
                        <li>No allergies reported</li>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5" />
                  Current Medications
                </CardTitle>
                <CardDescription>Medications the patient is currently taking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patient.medicalHistory.medications.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {patient.medicalHistory.medications.map((medication, index) => (
                        <div key={index} className="border rounded-md p-3">
                          <div className="font-medium">{medication.name}</div>
                          <div className="text-sm text-muted-foreground">{medication.dosage}</div>
                          <div className="text-xs text-muted-foreground mt-1">{medication.purpose}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No current medications reported</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="diagnosis">
          <Card>
            <CardHeader>
              <CardTitle>Current Diagnosis</CardTitle>
              <CardDescription>Latest medical diagnosis and findings</CardDescription>
            </CardHeader>
            <CardContent>
              {patient.diagnosis.length > 0 ? (
                <div className="space-y-6">
                  {patient.diagnosis.map((diagnosis, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{diagnosis.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">Diagnosed: {diagnosis.date}</p>
                        </div>
                        <div
                          className={`${
                            diagnosis.status === "Ongoing"
                              ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                              : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                          } text-xs px-2 py-1 rounded-full`}
                        >
                          {diagnosis.status}
                        </div>
                      </div>
                      <p className="mt-3 text-sm">{diagnosis.notes}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No diagnoses recorded for this patient</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Lab Results
                </CardTitle>
                <CardDescription>Recent laboratory test results</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(patient.labResults).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(patient.labResults).map(([key, test]) => (
                      <div key={key} className="border-b pb-3 last:border-b-0">
                        <div className="flex justify-between">
                          <h3 className="font-medium">
                            {key === "cbc"
                              ? "Complete Blood Count (CBC)"
                              : key === "lipidPanel"
                                ? "Lipid Panel"
                                : key === "diabetesMonitoring"
                                  ? "Diabetes Monitoring"
                                  : key === "thyroidPanel"
                                    ? "Thyroid Panel"
                                    : key === "cardiacEnzymes"
                                      ? "Cardiac Enzymes"
                                      : key}
                          </h3>
                          <span className="text-xs text-muted-foreground">{test.date}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {test.results.map((result, index) => (
                            <div key={index} className="text-sm">
                              <span className="text-muted-foreground">{result.name}:</span> {result.value}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No lab results available for this patient</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Vital Signs Trend
                </CardTitle>
                <CardDescription>Tracking of vital measurements over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-b pb-3">
                    <h3 className="font-medium">Blood Pressure (mmHg)</h3>
                    <div className="h-40 mt-2">
                      <ChartContainer
                        className="h-full w-full"
                        config={{
                          systolic: {
                            label: "Systolic",
                            color: "hsl(var(--primary))",
                          },
                          diastolic: {
                            label: "Diastolic",
                            color: "hsl(var(--muted-foreground))",
                          },
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={patientBPData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis domain={[60, 160]} />
                            <Tooltip content={<ChartTooltipContent />} />
                            <Line
                              type="monotone"
                              dataKey="systolic"
                              stroke="var(--color-systolic)"
                              strokeWidth={2}
                              dot={{ r: 3 }}
                            />
                            <Line
                              type="monotone"
                              dataKey="diastolic"
                              stroke="var(--color-diastolic)"
                              strokeWidth={2}
                              dot={{ r: 3 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium">{secondaryChartLabel}</h3>
                    <div className="h-40 mt-2">
                      <ChartContainer
                        className="h-full w-full"
                        config={{
                          value: {
                            label: secondaryChartLabel,
                            color: "hsl(var(--primary))",
                          },
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={patientSecondaryData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip content={<ChartTooltipContent />} />
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke="var(--color-value)"
                              strokeWidth={2}
                              dot={{ r: 3 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarClock className="h-5 w-5" />
                Appointments
              </CardTitle>
              <CardDescription>Past and upcoming appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Upcoming Appointments</h3>
                  {patient.appointments.upcoming.length > 0 ? (
                    <div className="space-y-3">
                      {patient.appointments.upcoming.map((appointment, index) => (
                        <div key={index} className="flex items-start gap-4 p-3 border rounded-md">
                          <div className="bg-primary/10 p-2 rounded-md">
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{appointment.type}</div>
                            <div className="text-sm text-muted-foreground">{appointment.doctor}</div>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{appointment.date}</span>
                              <Clock className="h-3 w-3 ml-2" />
                              <span>{appointment.time}</span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Reschedule
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No upcoming appointments scheduled</p>
                  )}
                </div>

                <div>
                  <h3 className="font-medium mb-2">Past Appointments</h3>
                  {patient.appointments.past.length > 0 ? (
                    <div className="space-y-3">
                      {patient.appointments.past.map((appointment, index) => (
                        <div key={index} className="flex items-start gap-4 p-3 border rounded-md bg-muted/50">
                          <div className="bg-muted p-2 rounded-md">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{appointment.type}</div>
                            <div className="text-sm text-muted-foreground">{appointment.doctor}</div>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{appointment.date}</span>
                              <Clock className="h-3 w-3 ml-2" />
                              <span>{appointment.time}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            View Notes
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No past appointments recorded</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, FileText, Activity, Pill, CalendarClock } from "lucide-react"

export default function PatientPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold">Patient Details</h1>
          <p className="text-lg text-muted-foreground mt-2">John Doe, 42 years old, Male</p>
        </div>
        <Button>Book Appointment</Button>
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
                      <li>Type 2 Diabetes (diagnosed 2018)</li>
                      <li>Hypertension (diagnosed 2019)</li>
                      <li>Mild Asthma (since childhood)</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium">Surgeries</h3>
                    <ul className="list-disc list-inside text-sm mt-1 text-muted-foreground">
                      <li>Appendectomy (2010)</li>
                      <li>Knee arthroscopy (2015)</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium">Allergies</h3>
                    <ul className="list-disc list-inside text-sm mt-1 text-muted-foreground">
                      <li>Penicillin (moderate)</li>
                      <li>Shellfish (severe)</li>
                      <li>Pollen (mild, seasonal)</li>
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-md p-3">
                      <div className="font-medium">Metformin</div>
                      <div className="text-sm text-muted-foreground">500mg, twice daily</div>
                      <div className="text-xs text-muted-foreground mt-1">For diabetes</div>
                    </div>

                    <div className="border rounded-md p-3">
                      <div className="font-medium">Lisinopril</div>
                      <div className="text-sm text-muted-foreground">10mg, once daily</div>
                      <div className="text-xs text-muted-foreground mt-1">For hypertension</div>
                    </div>

                    <div className="border rounded-md p-3">
                      <div className="font-medium">Albuterol</div>
                      <div className="text-sm text-muted-foreground">As needed</div>
                      <div className="text-xs text-muted-foreground mt-1">For asthma</div>
                    </div>

                    <div className="border rounded-md p-3">
                      <div className="font-medium">Atorvastatin</div>
                      <div className="text-sm text-muted-foreground">20mg, once daily</div>
                      <div className="text-xs text-muted-foreground mt-1">For cholesterol</div>
                    </div>
                  </div>
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
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">Type 2 Diabetes Mellitus</h3>
                      <p className="text-sm text-muted-foreground mt-1">Diagnosed: March 15, 2018</p>
                    </div>
                    <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs px-2 py-1 rounded-full">
                      Ongoing
                    </div>
                  </div>
                  <p className="mt-3 text-sm">
                    Patient has been managing Type 2 Diabetes with medication and lifestyle changes. Recent HbA1c levels
                    show moderate control at 7.2% (target &lt;7.0%).
                  </p>
                </div>

                <div className="border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">Hypertension</h3>
                      <p className="text-sm text-muted-foreground mt-1">Diagnosed: June 22, 2019</p>
                    </div>
                    <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs px-2 py-1 rounded-full">
                      Ongoing
                    </div>
                  </div>
                  <p className="mt-3 text-sm">
                    Blood pressure has been generally well-controlled with medication. Recent readings average 138/85
                    mmHg (target &lt;130/80 mmHg).
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">Upper Respiratory Infection</h3>
                      <p className="text-sm text-muted-foreground mt-1">Diagnosed: January 5, 2023</p>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full">
                      Resolved
                    </div>
                  </div>
                  <p className="mt-3 text-sm">
                    Patient presented with cough, congestion, and low-grade fever. Treated with rest, fluids, and
                    over-the-counter medications. Symptoms resolved within 10 days.
                  </p>
                </div>
              </div>
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
                <div className="space-y-4">
                  <div className="border-b pb-3">
                    <div className="flex justify-between">
                      <h3 className="font-medium">Complete Blood Count (CBC)</h3>
                      <span className="text-xs text-muted-foreground">March 10, 2023</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="text-sm">
                        <span className="text-muted-foreground">WBC:</span> 7.2 K/uL
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">RBC:</span> 4.8 M/uL
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Hemoglobin:</span> 14.2 g/dL
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Hematocrit:</span> 42%
                      </div>
                    </div>
                  </div>

                  <div className="border-b pb-3">
                    <div className="flex justify-between">
                      <h3 className="font-medium">Lipid Panel</h3>
                      <span className="text-xs text-muted-foreground">March 10, 2023</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Total Cholesterol:</span> 195 mg/dL
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">HDL:</span> 45 mg/dL
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">LDL:</span> 120 mg/dL
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Triglycerides:</span> 150 mg/dL
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between">
                      <h3 className="font-medium">Diabetes Monitoring</h3>
                      <span className="text-xs text-muted-foreground">March 10, 2023</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Fasting Glucose:</span> 135 mg/dL
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">HbA1c:</span> 7.2%
                      </div>
                    </div>
                  </div>
                </div>
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
                    <div className="h-40 mt-2 bg-muted rounded-md flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">Blood pressure chart visualization</p>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>Jan 2023</span>
                      <span>Mar 2023</span>
                      <span>Jun 2023</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium">Blood Glucose (mg/dL)</h3>
                    <div className="h-40 mt-2 bg-muted rounded-md flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">Blood glucose chart visualization</p>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>Jan 2023</span>
                      <span>Mar 2023</span>
                      <span>Jun 2023</span>
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
                  <div className="space-y-3">
                    <div className="flex items-start gap-4 p-3 border rounded-md">
                      <div className="bg-primary/10 p-2 rounded-md">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Annual Physical Examination</div>
                        <div className="text-sm text-muted-foreground">Dr. Sarah Johnson</div>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>July 15, 2023</span>
                          <Clock className="h-3 w-3 ml-2" />
                          <span>10:30 AM</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Reschedule
                      </Button>
                    </div>

                    <div className="flex items-start gap-4 p-3 border rounded-md">
                      <div className="bg-primary/10 p-2 rounded-md">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Diabetes Follow-up</div>
                        <div className="text-sm text-muted-foreground">Dr. Michael Chen</div>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>August 3, 2023</span>
                          <Clock className="h-3 w-3 ml-2" />
                          <span>2:15 PM</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Reschedule
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Past Appointments</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-4 p-3 border rounded-md bg-muted/50">
                      <div className="bg-muted p-2 rounded-md">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Quarterly Diabetes Check</div>
                        <div className="text-sm text-muted-foreground">Dr. Michael Chen</div>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>March 10, 2023</span>
                          <Clock className="h-3 w-3 ml-2" />
                          <span>1:45 PM</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View Notes
                      </Button>
                    </div>

                    <div className="flex items-start gap-4 p-3 border rounded-md bg-muted/50">
                      <div className="bg-muted p-2 rounded-md">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Blood Pressure Follow-up</div>
                        <div className="text-sm text-muted-foreground">Dr. Sarah Johnson</div>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>January 22, 2023</span>
                          <Clock className="h-3 w-3 ml-2" />
                          <span>9:15 AM</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View Notes
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

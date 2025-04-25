import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Utensils, Activity, ArrowRight, Pill, Brain } from "lucide-react"

export default function SuggestionsPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-4xl font-bold">AI Suggestions</h1>
        <p className="text-lg text-muted-foreground">
          Personalized recommendations based on your medical history and current condition
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-full">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-xl">Lifestyle</CardTitle>
            </div>
            <CardDescription>Recommendations for daily habits</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex gap-2">
                <div className="flex-shrink-0 h-5 w-5 bg-primary/20 rounded-full flex items-center justify-center text-xs text-primary font-medium">
                  1
                </div>
                <div className="text-sm">
                  <p className="font-medium">Increase daily steps</p>
                  <p className="text-muted-foreground">
                    Aim for 8,000-10,000 steps daily to improve insulin sensitivity
                  </p>
                </div>
              </li>
              <li className="flex gap-2">
                <div className="flex-shrink-0 h-5 w-5 bg-primary/20 rounded-full flex items-center justify-center text-xs text-primary font-medium">
                  2
                </div>
                <div className="text-sm">
                  <p className="font-medium">Stress management</p>
                  <p className="text-muted-foreground">
                    Practice 10 minutes of meditation daily to help control blood pressure
                  </p>
                </div>
              </li>
              <li className="flex gap-2">
                <div className="flex-shrink-0 h-5 w-5 bg-primary/20 rounded-full flex items-center justify-center text-xs text-primary font-medium">
                  3
                </div>
                <div className="text-sm">
                  <p className="font-medium">Sleep hygiene</p>
                  <p className="text-muted-foreground">
                    Aim for 7-8 hours of quality sleep to improve glucose regulation
                  </p>
                </div>
              </li>
            </ul>
            <Button variant="ghost" size="sm" className="w-full mt-4 gap-1">
              View detailed plan
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-full">
                <Utensils className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-xl">Nutrition</CardTitle>
            </div>
            <CardDescription>Dietary recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex gap-2">
                <div className="flex-shrink-0 h-5 w-5 bg-primary/20 rounded-full flex items-center justify-center text-xs text-primary font-medium">
                  1
                </div>
                <div className="text-sm">
                  <p className="font-medium">Low glycemic diet</p>
                  <p className="text-muted-foreground">Focus on foods that don't cause rapid blood sugar spikes</p>
                </div>
              </li>
              <li className="flex gap-2">
                <div className="flex-shrink-0 h-5 w-5 bg-primary/20 rounded-full flex items-center justify-center text-xs text-primary font-medium">
                  2
                </div>
                <div className="text-sm">
                  <p className="font-medium">Increase fiber intake</p>
                  <p className="text-muted-foreground">
                    Aim for 25-30g of fiber daily from vegetables, fruits, and whole grains
                  </p>
                </div>
              </li>
              <li className="flex gap-2">
                <div className="flex-shrink-0 h-5 w-5 bg-primary/20 rounded-full flex items-center justify-center text-xs text-primary font-medium">
                  3
                </div>
                <div className="text-sm">
                  <p className="font-medium">Reduce sodium</p>
                  <p className="text-muted-foreground">Limit sodium to 1,500mg daily to help manage blood pressure</p>
                </div>
              </li>
            </ul>
            <Button variant="ghost" size="sm" className="w-full mt-4 gap-1">
              View meal plans
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-full">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-xl">Exercise</CardTitle>
            </div>
            <CardDescription>Physical activity recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex gap-2">
                <div className="flex-shrink-0 h-5 w-5 bg-primary/20 rounded-full flex items-center justify-center text-xs text-primary font-medium">
                  1
                </div>
                <div className="text-sm">
                  <p className="font-medium">Moderate aerobic activity</p>
                  <p className="text-muted-foreground">150 minutes weekly (e.g., 30 min walking, 5 days a week)</p>
                </div>
              </li>
              <li className="flex gap-2">
                <div className="flex-shrink-0 h-5 w-5 bg-primary/20 rounded-full flex items-center justify-center text-xs text-primary font-medium">
                  2
                </div>
                <div className="text-sm">
                  <p className="font-medium">Resistance training</p>
                  <p className="text-muted-foreground">2-3 sessions weekly to improve insulin sensitivity</p>
                </div>
              </li>
              <li className="flex gap-2">
                <div className="flex-shrink-0 h-5 w-5 bg-primary/20 rounded-full flex items-center justify-center text-xs text-primary font-medium">
                  3
                </div>
                <div className="text-sm">
                  <p className="font-medium">Flexibility exercises</p>
                  <p className="text-muted-foreground">Daily stretching to improve circulation and joint health</p>
                </div>
              </li>
            </ul>
            <Button variant="ghost" size="sm" className="w-full mt-4 gap-1">
              View exercise plan
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-full">
                <Pill className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-xl">Medication</CardTitle>
            </div>
            <CardDescription>Medication management suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex gap-2">
                <div className="flex-shrink-0 h-5 w-5 bg-primary/20 rounded-full flex items-center justify-center text-xs text-primary font-medium">
                  1
                </div>
                <div className="text-sm">
                  <p className="font-medium">Medication timing</p>
                  <p className="text-muted-foreground">
                    Take Metformin with meals to reduce gastrointestinal side effects
                  </p>
                </div>
              </li>
              <li className="flex gap-2">
                <div className="flex-shrink-0 h-5 w-5 bg-primary/20 rounded-full flex items-center justify-center text-xs text-primary font-medium">
                  2
                </div>
                <div className="text-sm">
                  <p className="font-medium">Potential interactions</p>
                  <p className="text-muted-foreground">
                    Avoid grapefruit juice with Atorvastatin to prevent side effects
                  </p>
                </div>
              </li>
              <li className="flex gap-2">
                <div className="flex-shrink-0 h-5 w-5 bg-primary/20 rounded-full flex items-center justify-center text-xs text-primary font-medium">
                  3
                </div>
                <div className="text-sm">
                  <p className="font-medium">Adherence strategy</p>
                  <p className="text-muted-foreground">Set daily alarms to ensure consistent medication timing</p>
                </div>
              </li>
            </ul>
            <Button variant="ghost" size="sm" className="w-full mt-4 gap-1">
              View medication details
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-full">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-xl">Education</CardTitle>
            </div>
            <CardDescription>Learning resources for your conditions</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex gap-2">
                <div className="flex-shrink-0 h-5 w-5 bg-primary/20 rounded-full flex items-center justify-center text-xs text-primary font-medium">
                  1
                </div>
                <div className="text-sm">
                  <p className="font-medium">Diabetes management course</p>
                  <p className="text-muted-foreground">Online course on understanding blood glucose patterns</p>
                </div>
              </li>
              <li className="flex gap-2">
                <div className="flex-shrink-0 h-5 w-5 bg-primary/20 rounded-full flex items-center justify-center text-xs text-primary font-medium">
                  2
                </div>
                <div className="text-sm">
                  <p className="font-medium">Hypertension webinar</p>
                  <p className="text-muted-foreground">Live session on lifestyle factors affecting blood pressure</p>
                </div>
              </li>
              <li className="flex gap-2">
                <div className="flex-shrink-0 h-5 w-5 bg-primary/20 rounded-full flex items-center justify-center text-xs text-primary font-medium">
                  3
                </div>
                <div className="text-sm">
                  <p className="font-medium">Nutrition workshop</p>
                  <p className="text-muted-foreground">Interactive cooking class for diabetic-friendly meals</p>
                </div>
              </li>
            </ul>
            <Button variant="ghost" size="sm" className="w-full mt-4 gap-1">
              Browse all resources
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Personalized Health Insights</CardTitle>
            <CardDescription>AI-generated analysis based on your recent data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 border rounded-md bg-muted/30">
              <h3 className="font-medium text-lg mb-2">Recent Trends & Observations</h3>
              <div className="space-y-3 text-sm">
                <p>
                  <span className="font-medium">Blood Glucose Pattern:</span> Your morning fasting glucose readings have
                  been consistently higher than your afternoon readings. This "dawn phenomenon" is common in diabetes
                  and may require adjusting your medication timing or evening meal composition.
                </p>
                <p>
                  <span className="font-medium">Blood Pressure Correlation:</span> We've noticed your blood pressure
                  tends to increase after reported stressful work days. Consider implementing the recommended stress
                  management techniques on workdays.
                </p>
                <p>
                  <span className="font-medium">Medication Effectiveness:</span> Your HbA1c has improved from 7.8% to
                  7.2% over the past 6 months, showing your current treatment plan is having a positive effect.
                  Continuing with the suggested lifestyle modifications could help reach the target of under 7.0%.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

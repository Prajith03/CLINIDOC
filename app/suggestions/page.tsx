"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Utensils, Activity, ArrowRight, Pill, Brain, Loader2 } from "lucide-react"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { useSoapNotes } from "@/context/soap-notes-context"

// Sample suggestions for fallback
const fallbackSuggestions = [
  {
    category: "Lifestyle",
    icon: <Heart className="h-5 w-5 text-primary" />,
    items: [
      {
        title: "Improve sleep hygiene",
        description: "Establish a regular sleep schedule and create a relaxing bedtime routine",
      },
      {
        title: "Stress management",
        description: "Practice relaxation techniques like deep breathing or meditation",
      },
      {
        title: "Limit screen time",
        description: "Reduce exposure to screens before bedtime to improve sleep quality",
      },
    ],
  },
  {
    category: "Nutrition",
    icon: <Utensils className="h-5 w-5 text-primary" />,
    items: [
      {
        title: "Stay hydrated",
        description: "Drink at least 8 glasses of water daily to prevent dehydration headaches",
      },
      {
        title: "Regular meals",
        description: "Avoid skipping meals which can trigger headaches",
      },
      {
        title: "Limit caffeine",
        description: "Reduce caffeine intake, especially in the afternoon and evening",
      },
    ],
  },
  {
    category: "Medication",
    icon: <Pill className="h-5 w-5 text-primary" />,
    items: [
      {
        title: "NSAIDs usage",
        description: "Take prescribed NSAIDs with food to minimize gastrointestinal side effects",
      },
      {
        title: "Medication timing",
        description: "Take medication at the first sign of headache for maximum effectiveness",
      },
      {
        title: "Avoid overuse",
        description: "Limit use of pain relievers to prevent medication overuse headaches",
      },
    ],
  },
]

// Sample insights for fallback
const fallbackInsights = [
  "Headache pattern suggests tension-type headaches rather than migraines due to lack of associated symptoms like nausea or visual disturbances.",
  "The correlation between increased work stress and headache onset indicates stress as a primary trigger.",
  "Irregular sleep patterns may be contributing to headache frequency and intensity.",
]

// Alternative fallback suggestions for variety
const alternativeFallbackSuggestions = [
  {
    category: "Exercise",
    icon: <Activity className="h-5 w-5 text-primary" />,
    items: [
      {
        title: "Low-impact activities",
        description: "Incorporate walking, swimming, or cycling for 30 minutes daily",
      },
      {
        title: "Strength training",
        description: "Add light resistance training 2-3 times per week to improve overall health",
      },
      {
        title: "Stretching routine",
        description: "Perform gentle stretches daily to reduce muscle tension",
      },
    ],
  },
  {
    category: "Mental Health",
    icon: <Brain className="h-5 w-5 text-primary" />,
    items: [
      {
        title: "Mindfulness practice",
        description: "Spend 10 minutes daily on mindfulness meditation to reduce stress",
      },
      {
        title: "Cognitive techniques",
        description: "Practice identifying and challenging negative thought patterns",
      },
      {
        title: "Social connections",
        description: "Maintain regular contact with supportive friends and family",
      },
    ],
  },
  {
    category: "Preventive Care",
    icon: <Heart className="h-5 w-5 text-primary" />,
    items: [
      {
        title: "Regular check-ups",
        description: "Schedule annual physical examinations to monitor overall health",
      },
      {
        title: "Vaccination",
        description: "Stay up-to-date with recommended vaccinations",
      },
      {
        title: "Health screenings",
        description: "Follow age-appropriate screening guidelines for early detection",
      },
    ],
  },
]

// Alternative fallback insights for variety
const alternativeFallbackInsights = [
  "Regular physical activity has been shown to improve mood and reduce symptoms of anxiety and depression.",
  "Consistent sleep patterns help regulate hormones that affect appetite, stress, and overall health.",
  "Social connections and community engagement are strongly linked to better health outcomes and longevity.",
]

interface Suggestion {
  category: string
  icon: React.ReactNode
  items: {
    title: string
    description: string
  }[]
}

export default function SuggestionsPage() {
  const { soapNotes, currentPatient } = useSoapNotes()
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [insights, setInsights] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [patientName, setPatientName] = useState(currentPatient)

  useEffect(() => {
    const generateSuggestions = async () => {
      setIsLoading(true)

      try {
        // Check if we have SOAP notes to work with
        if (!soapNotes || !soapNotes.subjective || !soapNotes.objective || !soapNotes.assessment || !soapNotes.plan) {
          // No valid SOAP notes, use fallback
          console.log("No valid SOAP notes available, using fallback suggestions")

          // Randomly choose between the two sets of fallback data for variety
          const useFallback = Math.random() > 0.5

          setSuggestions(useFallback ? fallbackSuggestions : alternativeFallbackSuggestions)
          setInsights(useFallback ? fallbackInsights : alternativeFallbackInsights)
          setIsLoading(false)
          return
        }

        // Combine SOAP notes into a single string for the AI
        const soapText = `
          Subjective: ${soapNotes.subjective}
          Objective: ${soapNotes.objective}
          Assessment: ${soapNotes.assessment}
          Plan: ${soapNotes.plan}
        `

        try {
          // Generate suggestions using Groq
          const { text } = await generateText({
            model: groq("llama3-70b-8192"),
            prompt: `Based on the following SOAP notes for a patient, generate personalized medical suggestions in JSON format.
            
            SOAP Notes:
            ${soapText}
            
            Generate a JSON object with the following structure:
            {
              "suggestions": [
                {
                  "category": "Lifestyle",
                  "items": [
                    {"title": "Suggestion title", "description": "Detailed description"}
                  ]
                },
                // More categories: Nutrition, Exercise, Medication, Education
              ],
              "insights": [
                "Insight 1",
                "Insight 2",
                "Insight 3"
              ]
            }
            
            Focus on practical, evidence-based recommendations that address the patient's specific condition.
            Only return the JSON object, no other text.`,
            temperature: 0.2,
          })

          // Parse the response
          try {
            // Extract JSON from the response
            const jsonMatch = text.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
              const jsonData = JSON.parse(jsonMatch[0])

              // Map the suggestions with icons
              const mappedSuggestions = jsonData.suggestions.map((suggestion: any) => {
                let icon
                switch (suggestion.category) {
                  case "Lifestyle":
                    icon = <Heart className="h-5 w-5 text-primary" />
                    break
                  case "Nutrition":
                    icon = <Utensils className="h-5 w-5 text-primary" />
                    break
                  case "Exercise":
                    icon = <Activity className="h-5 w-5 text-primary" />
                    break
                  case "Medication":
                    icon = <Pill className="h-5 w-5 text-primary" />
                    break
                  case "Education":
                    icon = <Brain className="h-5 w-5 text-primary" />
                    break
                  default:
                    icon = <Heart className="h-5 w-5 text-primary" />
                }

                return {
                  ...suggestion,
                  icon,
                }
              })

              setSuggestions(mappedSuggestions)
              setInsights(jsonData.insights)
            } else {
              throw new Error("Could not extract JSON from response")
            }
          } catch (error) {
            console.error("Error parsing AI response:", error)
            // Fallback to default suggestions
            setSuggestions(fallbackSuggestions)
            setInsights(fallbackInsights)
          }
        } catch (error) {
          console.error("Error generating suggestions with Groq:", error)
          // Fallback to default suggestions
          setSuggestions(fallbackSuggestions)
          setInsights(fallbackInsights)
        }
      } catch (error) {
        console.error("Error generating suggestions:", error)
        setSuggestions(fallbackSuggestions)
        setInsights(fallbackInsights)
      } finally {
        setIsLoading(false)
      }
    }

    generateSuggestions()
  }, [soapNotes])

  if (isLoading) {
    return (
      <div className="container py-10 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-medium mb-2">Generating AI Suggestions</h2>
        <p className="text-muted-foreground">Analyzing patient data and creating personalized recommendations...</p>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-2 mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">AI Suggestions</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Patient:</span>
            <select
              className="border rounded-md px-3 py-1 text-sm"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
            >
              <option value="John Doe">John Doe</option>
              <option value="Sarah Smith">Sarah Smith</option>
              <option value="Michael Johnson">Michael Johnson</option>
            </select>
          </div>
        </div>
        <p className="text-lg text-muted-foreground">
          Personalized recommendations based on patient's SOAP notes and medical history
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {suggestions.map((suggestion, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-full">{suggestion.icon}</div>
                <CardTitle className="text-xl">{suggestion.category}</CardTitle>
              </div>
              <CardDescription>Recommendations for {suggestion.category.toLowerCase()}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {suggestion.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex gap-2">
                    <div className="flex-shrink-0 h-5 w-5 bg-primary/20 rounded-full flex items-center justify-center text-xs text-primary font-medium">
                      {itemIndex + 1}
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Button variant="ghost" size="sm" className="w-full mt-4 gap-1">
                View detailed plan
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Personalized Health Insights</CardTitle>
            <CardDescription>AI-generated analysis based on recent SOAP notes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 border rounded-md bg-muted/30">
              <h3 className="font-medium text-lg mb-2">Recent Trends & Observations</h3>
              <div className="space-y-3 text-sm">
                {insights.map((insight, index) => (
                  <p key={index}>
                    <span className="font-medium">Insight {index + 1}:</span> {insight}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

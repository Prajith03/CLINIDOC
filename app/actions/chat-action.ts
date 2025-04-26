"use server"

export type Message = {
  role: "user" | "assistant" | "system"
  content: string
}

// Sample responses for the medical chatbot
const sampleResponses = [
  "Based on the symptoms you've described, this could be consistent with several conditions. It's important to consult with your healthcare provider for a proper diagnosis.",

  "Regular exercise, a balanced diet, adequate sleep, and stress management are fundamental pillars of maintaining good health. Would you like more specific information about any of these areas?",

  "It's generally recommended to have an annual check-up with your primary care physician, even if you feel healthy. Regular screenings can help detect potential issues early.",

  "While I can provide general medical information, I can't diagnose specific conditions or prescribe treatments. It's important to discuss your symptoms with a qualified healthcare professional.",

  "Staying hydrated is crucial for many bodily functions. The general recommendation is about 8 glasses (64 ounces) of water per day, but individual needs may vary based on activity level, climate, and overall health.",

  "Many medications need to be taken consistently to maintain therapeutic levels in your system. If you've missed a dose, check the medication instructions or consult with your pharmacist about the appropriate action.",

  "Fever, cough, and fatigue can be symptoms of many different conditions, ranging from common cold to more serious infections. If symptoms persist or worsen, it's advisable to seek medical attention.",

  "Maintaining a healthy weight involves balancing caloric intake with physical activity. Small, sustainable lifestyle changes often lead to better long-term results than drastic diets.",

  "Sleep plays a vital role in physical health and emotional wellbeing. Adults typically need 7-9 hours of quality sleep per night. Consistent sleep schedules and a relaxing bedtime routine can help improve sleep quality.",
]

export async function chatWithMedicalAI(messages: Message[]): Promise<Message> {
  try {
    // Instead of calling an AI service, we'll use sample responses
    const randomIndex = Math.floor(Math.random() * sampleResponses.length)
    const responseText = sampleResponses[randomIndex]

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      role: "assistant",
      content: responseText,
    }
  } catch (error) {
    console.error("Error in medical AI chat:", error)
    return {
      role: "assistant",
      content:
        "I'm sorry, I encountered an error processing your request. Please try again or contact support if the issue persists.",
    }
  }
}

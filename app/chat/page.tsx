import { MedicalChatbot } from "@/components/medical-chatbot"

export default function ChatPage() {
  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-6">Medical Assistant</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Chat with our AI medical assistant for information about health topics, medical conditions, and general wellness
        advice
      </p>

      <div className="max-w-3xl mx-auto">
        <MedicalChatbot />

        <div className="mt-8 p-4 bg-muted rounded-lg text-sm">
          <h3 className="font-medium mb-2">Important Note</h3>
          <p>
            This AI assistant provides general medical information for educational purposes only. It is not a substitute
            for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare
            provider for medical concerns.
          </p>
        </div>
      </div>
    </div>
  )
}

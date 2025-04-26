import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import { SoapNotesProvider } from "@/context/soap-notes-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Clinidoc - Medical Transcription & Patient Management",
  description: "AI-powered medical transcription and patient management system",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <SoapNotesProvider>
            <Navbar />
            <main className="min-h-screen bg-background">{children}</main>
          </SoapNotesProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

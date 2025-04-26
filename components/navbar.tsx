"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"
import { Stethoscope, User, Lightbulb, MessageSquare } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Transcribe", icon: <Stethoscope className="mr-2 h-4 w-4" /> },
    { href: "/patient", label: "Patient Details", icon: <User className="mr-2 h-4 w-4" /> },
    { href: "/suggestions", label: "AI Suggestions", icon: <Lightbulb className="mr-2 h-4 w-4" /> },
    { href: "/chat", label: "Medical Chat", icon: <MessageSquare className="mr-2 h-4 w-4" /> },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Stethoscope className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Clinidoc</span>
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"> </span>
        </div>

        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
                pathname === item.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <span className="text-sm text-muted-foreground">Dr. Sarah Johnson</span>
        </div>
      </div>
    </header>
  )
}

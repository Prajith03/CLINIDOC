"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { UserPlus } from "lucide-react"
import { useSoapNotes } from "@/context/soap-notes-context"

export function AddPatientForm() {
  const { addPatient } = useSoapNotes()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Male",
    phone: "",
    email: "",
    address: "",
    allergies: "",
    medications: "",
    medicalHistory: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Create a new patient object
    const newPatient = {
      id: Date.now(), // Use timestamp as temporary ID
      name: formData.name,
      age: Number.parseInt(formData.age) || 0,
      gender: formData.gender,
      contact: {
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
      },
      medicalHistory: {
        chronicConditions: [],
        surgeries: [],
        allergies: formData.allergies.split(",").map((allergy) => ({
          name: allergy.trim(),
          severity: "unknown",
        })),
        medications: formData.medications.split(",").map((med) => ({
          name: med.trim(),
          dosage: "Not specified",
          purpose: "Not specified",
        })),
      },
      diagnosis: [],
      labResults: {},
      appointments: {
        upcoming: [],
        past: [],
      },
    }

    // Add the patient to the context
    addPatient(newPatient)

    // Reset form and close dialog
    setFormData({
      name: "",
      age: "",
      gender: "Male",
      phone: "",
      email: "",
      address: "",
      allergies: "",
      medications: "",
      medicalHistory: "",
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add New Patient
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Patient</DialogTitle>
            <DialogDescription>
              Enter the patient's basic information. You can add more detailed medical history later.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-right">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age" className="text-right">
                  Age <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  min="0"
                  max="120"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                name="gender"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" value={formData.address} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies (comma separated)</Label>
              <Input
                id="allergies"
                name="allergies"
                placeholder="e.g., Penicillin, Peanuts, Latex"
                value={formData.allergies}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medications">Current Medications (comma separated)</Label>
              <Input
                id="medications"
                name="medications"
                placeholder="e.g., Lisinopril, Metformin, Atorvastatin"
                value={formData.medications}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicalHistory">Brief Medical History</Label>
              <Textarea
                id="medicalHistory"
                name="medicalHistory"
                placeholder="Enter any relevant medical history, chronic conditions, or past surgeries"
                value={formData.medicalHistory}
                onChange={handleChange}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Patient</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

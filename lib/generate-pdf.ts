import type { JsPDF } from "jspdf"

interface PatientData {
  id: number
  name: string
  age: number
  gender: string
  contact?: {
    phone: string
    email: string
    address: string
  }
  medicalHistory: {
    chronicConditions: Array<{ name: string; diagnosedYear: number | string }>
    surgeries: Array<{ name: string; year: number }>
    allergies: Array<{ name: string; severity: string }>
    medications: Array<{ name: string; dosage: string; purpose: string }>
  }
  diagnosis: Array<{
    name: string
    date: string
    status: string
    notes: string
  }>
  labResults: Record<
    string,
    {
      date: string
      results: Array<{ name: string; value: string }>
    }
  >
  appointments: {
    upcoming: Array<{
      type: string
      doctor: string
      date: string
      time: string
    }>
    past: Array<{
      type: string
      doctor: string
      date: string
      time: string
    }>
  }
}

export async function generatePatientPDF(patient: PatientData): Promise<void> {
  try {
    // Dynamically import jsPDF and jspdf-autotable
    const jsPDFModule = await import("jspdf")
    const autoTableModule = await import("jspdf-autotable")

    const jsPDF = jsPDFModule.default
    const autoTable = autoTableModule.default

    // Create a new PDF document
    const doc = new jsPDF() as JsPDF & { lastAutoTable?: { finalY: number } }

    // Set document properties
    doc.setProperties({
      title: `Patient Record - ${patient.name}`,
      subject: "Medical Record",
      author: "Clinidoc",
      creator: "Clinidoc Medical System",
    })

    // Add header with logo and title
    doc.setFontSize(22)
    doc.setTextColor(41, 128, 185) // Primary color
    doc.text("CLINIDOC", 105, 15, { align: "center" })

    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text(`Patient Medical Record`, 105, 25, { align: "center" })

    // Add patient basic information
    doc.setFontSize(14)
    doc.setTextColor(41, 128, 185)
    doc.text("Patient Information", 14, 35)

    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text(`Name: ${patient.name}`, 14, 45)
    doc.text(`Age: ${patient.age}`, 14, 52)
    doc.text(`Gender: ${patient.gender}`, 14, 59)

    // Add contact information if available
    if (patient.contact) {
      doc.text(`Phone: ${patient.contact.phone || "N/A"}`, 120, 45)
      doc.text(`Email: ${patient.contact.email || "N/A"}`, 120, 52)
      doc.text(`Address: ${patient.contact.address || "N/A"}`, 120, 59)
    }

    // Add medical history section
    doc.setFontSize(14)
    doc.setTextColor(41, 128, 185)
    doc.text("Medical History", 14, 70)

    // Chronic conditions
    if (patient.medicalHistory.chronicConditions.length > 0) {
      autoTable(doc, {
        head: [["Chronic Conditions", "Diagnosed Year"]],
        body: patient.medicalHistory.chronicConditions.map((condition) => [
          condition.name,
          condition.diagnosedYear.toString(),
        ]),
        startY: 75,
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185] },
      })
    } else {
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.text("No chronic conditions reported", 14, 75)
    }

    // Get the last Y position
    let lastY = doc.lastAutoTable?.finalY || 75
    lastY += 10

    // Surgeries
    doc.setFontSize(14)
    doc.setTextColor(41, 128, 185)
    doc.text("Surgeries", 14, lastY)

    if (patient.medicalHistory.surgeries.length > 0) {
      autoTable(doc, {
        head: [["Surgery", "Year"]],
        body: patient.medicalHistory.surgeries.map((surgery) => [surgery.name, surgery.year.toString()]),
        startY: lastY + 5,
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185] },
      })
    } else {
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.text("No surgeries reported", 14, lastY + 5)
      lastY += 10
    }

    // Get the last Y position
    lastY = doc.lastAutoTable?.finalY || lastY + 15
    lastY += 10

    // Check if we need a new page
    if (lastY > 250) {
      doc.addPage()
      lastY = 20
    }

    // Allergies
    doc.setFontSize(14)
    doc.setTextColor(41, 128, 185)
    doc.text("Allergies", 14, lastY)

    if (patient.medicalHistory.allergies.length > 0) {
      autoTable(doc, {
        head: [["Allergy", "Severity"]],
        body: patient.medicalHistory.allergies.map((allergy) => [allergy.name, allergy.severity]),
        startY: lastY + 5,
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185] },
      })
    } else {
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.text("No allergies reported", 14, lastY + 5)
      lastY += 10
    }

    // Get the last Y position
    lastY = doc.lastAutoTable?.finalY || lastY + 15
    lastY += 10

    // Check if we need a new page
    if (lastY > 250) {
      doc.addPage()
      lastY = 20
    }

    // Medications
    doc.setFontSize(14)
    doc.setTextColor(41, 128, 185)
    doc.text("Current Medications", 14, lastY)

    if (patient.medicalHistory.medications.length > 0) {
      autoTable(doc, {
        head: [["Medication", "Dosage", "Purpose"]],
        body: patient.medicalHistory.medications.map((medication) => [
          medication.name,
          medication.dosage,
          medication.purpose,
        ]),
        startY: lastY + 5,
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185] },
      })
    } else {
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.text("No current medications reported", 14, lastY + 5)
      lastY += 10
    }

    // Get the last Y position
    lastY = doc.lastAutoTable?.finalY || lastY + 15
    lastY += 10

    // Check if we need a new page
    if (lastY > 250) {
      doc.addPage()
      lastY = 20
    }

    // Diagnoses
    doc.setFontSize(14)
    doc.setTextColor(41, 128, 185)
    doc.text("Diagnoses", 14, lastY)

    if (patient.diagnosis.length > 0) {
      autoTable(doc, {
        head: [["Diagnosis", "Date", "Status"]],
        body: patient.diagnosis.map((diagnosis) => [diagnosis.name, diagnosis.date, diagnosis.status]),
        startY: lastY + 5,
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185] },
      })

      // Add diagnosis notes
      lastY = doc.lastAutoTable?.finalY || lastY + 30
      lastY += 10

      if (lastY > 250) {
        doc.addPage()
        lastY = 20
      }

      doc.setFontSize(14)
      doc.setTextColor(41, 128, 185)
      doc.text("Diagnosis Notes", 14, lastY)

      lastY += 10
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)

      patient.diagnosis.forEach((diagnosis, index) => {
        const textLines = doc.splitTextToSize(`${diagnosis.name}: ${diagnosis.notes}`, 180)

        if (lastY + textLines.length * 7 > 280) {
          doc.addPage()
          lastY = 20
        }

        doc.text(textLines, 14, lastY)
        lastY += textLines.length * 7 + 5
      })
    } else {
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.text("No diagnoses reported", 14, lastY + 5)
      lastY += 15
    }

    // Check if we need a new page
    if (lastY > 250) {
      doc.addPage()
      lastY = 20
    }

    // Lab Results
    if (Object.keys(patient.labResults).length > 0) {
      doc.setFontSize(14)
      doc.setTextColor(41, 128, 185)
      doc.text("Lab Results", 14, lastY)

      lastY += 10
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)

      Object.entries(patient.labResults).forEach(([key, test]) => {
        const testName =
          key === "cbc"
            ? "Complete Blood Count (CBC)"
            : key === "lipidPanel"
              ? "Lipid Panel"
              : key === "diabetesMonitoring"
                ? "Diabetes Monitoring"
                : key === "thyroidPanel"
                  ? "Thyroid Panel"
                  : key === "cardiacEnzymes"
                    ? "Cardiac Enzymes"
                    : key

        if (lastY > 250) {
          doc.addPage()
          lastY = 20
        }

        doc.setFontSize(13)
        doc.setTextColor(41, 128, 185)
        doc.text(`${testName} (${test.date})`, 14, lastY)

        lastY += 7
        doc.setFontSize(12)
        doc.setTextColor(0, 0, 0)

        test.results.forEach((result, index) => {
          if (lastY > 280) {
            doc.addPage()
            lastY = 20
          }

          doc.text(`${result.name}: ${result.value}`, 20, lastY)
          lastY += 7
        })

        lastY += 5
      })
    }

    // Check if we need a new page
    if (lastY > 250) {
      doc.addPage()
      lastY = 20
    }

    // Appointments
    doc.setFontSize(14)
    doc.setTextColor(41, 128, 185)
    doc.text("Upcoming Appointments", 14, lastY)

    if (patient.appointments.upcoming.length > 0) {
      autoTable(doc, {
        head: [["Type", "Doctor", "Date", "Time"]],
        body: patient.appointments.upcoming.map((appointment) => [
          appointment.type,
          appointment.doctor,
          appointment.date,
          appointment.time,
        ]),
        startY: lastY + 5,
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185] },
      })
    } else {
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.text("No upcoming appointments scheduled", 14, lastY + 5)
      lastY += 10
    }

    // Get the last Y position
    lastY = doc.lastAutoTable?.finalY || lastY + 15
    lastY += 10

    // Check if we need a new page
    if (lastY > 250) {
      doc.addPage()
      lastY = 20
    }

    // Past Appointments
    doc.setFontSize(14)
    doc.setTextColor(41, 128, 185)
    doc.text("Past Appointments", 14, lastY)

    if (patient.appointments.past.length > 0) {
      autoTable(doc, {
        head: [["Type", "Doctor", "Date", "Time"]],
        body: patient.appointments.past.map((appointment) => [
          appointment.type,
          appointment.doctor,
          appointment.date,
          appointment.time,
        ]),
        startY: lastY + 5,
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185] },
      })
    } else {
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.text("No past appointments recorded", 14, lastY + 5)
    }

    // Add footer with date
    const today = new Date()
    const dateStr = today.toLocaleDateString()

    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Generated on: ${dateStr}`, 14, 285)
    doc.text("Clinidoc Medical System", 105, 285, { align: "center" })
    doc.text("Page " + doc.getNumberOfPages(), 196, 285)

    // Save the PDF
    doc.save(`${patient.name.replace(/\s+/g, "_")}_Medical_Record.pdf`)
  } catch (error) {
    console.error("Error generating PDF:", error)
    throw error
  }
}

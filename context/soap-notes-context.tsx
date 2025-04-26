"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface SoapNotes {
  subjective: string
  objective: string
  assessment: string
  plan: string
}

interface PatientContact {
  phone: string
  email: string
  address: string
}

interface Condition {
  name: string
  diagnosedYear: number | string
}

interface Surgery {
  name: string
  year: number
}

interface Allergy {
  name: string
  severity: string
}

interface Medication {
  name: string
  dosage: string
  purpose: string
}

interface MedicalHistory {
  chronicConditions: Condition[]
  surgeries: Surgery[]
  allergies: Allergy[]
  medications: Medication[]
}

interface Diagnosis {
  name: string
  date: string
  status: string
  notes: string
}

interface LabResult {
  date: string
  results: { name: string; value: string }[]
}

interface Appointment {
  type: string
  doctor: string
  date: string
  time: string
}

interface Patient {
  id: number
  name: string
  age: number
  gender: string
  contact?: PatientContact
  medicalHistory: MedicalHistory
  diagnosis: Diagnosis[]
  labResults: Record<string, LabResult>
  appointments: {
    upcoming: Appointment[]
    past: Appointment[]
  }
}

interface SoapNotesContextType {
  soapNotes: SoapNotes | null
  setSoapNotes: (notes: SoapNotes | null) => void
  transcript: string | null
  setTranscript: (transcript: string | null) => void
  currentPatient: string
  setCurrentPatient: (patient: string) => void
  patients: Patient[]
  addPatient: (patient: Patient) => void
  getPatientByName: (name: string) => Patient | undefined
}

// Initial patients data
const initialPatients: Patient[] = [
  {
    id: 1,
    name: "John Doe",
    age: 42,
    gender: "Male",
    medicalHistory: {
      chronicConditions: [
        { name: "Type 2 Diabetes", diagnosedYear: 2018 },
        { name: "Hypertension", diagnosedYear: 2019 },
        { name: "Mild Asthma", diagnosedYear: "childhood" },
      ],
      surgeries: [
        { name: "Appendectomy", year: 2010 },
        { name: "Knee arthroscopy", year: 2015 },
      ],
      allergies: [
        { name: "Penicillin", severity: "moderate" },
        { name: "Shellfish", severity: "severe" },
        { name: "Pollen", severity: "mild, seasonal" },
      ],
      medications: [
        { name: "Metformin", dosage: "500mg, twice daily", purpose: "For diabetes" },
        { name: "Lisinopril", dosage: "10mg, once daily", purpose: "For hypertension" },
        { name: "Albuterol", dosage: "As needed", purpose: "For asthma" },
        { name: "Atorvastatin", dosage: "20mg, once daily", purpose: "For cholesterol" },
      ],
    },
    diagnosis: [
      {
        name: "Type 2 Diabetes Mellitus",
        date: "March 15, 2018",
        status: "Ongoing",
        notes:
          "Patient has been managing Type 2 Diabetes with medication and lifestyle changes. Recent HbA1c levels show moderate control at 7.2% (target <7.0%).",
      },
      {
        name: "Hypertension",
        date: "June 22, 2019",
        status: "Ongoing",
        notes:
          "Blood pressure has been generally well-controlled with medication. Recent readings average 138/85 mmHg (target <130/80 mmHg).",
      },
      {
        name: "Upper Respiratory Infection",
        date: "January 5, 2023",
        status: "Resolved",
        notes:
          "Patient presented with cough, congestion, and low-grade fever. Treated with rest, fluids, and over-the-counter medications. Symptoms resolved within 10 days.",
      },
    ],
    labResults: {
      cbc: {
        date: "March 10, 2023",
        results: [
          { name: "WBC", value: "7.2 K/uL" },
          { name: "RBC", value: "4.8 M/uL" },
          { name: "Hemoglobin", value: "14.2 g/dL" },
          { name: "Hematocrit", value: "42%" },
        ],
      },
      lipidPanel: {
        date: "March 10, 2023",
        results: [
          { name: "Total Cholesterol", value: "195 mg/dL" },
          { name: "HDL", value: "45 mg/dL" },
          { name: "LDL", value: "120 mg/dL" },
          { name: "Triglycerides", value: "150 mg/dL" },
        ],
      },
      diabetesMonitoring: {
        date: "March 10, 2023",
        results: [
          { name: "Fasting Glucose", value: "135 mg/dL" },
          { name: "HbA1c", value: "7.2%" },
        ],
      },
    },
    appointments: {
      upcoming: [
        {
          type: "Annual Physical Examination",
          doctor: "Dr. Sarah Johnson",
          date: "July 15, 2023",
          time: "10:30 AM",
        },
        {
          type: "Diabetes Follow-up",
          doctor: "Dr. Michael Chen",
          date: "August 3, 2023",
          time: "2:15 PM",
        },
      ],
      past: [
        {
          type: "Quarterly Diabetes Check",
          doctor: "Dr. Michael Chen",
          date: "March 10, 2023",
          time: "1:45 PM",
        },
        {
          type: "Blood Pressure Follow-up",
          doctor: "Dr. Sarah Johnson",
          date: "January 22, 2023",
          time: "9:15 AM",
        },
      ],
    },
  },
  {
    id: 2,
    name: "Sarah Smith",
    age: 35,
    gender: "Female",
    medicalHistory: {
      chronicConditions: [
        { name: "Migraine", diagnosedYear: 2015 },
        { name: "Anxiety Disorder", diagnosedYear: 2017 },
      ],
      surgeries: [{ name: "Tonsillectomy", year: 2010 }],
      allergies: [
        { name: "Dust mites", severity: "moderate" },
        { name: "Latex", severity: "mild" },
      ],
      medications: [
        { name: "Sumatriptan", dosage: "50mg, as needed", purpose: "For migraines" },
        { name: "Escitalopram", dosage: "10mg, once daily", purpose: "For anxiety" },
      ],
    },
    diagnosis: [
      {
        name: "Chronic Migraine",
        date: "April 10, 2015",
        status: "Ongoing",
        notes:
          "Patient experiences 3-4 migraine episodes per month, typically lasting 6-12 hours. Triggers include stress, lack of sleep, and certain foods.",
      },
      {
        name: "Generalized Anxiety Disorder",
        date: "September 5, 2017",
        status: "Ongoing",
        notes:
          "Patient reports persistent worry and difficulty relaxing. Currently managed with medication and cognitive behavioral therapy.",
      },
    ],
    labResults: {
      cbc: {
        date: "February 15, 2023",
        results: [
          { name: "WBC", value: "6.8 K/uL" },
          { name: "RBC", value: "4.5 M/uL" },
          { name: "Hemoglobin", value: "13.8 g/dL" },
          { name: "Hematocrit", value: "41%" },
        ],
      },
      thyroidPanel: {
        date: "February 15, 2023",
        results: [
          { name: "TSH", value: "2.4 mIU/L" },
          { name: "Free T4", value: "1.1 ng/dL" },
        ],
      },
    },
    appointments: {
      upcoming: [
        {
          type: "Anxiety Management Follow-up",
          doctor: "Dr. Sarah Johnson",
          date: "July 20, 2023",
          time: "1:00 PM",
        },
      ],
      past: [
        {
          type: "Annual Physical",
          doctor: "Dr. Sarah Johnson",
          date: "February 15, 2023",
          time: "10:00 AM",
        },
        {
          type: "Migraine Consultation",
          doctor: "Dr. Robert Lee",
          date: "November 12, 2022",
          time: "3:30 PM",
        },
      ],
    },
  },
  {
    id: 3,
    name: "Michael Johnson",
    age: 58,
    gender: "Male",
    medicalHistory: {
      chronicConditions: [
        { name: "Coronary Artery Disease", diagnosedYear: 2016 },
        { name: "Osteoarthritis", diagnosedYear: 2019 },
      ],
      surgeries: [
        { name: "Coronary Bypass Surgery", year: 2017 },
        { name: "Knee Replacement (Right)", year: 2020 },
      ],
      allergies: [{ name: "Sulfa drugs", severity: "severe" }],
      medications: [
        { name: "Atorvastatin", dosage: "40mg, once daily", purpose: "For cholesterol" },
        { name: "Aspirin", dosage: "81mg, once daily", purpose: "For heart health" },
        { name: "Metoprolol", dosage: "25mg, twice daily", purpose: "For blood pressure" },
        { name: "Acetaminophen", dosage: "500mg, as needed", purpose: "For joint pain" },
      ],
    },
    diagnosis: [
      {
        name: "Coronary Artery Disease",
        date: "October 3, 2016",
        status: "Ongoing",
        notes:
          "Patient underwent CABG in 2017. Currently stable with medication management and lifestyle modifications.",
      },
      {
        name: "Osteoarthritis",
        date: "March 15, 2019",
        status: "Ongoing",
        notes:
          "Primarily affecting knees and hands. Right knee replacement in 2020 with good recovery. Left knee shows moderate degeneration.",
      },
    ],
    labResults: {
      cbc: {
        date: "April 5, 2023",
        results: [
          { name: "WBC", value: "7.5 K/uL" },
          { name: "RBC", value: "4.6 M/uL" },
          { name: "Hemoglobin", value: "14.5 g/dL" },
          { name: "Hematocrit", value: "43%" },
        ],
      },
      lipidPanel: {
        date: "April 5, 2023",
        results: [
          { name: "Total Cholesterol", value: "165 mg/dL" },
          { name: "HDL", value: "42 mg/dL" },
          { name: "LDL", value: "95 mg/dL" },
          { name: "Triglycerides", value: "140 mg/dL" },
        ],
      },
      cardiacEnzymes: {
        date: "April 5, 2023",
        results: [
          { name: "Troponin I", value: "<0.01 ng/mL" },
          { name: "CK-MB", value: "3.1 ng/mL" },
        ],
      },
    },
    appointments: {
      upcoming: [
        {
          type: "Cardiology Follow-up",
          doctor: "Dr. James Wilson",
          date: "July 25, 2023",
          time: "9:00 AM",
        },
        {
          type: "Orthopedic Evaluation",
          doctor: "Dr. Lisa Chen",
          date: "August 10, 2023",
          time: "11:30 AM",
        },
      ],
      past: [
        {
          type: "Annual Physical",
          doctor: "Dr. Sarah Johnson",
          date: "April 5, 2023",
          time: "2:00 PM",
        },
        {
          type: "Cardiac Stress Test",
          doctor: "Dr. James Wilson",
          date: "January 15, 2023",
          time: "10:30 AM",
        },
      ],
    },
  },
]

const SoapNotesContext = createContext<SoapNotesContextType | undefined>(undefined)

export function SoapNotesProvider({ children }: { children: ReactNode }) {
  const [soapNotes, setSoapNotes] = useState<SoapNotes | null>(null)
  const [transcript, setTranscript] = useState<string | null>(null)
  const [currentPatient, setCurrentPatient] = useState<string>("John Doe")
  const [patients, setPatients] = useState<Patient[]>(initialPatients)

  const addPatient = (patient: Patient) => {
    console.log("Adding patient:", patient)
    setPatients((prev) => [...prev, patient])
    // Optionally set the current patient to the newly added one
    setCurrentPatient(patient.name)
  }

  const getPatientByName = (name: string) => {
    return patients.find((patient) => patient.name === name)
  }

  return (
    <SoapNotesContext.Provider
      value={{
        soapNotes,
        setSoapNotes,
        transcript,
        setTranscript,
        currentPatient,
        setCurrentPatient,
        patients,
        addPatient,
        getPatientByName,
      }}
    >
      {children}
    </SoapNotesContext.Provider>
  )
}

export function useSoapNotes() {
  const context = useContext(SoapNotesContext)
  if (context === undefined) {
    throw new Error("useSoapNotes must be used within a SoapNotesProvider")
  }
  return context
}

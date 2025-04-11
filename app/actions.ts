"use server"

import fs from "fs/promises"
import path from "path"
import { v4 as uuidv4 } from "uuid"

interface Attendee {
  id: string
  name: string
  email: string
  phone: string
  consent: boolean
  registeredAt: string
}

const CSV_FILE_PATH = path.join(process.cwd(), "data", "registrations.csv")

// Ensure the data directory exists
async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), "data")
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Initialize CSV file if it doesn't exist
async function initializeCsvFile() {
  try {
    await fs.access(CSV_FILE_PATH)
  } catch {
    await ensureDataDirectory()
    await fs.writeFile(CSV_FILE_PATH, "id,name,email,phone,consent,registeredAt\n")
  }
}

// Register a new attendee
export async function registerAttendee(data: { name: string; email: string; phone: string; consent: boolean }) {
  await initializeCsvFile()

  const attendee: Attendee = {
    id: uuidv4(),
    name: data.name,
    email: data.email,
    phone: data.phone || "",
    consent: data.consent,
    registeredAt: new Date().toISOString(),
  }

  // Escape commas and quotes in CSV values
  const escapeCsv = (value: string | boolean) => {
    const stringValue = String(value)
    if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
      return `"${stringValue.replace(/"/g, '""')}"`
    }
    return stringValue
  }

  const csvLine =
    [
      escapeCsv(attendee.id),
      escapeCsv(attendee.name),
      escapeCsv(attendee.email),
      escapeCsv(attendee.phone),
      escapeCsv(attendee.consent),
      escapeCsv(attendee.registeredAt),
    ].join(",") + "\n"

  await fs.appendFile(CSV_FILE_PATH, csvLine)

  return { success: true }
}

// Get all attendees
export async function getAttendees(): Promise<Attendee[]> {
  await initializeCsvFile()

  const csvContent = await fs.readFile(CSV_FILE_PATH, "utf-8")
  const lines = csvContent.trim().split("\n")

  // Skip header row
  if (lines.length <= 1) {
    return []
  }

  const attendees: Attendee[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]

    // Handle CSV parsing with quoted fields that may contain commas
    const values: string[] = []
    let currentValue = ""
    let insideQuotes = false

    for (let j = 0; j < line.length; j++) {
      const char = line[j]

      if (char === '"') {
        if (insideQuotes && j + 1 < line.length && line[j + 1] === '"') {
          // Double quotes inside quoted field
          currentValue += '"'
          j++ // Skip the next quote
        } else {
          // Toggle quote state
          insideQuotes = !insideQuotes
        }
      } else if (char === "," && !insideQuotes) {
        // End of field
        values.push(currentValue)
        currentValue = ""
      } else {
        currentValue += char
      }
    }

    // Add the last value
    values.push(currentValue)

    if (values.length >= 6) {
      attendees.push({
        id: values[0],
        name: values[1],
        email: values[2],
        phone: values[3],
        consent: values[4].toLowerCase() === "true",
        registeredAt: values[5],
      })
    }
  }

  return attendees
}

// Delete an attendee
export async function deleteAttendee(id: string) {
  await initializeCsvFile()

  const attendees = await getAttendees()
  const filteredAttendees = attendees.filter((attendee) => attendee.id !== id)

  // Recreate the CSV file
  const header = "id,name,email,phone,consent,registeredAt\n"
  const csvContent = filteredAttendees
    .map((attendee) => {
      const escapeCsv = (value: string | boolean) => {
        const stringValue = String(value)
        if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
      }

      return [
        escapeCsv(attendee.id),
        escapeCsv(attendee.name),
        escapeCsv(attendee.email),
        escapeCsv(attendee.phone),
        escapeCsv(attendee.consent),
        escapeCsv(attendee.registeredAt),
      ].join(",")
    })
    .join("\n")

  await fs.writeFile(CSV_FILE_PATH, header + (csvContent ? csvContent + "\n" : ""))

  return { success: true }
}

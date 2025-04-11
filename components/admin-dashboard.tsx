"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { deleteAttendee } from "@/app/actions"
import { Download, Search, Trash2, Loader2, Check, X } from "lucide-react"

interface Attendee {
  id: string
  name: string
  email: string
  phone: string
  consent: boolean
  registeredAt: string
}

interface AdminDashboardProps {
  initialAttendees: Attendee[]
}

export function AdminDashboard({ initialAttendees }: AdminDashboardProps) {
  const [attendees, setAttendees] = useState<Attendee[]>(initialAttendees)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date)
  }

  // Handle search
  const filteredAttendees = attendees.filter(
    (attendee) =>
      attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.phone.includes(searchTerm),
  )

  // Handle delete
  const handleDelete = async (id: string) => {
    setIsDeleting(id)
    try {
      await deleteAttendee(id)
      setAttendees((prev) => prev.filter((attendee) => attendee.id !== id))
    } catch (error) {
      console.error("Failed to delete attendee:", error)
    } finally {
      setIsDeleting(null)
    }
  }

  // Export to CSV
  const exportToCsv = () => {
    const header = "Name,Email,Phone,Consent,Registered At\n"
    const csvContent = attendees
      .map((attendee) => {
        const escapeCsv = (value: string | boolean) => {
          const stringValue = String(value)
          if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
            return `"${stringValue.replace(/"/g, '""')}"`
          }
          return stringValue
        }

        return [
          escapeCsv(attendee.name),
          escapeCsv(attendee.email),
          escapeCsv(attendee.phone),
          escapeCsv(attendee.consent),
          escapeCsv(attendee.registeredAt),
        ].join(",")
      })
      .join("\n")

    const blob = new Blob([header + csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute(
      "download",
      `international-womens-day-registrations-${new Date().toISOString().split("T")[0]}.csv`,
    )
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search registrations..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Button
          onClick={exportToCsv}
          variant="outline"
          className="border-[#00adef] text-[#00adef] hover:bg-[#00adef] hover:text-white"
        >
          <Download className="mr-2 h-4 w-4" />
          Export to CSV
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Phone</TableHead>
              <TableHead className="font-semibold">Consent</TableHead>
              <TableHead className="font-semibold">Registered At</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAttendees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  {searchTerm ? "No matching registrations found" : "No registrations yet"}
                </TableCell>
              </TableRow>
            ) : (
              filteredAttendees.map((attendee) => (
                <TableRow key={attendee.id}>
                  <TableCell className="font-medium">{attendee.name}</TableCell>
                  <TableCell>{attendee.email}</TableCell>
                  <TableCell>{attendee.phone || "-"}</TableCell>
                  <TableCell>
                    {attendee.consent ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-red-500" />
                    )}
                  </TableCell>
                  <TableCell>{formatDate(attendee.registeredAt)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(attendee.id)}
                      disabled={isDeleting === attendee.id}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      {isDeleting === attendee.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-gray-500">Total Registrations: {attendees.length}</div>
    </div>
  )
}

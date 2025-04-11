import { getAttendees } from "@/app/actions"
import { AdminDashboard } from "@/components/admin-dashboard"
import Image from "next/image"
import Link from "next/link"

export default async function AdminPage() {
  const attendees = await getAttendees()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div className="flex items-center justify-between w-full">
            <div className="w-40 h-auto">
              <Image src="/images/coopbank-logo.png" alt="CoopBank Logo" width={200} height={75} priority />
            </div>
            <h1 className="text-3xl font-bold text-[#00adef]">Admin Dashboard</h1>
            <div className="w-40 h-auto">
              <Image src="/images/dxvalley-logo.png" alt="DxVALLEY Logo" width={200} height={75} priority />
            </div>
          </div>
        </header>

        <div className="flex justify-end mb-4">
          <Link href="/" className="text-[#00adef] hover:underline flex items-center">
            ← Back to Registration Page
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            International Women&apos;s Day Event Registrations
          </h2>
          <AdminDashboard initialAttendees={attendees} />
        </div>
      </div>
    </div>
  )
}

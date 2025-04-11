"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { registerAttendee } from "@/app/actions"
import { Loader2, SmilePlus, QrCode } from "lucide-react"
import { QRCode } from "@/components/qr-code"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showQrDialog, setShowQrDialog] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    consent: true,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, consent: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await registerAttendee({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        consent: formData.consent,
      })
      setIsSuccess(true)
      setFormData({ name: "", email: "", phone: "", consent: true })
    } catch (error) {
      console.error("Registration failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Auto-reset after 3 seconds when showing success message
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isSuccess) {
      timer = setTimeout(() => {
        setIsSuccess(false)
      }, 3000)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [isSuccess])

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-8 md:py-12 space-y-4 md:space-y-6">
        <div className="h-24 w-24 md:h-32 md:w-32 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
          <SmilePlus className="h-16 w-16 md:h-20 md:w-20 text-green-500" />
        </div>
        <h3 className="text-3xl md:text-3xl font-bold text-[#00adef] animate-pulse">Thank You for Registering!</h3>
        <p className="text-center text-xl md:text-2xl text-gray-600">
          We wish you have a memorable experience at the event! 🎉
        </p>
        <div className="mt-2 md:mt-4 text-center text-lg md:text-xl text-gray-500">
          Returning to registration form in a moment...
        </div>
      </div>
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div className="space-y-2 md:space-y-3">
          <Label htmlFor="name" className="text-gray-700 text-lg md:text-xl">
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
            className="border-gray-300 focus:border-[#00adef] focus:ring-[#00adef] text-lg md:text-xl py-4 md:py-6"
          />
        </div>

        <div className="space-y-2 md:space-y-3">
          <Label htmlFor="email" className="text-gray-700 text-lg md:text-xl">
            Email Address <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            required
            className="border-gray-300 focus:border-[#00adef] focus:ring-[#00adef] text-lg md:text-xl py-4 md:py-6"
          />
        </div>

        <div className="space-y-2 md:space-y-3">
          <Label htmlFor="phone" className="text-gray-700 text-lg md:text-xl">
            Phone Number (Optional)
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="border-gray-300 focus:border-[#00adef] focus:ring-[#00adef] text-lg md:text-xl py-4 md:py-6"
          />
        </div>

        <div className="flex items-start space-x-3 pt-2">
          <Checkbox
            id="consent"
            checked={formData.consent}
            onCheckedChange={handleCheckboxChange}
            className="h-5 w-5 md:h-6 md:w-6 mt-1"
          />
          <Label htmlFor="consent" className="text-gray-700 text-md md:text-md font-normal">
            I consent to be contacted via email about similar events in the future.
          </Label>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#00adef] hover:bg-[#0099d6] text-white font-medium py-4 md:py-6 px-4 rounded-md transition-all duration-200 mt-4 md:mt-6 text-lg md:text-xl"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 md:h-6 md:w-6 animate-spin" />
              Registering...
            </>
          ) : (
            "Register Now"
          )}
        </Button>

        {/* QR Code Button - Only visible on mobile */}
        <div className="md:hidden flex justify-center mt-4">
          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-2 border-[#00adef] text-[#00adef]"
            onClick={() => setShowQrDialog(true)}
          >
            <QrCode className="h-4 w-4" />
            <span>Show QR Code</span>
          </Button>
        </div>
      </form>

      {/* QR Code Dialog for Mobile */}
      <Dialog open={showQrDialog} onOpenChange={setShowQrDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scan QR Code</DialogTitle>
            <DialogDescription>
              Scan this QR code with another device to access the registration portal.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center p-4">
            <QRCode url="" size={200} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

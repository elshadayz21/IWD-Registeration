"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Wifi } from "lucide-react"

export function WifiInfo() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 border-[#00adef] text-[#00adef]">
          <Wifi className="h-4 w-4" />
          <span>WiFi Information</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-[#00adef]">Event WiFi Information</DialogTitle>
          <DialogDescription>Connect to the guest WiFi network using these credentials.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-[100px_1fr] gap-2">
            <div className="font-medium">Network:</div>
            <div>thqGuest</div>
            <div className="font-medium">Username:</div>
            <div className="font-mono bg-gray-100 px-2 py-1 rounded">guestcoop</div>
            <div className="font-medium">Password:</div>
            <div className="font-mono bg-gray-100 px-2 py-1 rounded">Guest@123</div>
          </div>
          <div className="text-sm text-gray-500 mt-2">
            <p>Note: Do not validate the certificate when connecting.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

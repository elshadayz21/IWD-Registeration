import Image from "next/image"
import { QRCode } from "@/components/qr-code"
import { RegistrationForm } from "@/components/registration-form"
import { WifiInfo } from "@/components/wifi-info"
import { Sparkles } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f9f4ff] to-white flex flex-col">
      <div className="container mx-auto px-4 py-6 flex flex-col h-full">
        <header className="flex flex-col items-center mb-4">
          <div className="flex items-center justify-between w-full mb-2">
            <div className="w-24 sm:w-32 md:w-48 h-auto">
              <a href="https://coopbankoromia.com.et" target="_blank">
              <Image src="/images/coopbank-logo.png" alt="CoopBank Logo" width={400} height={150} priority />
              </a>
            </div>
            <div className="w-24 sm:w-32 md:w-48 h-auto">
           <a href="https://dxvalley.com" target="_blank">
             <Image src="/images/dxvalley-logo.png" alt="DxVALLEY Logo" width={400} height={150} priority />
           </a>
            </div>
          </div>
          {/* <h1 className="text-3xl md:text-5xl font-bold text-[#00adef] text-center">
            International Women&apos;s Day Event
          </h1> */}
          <div className="flex items-center gap-2 mt-1">
            <Sparkles className="h-4 w-4 md:h-6 md:w-6 text-pink-500" />
            <p className="text-xl md:text-2xl text-pink-600 font-medium">Registration Portal</p>
            <Sparkles className="h-4 w-4 md:h-6 md:w-6 text-pink-500" />
          </div>
        </header>

        <div className="flex justify-center mb-4">
          <WifiInfo />
        </div>

        <div className="grid md:grid-cols-2 gap-6 flex-grow items-start mt-2">
          {/* QR Code Section - Hidden on mobile by default */}
          <div className="hidden md:flex flex-col bg-white p-6 rounded-xl shadow-lg border-2 border-[#00adef]/20 items-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#00adef] mb-4">Scan to Access on Mobile</h2>
            <div className="p-4 bg-white rounded-lg border-2 border-[#00adef]/30">
              <QRCode url="" size={280} />
            </div>
            <p className="mt-4 text-lg md:text-xl text-gray-600 text-center">
              Scan this QR code with your phone to access this registration portal on your mobile device.
            </p>
          </div>

          {/* Registration Form */}
          <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-pink-200 md:col-start-2">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#00adef] mb-4">Register Now</h2>
            <RegistrationForm />
          </div>
        </div>
      </div>
    </div>
  )
}

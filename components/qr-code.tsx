"use client"

import { useEffect, useRef, useState } from "react"
import QRCodeLib from "qrcode"

interface QRCodeProps {
  url: string
  size?: number
}

export function QRCode({ url: initialUrl, size = 200 }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [url, setUrl] = useState("")

  useEffect(() => {
    // Set the URL only on the client side
    setUrl(window.location.href)
  }, [])

  useEffect(() => {
    if (canvasRef.current && url) {
      QRCodeLib.toCanvas(
        canvasRef.current,
        url,
        {
          width: size,
          margin: 1,
          color: {
            dark: "#00adef",
            light: "#FFFFFF",
          },
        },
        (error) => {
          if (error) console.error("Error generating QR code:", error)
        },
      )
    }
  }, [url, size])

  return (
    <div className="flex justify-center">
      <canvas ref={canvasRef} />
    </div>
  )
}

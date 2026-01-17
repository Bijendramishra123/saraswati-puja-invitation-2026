"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FiPhone, FiUpload, FiCheck, FiCopy } from "react-icons/fi"
import { FaRupeeSign } from "react-icons/fa"
import type { ContentType } from "@/lib/content"
import { addPayment } from "@/lib/payment-store"

interface ContactSectionProps {
  content: ContentType
}

const phoneNumbers = ["8864074466", "7488242712"]
const UPI_ID = "9325784771@ibl"

function compressImage(file: File, maxWidth = 800, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        const canvas = document.createElement("canvas")
        let width = img.width
        let height = img.height

        // Scale down if larger than maxWidth
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext("2d")
        if (!ctx) {
          reject(new Error("Could not get canvas context"))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)
        const compressedBase64 = canvas.toDataURL("image/jpeg", quality)
        resolve(compressedBase64)
      }
      img.onerror = () => reject(new Error("Image load failed"))
      img.src = e.target?.result as string
    }
    reader.onerror = () => reject(new Error("File read failed"))
    reader.readAsDataURL(file)
  })
}

export function ContactSection({ content }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    branch: "",
    screenshot: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [upiCopied, setUpiCopied] = useState(false)
  const [error, setError] = useState("")
  const [uploadingImage, setUploadingImage] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadingImage(true)
      setError("")
      try {
        const compressedImage = await compressImage(file, 800, 0.6)
        setFormData((prev) => ({ ...prev, screenshot: compressedImage }))
      } catch (err) {
        setError("Image upload failed. Please try again.")
        console.error("[v0] Image compression error:", err)
      } finally {
        setUploadingImage(false)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.amount || !formData.branch || !formData.screenshot) {
      setError("Please fill all fields and upload screenshot")
      return
    }
    setSubmitting(true)
    setError("")

    try {
      console.log("[v0] Submitting payment:", { name: formData.name, amount: formData.amount, branch: formData.branch })
      const result = await addPayment(formData)
      console.log("[v0] Payment result:", result)
      if (result) {
        setSubmitted(true)
        setFormData({ name: "", amount: "", branch: "", screenshot: "" })
      } else {
        setError("Payment submit failed. Please try again.")
      }
    } catch (err: any) {
      console.error("[v0] Payment submission error:", err)
      setError(err?.message || "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const copyUpi = async () => {
    await navigator.clipboard.writeText(UPI_ID)
    setUpiCopied(true)
    setTimeout(() => setUpiCopied(false), 2000)
  }

  return (
    <section id="contact" className="py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Contact Card */}
        <Card
          className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-xl animate-fade-in-up"
          style={{ animationDelay: "0.6s" }}
        >
          <CardHeader className="text-center pb-4">
            <CardTitle className="font-serif text-2xl sm:text-3xl text-primary flex items-center justify-center gap-2">
              <FiPhone className="w-6 h-6" />
              {content.contact}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap justify-center gap-4">
            {phoneNumbers.map((phone) => (
              <Button
                key={phone}
                variant="outline"
                size="lg"
                className="gap-3 text-lg bg-secondary/50 border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                asChild
              >
                <a href={`tel:${phone}`}>
                  <FiPhone className="w-5 h-5" />
                  {phone}
                </a>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Financial Support Card with QR and Form */}
        <Card
          className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-xl animate-fade-in-up"
          style={{ animationDelay: "0.7s" }}
        >
          <CardHeader className="text-center pb-4">
            <CardTitle className="font-serif text-xl sm:text-2xl text-primary flex items-center justify-center gap-2">
              <FaRupeeSign className="w-5 h-5" />
              {content.financialSupport}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-base sm:text-lg text-foreground/85 italic text-center">{content.financialNote}</p>

            {/* QR Code Section */}
            <div className="bg-white rounded-xl p-4 sm:p-6 mx-auto max-w-xs border border-primary/20">
              <p className="text-center text-sm text-gray-600 mb-3 font-medium">{content.scanToPay}</p>
              <img src="/images/qr-code.png" alt="PhonePe QR Code" className="w-full rounded-lg" />
              <p className="text-center text-sm text-gray-700 mt-3 font-semibold">{content.payeeName}</p>
            </div>

            {/* UPI ID Section */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">{content.orPayViaUpi}</p>
              <div className="flex items-center justify-center gap-2">
                <code className="bg-secondary px-4 py-2 rounded-lg text-lg font-mono text-foreground">{UPI_ID}</code>
                <Button variant="outline" size="sm" onClick={copyUpi} className="gap-2 bg-transparent">
                  {upiCopied ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
                  {upiCopied ? content.copied : content.copyUpi}
                </Button>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-primary/20" />
              <span className="text-sm text-muted-foreground font-medium">{content.paymentForm}</span>
              <div className="h-px flex-1 bg-primary/20" />
            </div>

            {/* Payment Form */}
            {submitted ? (
              <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 p-4 rounded-xl text-center">
                <FiCheck className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">{content.thankYou}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{content.yourName}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    required
                    className="bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">{content.amount}</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData((p) => ({ ...p, amount: e.target.value }))}
                    required
                    className="bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branch">{content.branch}</Label>
                  <Input
                    id="branch"
                    value={formData.branch}
                    onChange={(e) => setFormData((p) => ({ ...p, branch: e.target.value }))}
                    required
                    className="bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="screenshot">{content.uploadScreenshot}</Label>
                  <div className="relative">
                    <Input
                      id="screenshot"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                      className="bg-secondary/50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground file:cursor-pointer"
                    />
                  </div>
                  {formData.screenshot && (
                    <img
                      src={formData.screenshot || "/placeholder.svg"}
                      alt="Payment screenshot preview"
                      className="mt-2 w-32 h-32 object-cover rounded-lg border border-primary/20"
                    />
                  )}
                </div>
                {error && (
                  <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 p-3 rounded-lg text-center text-sm">
                    {error}
                  </div>
                )}
                <Button type="submit" className="w-full gap-2" disabled={submitting || uploadingImage}>
                  {submitting || uploadingImage ? (
                    content.submitting
                  ) : (
                    <>
                      <FiUpload className="w-4 h-4" />
                      {content.submit}
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

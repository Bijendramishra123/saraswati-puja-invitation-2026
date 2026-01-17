"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FaWhatsapp } from "react-icons/fa"
import { FiCopy, FiCheck } from "react-icons/fi"
import type { ContentType, Language } from "@/lib/content"

interface ShareButtonsProps {
  content: ContentType
  language: Language
}

const WHATSAPP_CONTACT = "918864074466"

export function ShareButtons({ content, language }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const getInvitationText = () => {
    if (language === "hi") {
      return `॥ सरस्वती पूजा उत्सव निमंत्रण ॥

विद्यां ददाति विनयं, विनयाद् याति पात्रताम्।
पात्रत्वात् धनमाप्नोति, धनाद् धर्मं ततः सुखम्॥

प्रिय साथियों,
आप सभी को सादर नमस्कार!

इस शुभ अवसर पर, हम छात्र समिति, आपको सरस्वती पूजा के पावन पर्व के उपलक्ष्य में सादर आमंत्रित करते हैं।

📅 दिनांक: 23 जनवरी 2026 (शुक्रवार)
⏰ समय: सुबह 10:00 बजे से
🍲 प्रसाद वितरण: दोपहर 12:00 बजे
📍 स्थान: महाविद्यालय परिसर / हॉल 2

आपकी गरिमामयी उपस्थिति इस आयोजन की शोभा बढ़ाएगी।

संपर्क: 8864074466, 7488242712

- छात्र समिति, सरस्वती पूजा`
    }
    return `॥ Saraswati Puja Festival Invitation ॥

Dear Friends,
Warm greetings to all of you!

On this auspicious occasion, we cordially invite you to celebrate the sacred festival of Saraswati Puja.

📅 Date: January 23, 2026 (Friday)
⏰ Time: 10:00 AM onwards
🍲 Prasad Distribution: 12:00 PM
📍 Venue: College Campus / Hall 2

Your gracious presence will add to the glory of this celebration.

Contact: 8864074466, 7488242712

- Student Committee, Saraswati Puja`
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getInvitationText())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(getInvitationText())
    window.open(`https://wa.me/${WHATSAPP_CONTACT}?text=${text}`, "_blank")
  }

  return (
    <section className="py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
          style={{ animationDelay: "0.8s" }}
        >
          <Button
            size="lg"
            onClick={handleWhatsAppShare}
            className="gap-3 text-lg bg-[#25D366] hover:bg-[#128C7E] text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <FaWhatsapp className="w-6 h-6" />
            {content.shareWhatsApp}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={handleCopy}
            className="gap-3 text-lg border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all duration-300 bg-transparent"
          >
            {copied ? (
              <>
                <FiCheck className="w-5 h-5" />
                {content.copied}
              </>
            ) : (
              <>
                <FiCopy className="w-5 h-5" />
                {content.copyInvitation}
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  )
}

import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Contact } from "@/components/contact"

export const metadata: Metadata = {
  title: "Contact A3E Environmental Consultants | Get Expert Environmental Services",
  description: "Contact A3E Environmental Consultants for comprehensive environmental consulting services. Phase I/II ESAs, remediation, compliance, and emergency response available 24/7.",
  keywords: "environmental consulting contact, A3E contact, environmental services, Phase I ESA, environmental assessment",
}

export default function ContactUsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <Contact />
      </main>
      <Footer />
    </>
  )
}
import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Projects } from "@/components/projects"

export const metadata: Metadata = {
  title: "Environmental Projects | A3E Portfolio & Case Studies",
  description: "Explore A3E Environmental Consultants' successful projects including Phase I/II/III ESAs, remediation, and compliance solutions across various industries.",
  keywords: "environmental projects, case studies, Phase I ESA, remediation projects, environmental compliance, A3E portfolio",
}

export default function ProjectsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <Projects />
      </main>
      <Footer />
    </>
  )
}
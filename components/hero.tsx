import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Phone, Brain, Zap } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/placeholder.svg?height=1080&width=1920')`,
        }}
      >
        <div className="absolute inset-0 bg-emerald-900/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30">
          <Zap className="h-3 w-3 mr-1" />
          Industry's First AI-Powered Environmental Consulting
        </Badge>

        <h1 className="text-5xl md:text-7xl font-bold mb-6">A3 Environmental Consultants</h1>

        <div className="max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">
            Predicting Tomorrow's Environmental Challenges Today
          </h2>
          <p className="text-lg md:text-xl leading-relaxed mb-4">
            Banks, Mergers & Acquisitions, Lawyers, Civil Engineers, and Utilities all rely on A3E to get their projects
            done. We design and deliver turnkey environmental projects and can complete your transactional due diligence
            so you can close more deals, faster.
          </p>
          <p className="text-lg md:text-xl leading-relaxed font-semibold">
            Now with revolutionary AI capabilities: Predict contamination 3-6 months in advance,
            automate compliance across all regulations, and get instant site assessments.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-4" asChild>
            <Link href="/ai-features">
              <Brain className="mr-2" size={20} />
              Explore AI Features
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </Button>
          <Button size="lg" className="bg-white/20 border-white text-white hover:bg-white hover:text-emerald-900 text-lg px-8 py-4">
            Our Services
            <ArrowRight className="ml-2" size={20} />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-white/10 border-white text-white hover:bg-white hover:text-emerald-900 text-lg px-8 py-4"
            asChild
          >
            <a href="#contact">
              <Phone className="mr-2" size={20} />
              Contact Us
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}

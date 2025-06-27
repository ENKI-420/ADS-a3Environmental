import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Shield, FileText, Recycle, Microscope, Building } from "lucide-react"

const services = [
  {
    icon: <FileText className="w-8 h-8" />,
    title: "Environmental Due Diligence",
    description:
      "Comprehensive assessments including Phase I & II ESAs, RSRAs, and Transaction Screens to identify and mitigate environmental liabilities before property acquisition.",
  },
  {
    icon: <Recycle className="w-8 h-8" />,
    title: "Environmental Remediation",
    description:
      "Expert solutions for soil and groundwater contamination, including UST removal, Clean Construction Demolition Debris (CCDD) management, and Site Remediation Programs (SRP).",
  },
  {
    icon: <Leaf className="w-8 h-8" />,
    title: "Ecological Services",
    description:
      "Specialized services including wetland delineations, threatened & endangered species surveys, erosion control, and stormwater management to ensure ecological compliance.",
  },
  {
    icon: <Building className="w-8 h-8" />,
    title: "Industrial Hygiene",
    description:
      "Workplace safety assessments, including surveys for asbestos (ACM), lead-based paint (LBP), mold, and other hazardous building materials prior to demolition or renovation.",
  },
  {
    icon: <Microscope className="w-8 h-8" />,
    title: "Support Services",
    description:
      "Technical support including CADD & GIS mapping, environmental ghostwriting, and advanced drone inspections for aerial site reconnaissance and data collection.",
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Regulatory Compliance",
    description:
      "Navigate complex environmental regulations with our compliance consulting, permitting assistance, and defensive environmental review services.",
  },
]

export function Services() {
  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive environmental consulting solutions tailored to meet your project needs and regulatory
            requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mb-4">
                  {service.icon}
                </div>
                <CardTitle className="text-xl font-semibold">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">{service.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

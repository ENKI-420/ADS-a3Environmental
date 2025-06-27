import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  Search,
  Leaf,
  MapPin,
  FileText,
  CheckCircle2,
  ArrowRight,
  Phone,
  Building,
  Scale,
  TreePine,
  Droplets,
  Factory,
  FileSearch,
  Briefcase
} from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Environmental Consulting Services | A3E",
  description: "Comprehensive environmental consulting services including Phase I/II/III ESAs, remediation, ecological services, and CADD/GIS capabilities.",
}

const serviceCategories = [
  {
    id: "due-diligence",
    title: "Environmental Due Diligence",
    icon: <Search className="h-6 w-6" />,
    description: "Comprehensive environmental assessments for informed decision-making",
    services: [
      {
        name: "Phase I Environmental Site Assessments",
        description: "ASTM E1527-13 compliant assessments identifying potential environmental concerns",
        features: [
          "Historical records review",
          "Site reconnaissance",
          "Regulatory database search",
          "Interviews with knowledgeable parties",
          "Professional report generation"
        ]
      },
      {
        name: "Phase II Environmental Site Assessments",
        description: "Detailed subsurface investigations to evaluate identified concerns",
        features: [
          "Soil and groundwater sampling",
          "Laboratory analysis",
          "Risk assessment",
          "Contamination delineation",
          "Remediation recommendations"
        ]
      },
      {
        name: "Phase III Environmental Site Assessments",
        description: "Comprehensive remediation planning and implementation",
        features: [
          "Remedial action plans",
          "Cost estimates",
          "Contractor oversight",
          "Regulatory compliance",
          "Post-remediation verification"
        ]
      },
      {
        name: "Baseline Environmental Assessments (BEA)",
        description: "Establishing environmental conditions for liability protection",
        features: [
          "Due care documentation",
          "Liability protection",
          "Regulatory compliance",
          "Property transfer support"
        ]
      },
      {
        name: "Soil Gas Investigations",
        description: "Vapor intrusion assessments and mitigation planning",
        features: [
          "Sub-slab sampling",
          "Indoor air quality testing",
          "Risk evaluation",
          "Mitigation system design"
        ]
      }
    ]
  },
  {
    id: "remediation",
    title: "Investigation & Remedial Services",
    icon: <Shield className="h-6 w-6" />,
    description: "Expert remediation and environmental cleanup solutions",
    services: [
      {
        name: "UST Removal & Closure",
        description: "Safe removal and closure of underground storage tanks",
        features: [
          "Tank removal oversight",
          "Soil assessment",
          "Closure reporting",
          "Regulatory compliance",
          "Site restoration"
        ]
      },
      {
        name: "Clean Construction Demolition Debris (CCDD)",
        description: "Management and disposal of construction debris",
        features: [
          "Waste characterization",
          "Disposal coordination",
          "Documentation",
          "Regulatory compliance"
        ]
      },
      {
        name: "Soil Management",
        description: "Comprehensive soil handling and disposal services",
        features: [
          "Contaminated soil excavation",
          "Transportation coordination",
          "Disposal facility selection",
          "Waste manifesting",
          "Clean fill sourcing"
        ]
      },
      {
        name: "Design & Oversight",
        description: "Engineering design and construction oversight",
        features: [
          "Remediation system design",
          "Construction specifications",
          "Contractor management",
          "Quality assurance",
          "Progress reporting"
        ]
      },
      {
        name: "Site Remediation Programs (SRP)",
        description: "Comprehensive cleanup programs",
        features: [
          "Remedial investigations",
          "Feasibility studies",
          "Remedial action plans",
          "Implementation oversight",
          "Closure documentation"
        ]
      }
    ]
  },
  {
    id: "ecological",
    title: "Ecological Services",
    icon: <Leaf className="h-6 w-6" />,
    description: "Environmental compliance and natural resource assessments",
    services: [
      {
        name: "Wetland Screens",
        description: "Preliminary wetland assessments",
        features: [
          "Desktop reviews",
          "Field reconnaissance",
          "Wetland indicators",
          "Preliminary determinations",
          "Regulatory guidance"
        ]
      },
      {
        name: "Wetland Delineations",
        description: "Detailed wetland boundary determinations",
        features: [
          "Field delineation",
          "GPS mapping",
          "Data forms",
          "Regulatory coordination",
          "Permit support"
        ]
      },
      {
        name: "Jurisdictional Wetland Determinations",
        description: "Official jurisdictional determinations",
        features: [
          "USACE coordination",
          "Jurisdictional reports",
          "Approved JDs",
          "Permit applications",
          "Mitigation planning"
        ]
      }
    ]
  },
  {
    id: "cadd-gis",
    title: "CADD & GIS Services",
    icon: <MapPin className="h-6 w-6" />,
    description: "Advanced mapping and spatial analysis capabilities",
    services: [
      {
        name: "Site Mapping",
        description: "Professional site plans and maps",
        features: [
          "CAD drawings",
          "Site layouts",
          "Sampling locations",
          "Aerial overlays",
          "3D modeling"
        ]
      },
      {
        name: "GIS Analysis",
        description: "Spatial data analysis and visualization",
        features: [
          "Environmental data mapping",
          "Spatial analysis",
          "Database integration",
          "Interactive maps",
          "Report graphics"
        ]
      }
    ]
  }
]

const industries = [
  { name: "Banking & Financial", icon: <Building className="h-5 w-5" /> },
  { name: "Mergers & Acquisitions", icon: <Briefcase className="h-5 w-5" /> },
  { name: "Legal", icon: <Scale className="h-5 w-5" /> },
  { name: "Civil Engineering", icon: <Factory className="h-5 w-5" /> },
  { name: "Utilities", icon: <Droplets className="h-5 w-5" /> },
  { name: "Government", icon: <FileText className="h-5 w-5" /> }
]

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center max-w-4xl mx-auto mb-12">
              <Badge className="mb-4" variant="secondary">
                <Shield className="h-3 w-3 mr-1" />
                Full-Service Environmental Consulting
              </Badge>
              <h1 className="text-5xl font-bold mb-6 text-gray-900">
                Comprehensive Environmental Services
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                From due diligence to remediation, A3E provides turnkey environmental solutions
                with speed, precision, and unwavering commitment to confidentiality.
              </p>
              <div className="flex gap-4 justify-center">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                  <Phone className="h-4 w-4 mr-2" />
                  (888) 405-1742
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">
                    Get Started
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Industries We Serve */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-16">
              {industries.map((industry, idx) => (
                <Card key={idx} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-center mb-2 text-emerald-600">
                      {industry.icon}
                    </div>
                    <p className="text-sm font-medium">{industry.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Services Tabs */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <Tabs defaultValue="due-diligence" className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
                {serviceCategories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="flex items-center gap-2 py-3"
                  >
                    {category.icon}
                    <span className="hidden sm:inline">{category.title}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {serviceCategories.map((category) => (
                <TabsContent key={category.id} value={category.id} className="mt-8">
                  <div className="space-y-8">
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold mb-4">{category.title}</h2>
                      <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        {category.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {category.services.map((service, idx) => (
                        <Card key={idx} className="hover:shadow-xl transition-all duration-300">
                          <CardHeader>
                            <CardTitle className="text-xl">{service.name}</CardTitle>
                            <CardDescription className="text-base">
                              {service.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {service.features.map((feature, fidx) => (
                                <li key={fidx} className="flex items-start gap-2">
                                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm">{feature}</span>
                                </li>
                              ))}
                            </ul>
                            <Button className="w-full mt-6" variant="outline" asChild>
                              <Link href="/contact">
                                Learn More
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </Link>
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Compliance Section */}
        <section className="py-20 px-4 bg-emerald-50">
          <div className="container mx-auto">
            <Card className="bg-white shadow-xl">
              <CardContent className="p-12">
                <div className="text-center mb-8">
                  <Badge className="mb-4" variant="default">
                    <Shield className="h-3 w-3 mr-1" />
                    Regulatory Compliance
                  </Badge>
                  <h2 className="text-3xl font-bold mb-4">
                    Meeting or Exceeding All Standards
                  </h2>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Our reports meet or exceed ASTM Standard E1527-13 and satisfy the requirements
                    of all lenders and government agencies.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600 mb-2">ASTM</div>
                    <p className="text-sm text-gray-600">E1527-13 Compliant</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600 mb-2">SBA</div>
                    <p className="text-sm text-gray-600">Approved Provider</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600 mb-2">HUD</div>
                    <p className="text-sm text-gray-600">Certified Reports</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600 mb-2">USDA</div>
                    <p className="text-sm text-gray-600">Compliant Services</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-emerald-600 text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Your Project Is Important
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Let's discuss how A3E can design and deliver turnkey environmental solutions
              for your specific needs.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/contact">
                  Start Your Project
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                <Phone className="h-4 w-4 mr-2" />
                Call (888) 405-1742
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
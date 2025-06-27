import { Button } from "@/components/ui/button"
import { CheckCircle, Users, Award, Clock } from "lucide-react"

const stats = [
  { icon: <Award className="w-8 h-8" />, value: "15+", label: "Years Experience" },
  { icon: <Users className="w-8 h-8" />, value: "500+", label: "Clients Served" },
  { icon: <CheckCircle className="w-8 h-8" />, value: "Nationwide", label: "Service Area" },
  { icon: <Clock className="w-8 h-8" />, value: "24/7", label: "Emergency Response" },
]

export function About() {
  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Environmental Excellence & Unmatched Customer Service
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              A3 Environmental, LLC (A3E) is a full-service, woman-owned, small business specializing in providing
              quality environmental services. We saw how other firms operated and decided things were going to be
              different here.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Our guiding principles are amazing customer service first, and world-class environmental consulting
              second. We pride ourselves on delivering comprehensive, cost-effective services that meet the highest
              industry standards.
            </p>
            <Button className="bg-emerald-600 hover:bg-emerald-700">Learn More About Us</Button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

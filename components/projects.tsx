import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const projects = [
  {
    title: "Oil Blending Facility, Hammond, IN",
    description:
      "Evaluated environmental risk for a buyer during a Merger & Acquisition of a former Pullman Train Car manufacturing facility.",
    image: "/placeholder.svg?height=300&width=400",
    tags: ["Phase I ESA", "M&A", "Industrial"],
    status: "Completed",
  },
  {
    title: "MWRD Thornton Quarry",
    description:
      "Ongoing well sampling for the Metropolitan Water Reclamation District of Greater Chicago to ensure the future of our stormwater and drinking water.",
    image: "/placeholder.svg?height=300&width=400",
    tags: ["Water Sampling", "Government", "Compliance"],
    status: "Ongoing",
  },
  {
    title: "Commercial Real Estate Portfolio",
    description:
      "Conducted comprehensive due diligence, including RSRAs and Phase I ESAs, for a portfolio of commercial properties across the Midwest.",
    image: "/placeholder.svg?height=300&width=400",
    tags: ["Due Diligence", "Commercial", "RSRA"],
    status: "Completed",
  },
]

export function Projects() {
  return (
    <section id="projects" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Recent Projects</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore some of our recent environmental consulting projects and success stories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="aspect-video bg-gray-200">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl font-semibold">{project.title}</CardTitle>
                  <Badge variant={project.status === "Completed" ? "default" : "secondary"}>{project.status}</Badge>
                </div>
                <CardDescription className="text-gray-600 leading-relaxed">{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="outline" className="text-emerald-600 border-emerald-200">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

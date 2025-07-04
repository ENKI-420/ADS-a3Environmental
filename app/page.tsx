"use client";

// import EnhancedWelcomeSystem from "@/components/EnhancedWelcomeSystem";
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatePresence, motion } from "framer-motion";
import {
    ArrowRight,
    Bot,
    Brain,
    Building2,
    Clock,
    Cpu,
    Database,
    Eye,
    FileText,
    Globe,
    Monitor,
    Network,
    Shield,
    Sparkles,
    Star,
    Users,
    Zap
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import React, { useEffect, useState, useCallback, memo, Suspense } from 'react';

// Dynamically import components that don't exist yet - comment out for now
// const HealthLinkInvestorPitch = dynamic(() => import("@/components/HealthLinkInvestorPitch"), {
//     loading: () => <div className="text-center py-20 text-gray-400">Loading investor pitch...</div>,
//     ssr: false // This component likely relies on browser APIs
// });

// const TourGuideProvider = dynamic(() => import("@/components/TourGuideProvider"), { ssr: false });

// --- Constants and Data Definitions ---

const INDUSTRY_COPY: Record<string, { title: string; tagline: string; points: string[] }> = {
    healthcare: {
        title: "AI-Powered Care Transformation",
        tagline: "Unify patient data, unlock proactive insights for a healthier future.",
        points: [
            "Secure FHIR interoperability for seamless data exchange",
            "Personalized AI health assistant for every patient",
            "Automation of tedious clinical workflows, freeing up staff"
        ]
    },
    defense: {
        title: "Mission-Critical Intelligence & Security",
        tagline: "Real-time multi-modal analytics for unparalleled defense operations.",
        points: [
            "Cross-domain data fusion for comprehensive awareness",
            "Autonomous threat detection and rapid response",
            "Secure multi-model orchestration for classified environments"
        ]
    },
    finance: {
        title: "Next-Gen Financial AI Solutions",
        tagline: "Transform risk analysis, fraud detection, and customer engagement.",
        points: [
            "Automated compliance checks and regulatory reporting",
            "Generative AI for insightful financial reporting",
            "Advanced fraud prediction models to safeguard assets"
        ]
    }
};

// IRIS MCP SDK Feature Showcase
const IrisMCPFeatures = () => {
  const features = [
    {
      icon: <Bot className="h-8 w-8 text-blue-600" />,
      title: "Computer Use Agents",
      description: "Advanced AI agents that can interact directly with computer systems and automate complex workflows",
      link: "/computer-use",
      badge: "LIVE DEMO"
    },
    {
      icon: <Network className="h-8 w-8 text-purple-600" />,
      title: "Agent Orchestration",
      description: "Sophisticated multi-agent coordination with real-time workflow management and intelligent task delegation",
      link: "/orchestration",
      badge: "INTERACTIVE"
    },
    {
      icon: <Brain className="h-8 w-8 text-green-600" />,
      title: "Multi-Modal AI",
      description: "Voice, visual, and text processing unified through the IRIS MCP SDK with context-aware intelligence",
      link: "/ai-features",
      badge: "AI POWERED"
    },
    {
      icon: <Monitor className="h-8 w-8 text-orange-600" />,
      title: "Real-Time Analytics",
      description: "Live performance monitoring and predictive analytics powered by IRIS MCP SDK intelligence",
      link: "/analytics",
      badge: "REAL-TIME"
    },
    {
      icon: <Eye className="h-8 w-8 text-teal-600" />,
      title: "Visual Intelligence",
      description: "Advanced computer vision and spatial analysis with 3D visualization capabilities",
      link: "/visual-intelligence",
      badge: "3D ENABLED"
    },
    {
      icon: <Sparkles className="h-8 w-8 text-yellow-600" />,
      title: "AI Content Studio",
      description: "Automated content generation for technical documentation and professional reports",
      link: "/ai-content-studio",
      badge: "CONTENT AI"
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="relative">
              <Bot className="h-12 w-12 text-blue-600" />
              <Sparkles className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              IRIS MCP SDK Platform Demonstration
            </h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            Experience the world's most advanced Model Context Protocol platform with
            cutting-edge AI orchestration, computer use agents, and multi-modal intelligence
          </p>
          <div className="mt-6">
            <Badge variant="outline" className="text-sm px-4 py-2 bg-blue-50 text-blue-700 border-blue-200">
              🚀 EPA Contractor Ready • 99.7% Compliance Accuracy • 90% Faster Assessments
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 group border-0 bg-white/80 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 group-hover:from-blue-100/50 group-hover:to-purple-100/50 transition-all duration-300" />
              <CardHeader className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-white to-gray-50 shadow-sm group-hover:shadow-md transition-shadow">
                    {feature.icon}
                  </div>
                  <Badge variant="secondary" className="text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-0">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <CardDescription className="text-gray-600 mb-4 leading-relaxed">
                  {feature.description}
                </CardDescription>
                <Link href={feature.link}>
                  <Button variant="outline" className="w-full group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
                    Explore Demo
                    <Zap className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// EPA Contractor Capabilities Section
const EPAContractorSection = () => {
  const capabilities = [
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "EPA Procurement Ready",
      description: "Pre-configured for FedConnect, SAM.gov, and SNAP marketplace integration",
      link: "/epa-contractor-strategy",
      badge: "FEDERAL READY"
    },
    {
      icon: <Zap className="h-8 w-8 text-green-600" />,
      title: "99.7% Compliance Accuracy",
      description: "AI-powered compliance monitoring across all EPA databases and regulations",
      link: "/epa-contractor-strategy",
      badge: "VERIFIED"
    },
    {
      icon: <Clock className="h-8 w-8 text-purple-600" />,
      title: "90% Faster Assessments",
      description: "3-6 month predictive environmental risk modeling with sub-2 minute emergency response",
      link: "/epa-contractor-strategy",
      badge: "PERFORMANCE"
    },
    {
      icon: <Building2 className="h-8 w-8 text-orange-600" />,
      title: "SBIR Eligible",
      description: "Positioned for EPA Small Business Innovation Research funding with proven track record",
      link: "/epa-contractor-strategy",
      badge: "FUNDING READY"
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Shield className="h-12 w-12 text-blue-600" />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EPA Contractor Platform
            </h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            The only EPA-aligned AI platform delivering faster environmental assessments with unprecedented compliance accuracy
          </p>
          <div className="mt-6">
            <Badge variant="outline" className="text-sm px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-200">
              🏛️ Federal Contracting Ready • $2.5M Year 1 Target • 3-Phase Implementation
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {capabilities.map((capability, index) => (
            <Card key={index} className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 group border-0 bg-white/80 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 group-hover:from-blue-100/50 group-hover:to-purple-100/50 transition-all duration-300" />
              <CardHeader className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-white to-gray-50 shadow-sm group-hover:shadow-md transition-shadow">
                    {capability.icon}
                  </div>
                  <Badge variant="secondary" className="text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-0">
                    {capability.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">{capability.title}</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <CardDescription className="text-gray-600 mb-4 leading-relaxed">
                  {capability.description}
                </CardDescription>
                <Link href={capability.link}>
                  <Button variant="outline" className="w-full group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
                    View Strategy
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready for EPA Contracting?</h3>
              <p className="text-lg mb-6 opacity-90">
                Explore our comprehensive federal contracting strategy and implementation roadmap
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/epa-contractor-strategy">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    View Full Strategy
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact-us">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Contact EPA Team
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

// IRIS MCP SDK Statistics
const IRISStats = () => {
  const stats = [
    { value: "13+", label: "Specialized AI Agents", icon: <Bot className="h-6 w-6" /> },
    { value: "5", label: "Computer Use Capabilities", icon: <Cpu className="h-6 w-6" /> },
    { value: "99.97%", label: "System Uptime", icon: <Shield className="h-6 w-6" /> },
    { value: "340%", label: "Efficiency Improvement", icon: <Zap className="h-6 w-6" /> },
  ]

  return (
    <section className="py-16 bg-gradient-to-r from-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">IRIS MCP SDK Performance Metrics</h2>
          <p className="text-blue-100 text-lg">Real-world performance data from our environmental consulting demonstration</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
                  {stat.icon}
                </div>
              </div>
              <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-blue-100 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

interface WelcomeInsights {
    startTime: Date;
    interactions: number;
    stepsCompleted: number;
    completionRate: number;
    satisfactionScore?: number;
    featureDiscovery: string[];
    conversionEvents: string[];
}

// --- Custom Hooks ---

/**
 * Custom hook to manage industry state based on URL, localStorage, or default.
 */
function useIndustryDetection() {
    const [industry, setIndustry] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const qsIndustry = params.get("industry");
            const stored = localStorage.getItem("preferredIndustry");
            const initialIndustry = qsIndustry || stored || "healthcare";

            if (qsIndustry) {
                localStorage.setItem("preferredIndustry", qsIndustry);
            }
            setIndustry(initialIndustry);
        }
    }, []);

    return [industry, setIndustry] as const;
}

/**
 * Custom hook to manage the EnhancedWelcomeSystem visibility and completion.
 */
function useWelcomeSystem() {
    const [firstTime, setFirstTime] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const hasCompletedEnhanced = localStorage.getItem("enhancedWelcomeCompleted");
            if (!hasCompletedEnhanced) {
                setFirstTime(true);
            }
        }
    }, []);

    const handleWelcomeComplete = useCallback((insights: WelcomeInsights) => {
        if (typeof window !== 'undefined') {
            console.log('Welcome completed with insights:', insights);
            setFirstTime(false);
            localStorage.setItem("enhancedWelcomeCompleted", "true"); // Mark as completed

            // Track completion analytics
            fetch('/api/analytics/welcome-completion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    insights,
                    timestamp: new Date().toISOString()
                })
            }).catch((error) => {
                console.error('Failed to track welcome completion:', error);
            });
        }
    }, []); // Empty dependency array means this function is created once

    const handleWelcomeDismiss = useCallback(() => {
        setFirstTime(false);
        if (typeof window !== 'undefined') {
            console.log('Welcome dismissed');
            // Optionally, you might want to track dismissals too
            // fetch('/api/analytics/welcome-dismissal', { ... });
        }
    }, []);

    return { firstTime, handleWelcomeComplete, handleWelcomeDismiss };
}

// --- Component Props Interfaces ---

interface SolutionCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    features: string[];
    href: string;
}

interface UseCaseCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

interface TestimonialCardProps {
    quote: string;
    author: string;
    title: string;
    rating: number;
}

// --- Reusable UI Components (Memoized for performance) ---

const SolutionCard = memo(function SolutionCard({ icon, title, description, features, href }: SolutionCardProps) {
    return (
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 group">
            <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                    {icon}
                    <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {title}
                    </h3>
                </div>
                <CardDescription className="text-gray-300">
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                        {features.map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                            </Badge>
                        ))}
                    </div>
                    <Link href={href}>
                        <Button variant="outline" size="sm" className="w-full mt-4">
                            Learn More
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
});

const UseCaseCard = memo(function UseCaseCard({ icon, title, description }: UseCaseCardProps) {
    return (
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                    {icon}
                    <h3 className="text-xl font-semibold text-white">{title}</h3>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-gray-300">{description}</p>
            </CardContent>
        </Card>
    );
});

const TestimonialCard = memo(function TestimonialCard({ quote, author, title, rating }: TestimonialCardProps) {
    return (
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: rating }, (_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                </div>
                <blockquote className="text-gray-300 mb-4 italic">
                    "{quote}"
                </blockquote>
                <div className="text-sm">
                    <div className="font-semibold text-white">{author}</div>
                    <div className="text-gray-400">{title}</div>
                </div>
            </CardContent>
        </Card>
    );
});

// --- Main Landing Page Component ---

export default function LandingPage() {
    const [industry, setIndustry] = useIndustryDetection();
    const { firstTime, handleWelcomeComplete, handleWelcomeDismiss } = useWelcomeSystem();

    const copy = INDUSTRY_COPY[industry as keyof typeof INDUSTRY_COPY] || INDUSTRY_COPY.healthcare;

    // State to manage video loaded status for smoother display
    const [videoLoaded, setVideoLoaded] = useState(false);

    return (
        <Suspense fallback={<div>Loading Page...</div>}>
                            {/* <TourGuideProvider> */}
                <AnimatePresence>
                    {/* firstTime && (
                        <EnhancedWelcomeSystem
                            onComplete={handleWelcomeComplete}
                            onDismiss={handleWelcomeDismiss}
                            userRole="professional"
                            industry={industry || "healthcare"}
                            isFirstVisit={true}
                            analyticsEnabled={true}
                        />
                    ) */}
                </AnimatePresence>

                <div className="min-h-screen bg-slate-950 text-white">
                    <Header />

                    {/* HERO SECTION */}
                    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden">
                        <video
                            className={`absolute inset-0 w-full h-full object-cover opacity-20 transition-opacity duration-500 ${videoLoaded ? 'opacity-20' : 'opacity-0'}`}
                            autoPlay
                            loop
                            muted
                            playsInline
                            src="/hero-healthlink.mp4"
                            onLoadedData={() => setVideoLoaded(true)}
                            onError={(e: React.SyntheticEvent<HTMLVideoElement>) => {
                                console.error("Video failed to load:", e);
                                // Fallback: hide the video element entirely
                                (e.currentTarget as HTMLVideoElement).style.display = 'none';
                                setVideoLoaded(true); // Still set to true so content isn't blocked
                            }}
                            aria-hidden="true" // Decorative video
                        />
                        <div className="relative z-10 max-w-4xl mx-auto">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent"
                            >
                                {copy.title}
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="mt-6 text-lg md:text-2xl text-gray-300"
                            >
                                {copy.tagline}
                            </motion.p>
                            <motion.ul
                                initial="hidden" animate="visible"
                                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2 } } }}
                                className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-left"
                            >
                                {copy.points.map(p => (
                                    <motion.li
                                        key={p}
                                        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                                        className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 text-gray-200"
                                    >
                                        {p}
                                    </motion.li>
                                ))}
                            </motion.ul>
                        </div>
                    </section>

                    {/* INDUSTRY SECTION */}
                    <section id="industry-section" className="py-24 px-6 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800">
                        <div className="max-w-5xl mx-auto text-center">
                            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
                                Tailored AI Solutions
                            </h2>
                            <p className="text-gray-300 max-w-2xl mx-auto">
                                We auto-detect your industry to surface the most relevant AI demos and case studies. Select an industry below to customize your experience.
                            </p>
                            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                                {Object.entries(INDUSTRY_COPY).map(([key, val]) => (
                                    <button
                                        key={key}
                                        className={`rounded-2xl p-6 border transition-all duration-300 ease-in-out cursor-pointer
                                            ${industry === key ? 'border-blue-500 shadow-lg scale-105' : 'border-white/10 hover:border-blue-700 hover:shadow-md'}
                                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                                        onClick={() => setIndustry(key)}
                                        aria-pressed={industry === key}
                                        aria-label={`Select ${key} industry for tailored content`}
                                    >
                                        <h3 className="text-xl font-semibold text-white mb-2">{val.title}</h3>
                                        <p className="text-sm text-gray-400">{val.tagline}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* EPA Contractor Section */}
                    <EPAContractorSection />

                    {/* IRIS MCP SDK Features */}
                    <IrisMCPFeatures />

                    {/* Performance Statistics */}
                    <IRISStats />

                    {/* EPA & USACE CONTRACTING SPOTLIGHT */}
                    <section id="epa-usace-spotlight" className="py-24 px-6 bg-slate-900">
                        <div className="max-w-5xl mx-auto text-center">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                                EPA & USACE Federal Contracting
                            </h2>
                            <p className="text-xl text-gray-300 mb-8">
                                Accelerate your compliance, risk assessment, and project delivery with AI-powered solutions tailored for EPA and USACE contractors.
                            </p>
                            <div className="grid md:grid-cols-2 gap-8 mb-12">
                                <div className="bg-gradient-to-br from-blue-900/40 to-blue-700/30 rounded-2xl p-8 border border-blue-500/20 shadow-xl">
                                    <h3 className="text-2xl font-bold text-blue-200 mb-4">EPA Contracting</h3>
                                    <ul className="text-left text-gray-200 space-y-3">
                                        <li>• 99.7% compliance accuracy with automated EPA database integration</li>
                                        <li>• Pre-configured for FedConnect, SAM.gov, and SNAP marketplace</li>
                                        <li>• 90% faster environmental assessments and emergency response</li>
                                        <li>• SBIR eligible and ready for federal innovation funding</li>
                                    </ul>
                                    <div className="mt-6">
                                        <a href="/epa-contractor-strategy">
                                            <Button className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-all">
                                                View EPA Strategy
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-green-900/40 to-green-700/30 rounded-2xl p-8 border border-green-500/20 shadow-xl">
                                    <h3 className="text-2xl font-bold text-green-200 mb-4">USACE Contracting</h3>
                                    <ul className="text-left text-gray-200 space-y-3">
                                        <li>• Advanced AI for USACE project management and compliance</li>
                                        <li>• Automated risk modeling and real-time reporting</li>
                                        <li>• Proven track record with federal and DoD clients</li>
                                        <li>• Full support for USACE environmental and engineering contracts</li>
                                    </ul>
                                    <div className="mt-6">
                                        <a href="/contact-us">
                                            <Button className="bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700 transition-all">
                                                Contact USACE Team
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 text-gray-400 text-lg">
                                <span className="font-semibold text-blue-300">Federal Ready</span> • <span className="font-semibold text-green-300">USACE & EPA Aligned</span> • <span className="font-semibold text-yellow-300">SBIR & IDIQ Opportunities</span>
                            </div>
                        </div>
                    </section>

                    {/* Social Proof */}
                    <section className="py-16 px-4 bg-slate-900/30">
                        <div className="max-w-7xl mx-auto text-center">
                            <p className="text-slate-400 mb-8 text-lg">Trusted by leading organizations worldwide</p>
                            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                                <div className="text-slate-500 font-semibold text-xl">USACE</div>
                                <div className="text-slate-500 font-semibold text-xl">Epic Systems</div>
                                <div className="text-slate-500 font-semibold text-xl">Redox</div>
                                <div className="text-slate-500 font-semibold text-xl">OpenAI</div>
                                <div className="text-slate-500 font-semibold text-xl">Federal Contractors</div>
                            </div>
                        </div>
                    </section>

                    {/* Solutions Overview */}
                    <section className="py-20 px-4">
                        <div className="max-w-7xl mx-auto">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl md:text-5xl font-bold mb-6">Enterprise AI Solutions</h2>
                                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                                    Comprehensive AI platforms designed for mission-critical operations across defense, healthcare, and cybersecurity sectors.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                                <SolutionCard
                                    icon={<Cpu className="w-8 h-8 text-blue-400" />}
                                    title="AI-Driven Engineering"
                                    description="Leverage AI for advanced engineering workflows, optimizing performance and reducing costs significantly."
                                    features={["Genomics", "Predictive Maintenance", "Autonomy"]}
                                    href="/solutions#ai-engineering"
                                />
                                <SolutionCard
                                    icon={<Shield className="w-8 h-8 text-blue-400" />}
                                    title="Defense Contract Intelligence"
                                    description="Automate RFP analysis and bid scoring to boost win rates by up to 30%, ensuring strategic advantage."
                                    features={["Auto RFP Analysis", "Bid Scoring", "SAM.gov Integration"]}
                                    href="/solutions#defense-contract"
                                />
                                <SolutionCard
                                    icon={<Building2 className="w-8 h-8 text-blue-400" />}
                                    title="Healthcare Automation"
                                    description="Streamline clinical operations with robust FHIR and Redox integrations for efficient patient care."
                                    features={["FHIR Integration", "Redox", "Clinical Workflows"]}
                                    href="/solutions#healthcare"
                                />
                                <SolutionCard
                                    icon={<Users className="w-8 h-8 text-blue-400" />}
                                    title="Cybersecurity & Red Team"
                                    description="Execute automated phishing simulations and C2 frameworks to fortify your security posture."
                                    features={["Phishing Sim", "C2 Frameworks", "Pentest Automation"]}
                                    href="/solutions#cybersecurity"
                                />
                            </div>

                            {/* Project Spectra Highlight */}
                            <div className="mt-20 text-center">
                                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl p-8 border border-amber-500/20 shadow-xl">
                                    <h3 className="text-2xl font-bold text-amber-300 mb-4">Project Spectra: Next-Gen Simulation</h3>
                                    <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                                        Explore the weapons hypothesis through interactive 3D visualization, precise physics simulation, and advanced materials analysis.
                                    </p>
                                    <Link href="/project-spectra">
                                        <Button className="bg-amber-500 hover:bg-amber-600 text-black text-lg px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all">
                                            Explore Project Spectra
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Use Cases */}
                    <section className="py-20 px-4 bg-slate-900">
                        <div className="max-w-7xl mx-auto">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl md:text-5xl font-bold mb-6">Real-World Applications</h2>
                                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                                    See how our AI solutions are transforming industries and solving complex challenges, delivering tangible results.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <UseCaseCard
                                    icon={<Brain className="w-8 h-8 text-green-400" />}
                                    title="Clinical Decision Support"
                                    description="AI-powered diagnostic assistance and personalized treatment recommendations for healthcare providers, enhancing patient outcomes."
                                />
                                <UseCaseCard
                                    icon={<Network className="w-8 h-8 text-blue-400" />}
                                    title="Threat Intelligence & Analysis"
                                    description="Real-time threat detection, advanced predictive analysis, and robust cyber defense for critical operations."
                                />
                                <UseCaseCard
                                    icon={<Database className="w-8 h-8 text-purple-400" />}
                                    title="Intelligent Data Integration"
                                    description="Seamless integration of disparate data sources and intelligent data cleansing for comprehensive, actionable analytics."
                                />
                            </div>
                        </div>
                    </section>

                    {/* Testimonials */}
                    <section className="py-20 px-4">
                        <div className="max-w-7xl mx-auto">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl md:text-5xl font-bold mb-6">What Our Clients Say</h2>
                                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                                    Hear from professionals who have transformed their operations and achieved significant success with our cutting-edge AI solutions.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <TestimonialCard
                                    quote="The AI platform has revolutionized our patient care workflow, reducing administrative burden by 40% and improving efficiency across the board."
                                    author="Dr. Sarah Johnson"
                                    title="Chief Medical Officer, Leading Hospital Group"
                                    rating={5}
                                />
                                <TestimonialCard
                                    quote="Real-time threat detection capabilities have significantly enhanced our security posture, allowing us to proactively mitigate risks before they escalate."
                                    author="Michael Chen"
                                    title="Security Director, Global Tech Firm"
                                    rating={5}
                                />
                                <TestimonialCard
                                    quote="The automation features have streamlined our compliance processes and drastically reduced errors, saving us countless hours and resources."
                                    author="Lisa Rodriguez"
                                    title="Compliance Manager, Financial Services"
                                    rating={5}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Call to Action */}
                    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
                        <div className="container mx-auto px-4 text-center">
                            <div className="max-w-3xl mx-auto">
                                <h2 className="text-4xl font-bold mb-6 text-gray-900">
                                    Ready to Build with IRIS MCP SDK?
                                </h2>
                                <p className="text-xl text-gray-600 mb-8">
                                    Explore our comprehensive demonstration to see how the IRIS MCP SDK can transform
                                    your industry with advanced AI orchestration and computer use capabilities.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link href="https://web-bice-two-75.vercel.app/">
                                        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4">
                                            <Globe className="mr-2 h-5 w-5" />
                                            Visit IRIS MCP SDK Platform
                                        </Button>
                                    </Link>
                                    <Link href="/ai-features">
                                        <Button size="lg" variant="outline" className="px-8 py-4">
                                            <FileText className="mr-2 h-5 w-5" />
                                            View All Demonstrations
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    <Footer />
                {/* </TourGuideProvider> */}
                </div>
            </Suspense>
    );
}
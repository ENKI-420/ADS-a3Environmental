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

// --- Component Definitions ---

const HeroSection = memo(() => (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="relative z-10 container mx-auto px-4 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto"
            >
                <Badge variant="secondary" className="mb-6">
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI-Powered Solutions
                </Badge>
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                    Transform Your Business with
                    <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        {" "}AI
                    </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                    Unlock the power of artificial intelligence with our cutting-edge solutions designed for healthcare, defense, and finance industries.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                        Learn More
                    </Button>
                </div>
            </motion.div>
        </div>
    </section>
));

const IndustrySection = memo(() => {
    const [selectedIndustry, setSelectedIndustry] = useState('healthcare');

    return (
        <section className="py-20 bg-slate-900">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Industry Solutions
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Tailored AI solutions for your specific industry needs
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {Object.entries(INDUSTRY_COPY).map(([key, industry]) => (
                        <Card
                            key={key}
                            className={`cursor-pointer transition-all duration-300 ${
                                selectedIndustry === key
                                    ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white border-blue-500'
                                    : 'bg-slate-800 border-slate-700 text-gray-300 hover:bg-slate-700'
                            }`}
                            onClick={() => setSelectedIndustry(key)}
                        >
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    {key === 'healthcare' && <Users className="h-5 w-5" />}
                                    {key === 'defense' && <Shield className="h-5 w-5" />}
                                    {key === 'finance' && <Building2 className="h-5 w-5" />}
                                    {industry.title}
                                </CardTitle>
                            </CardHeader>
                        </Card>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedIndustry}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5 }}
                        className="bg-slate-800 rounded-lg p-8 border border-slate-700"
                    >
                        <h3 className="text-2xl font-bold text-white mb-4">
                            {INDUSTRY_COPY[selectedIndustry].title}
                        </h3>
                        <p className="text-gray-300 mb-6">
                            {INDUSTRY_COPY[selectedIndustry].tagline}
                        </p>
                        <ul className="space-y-3">
                            {INDUSTRY_COPY[selectedIndustry].points.map((point, index) => (
                                <li key={index} className="flex items-start gap-3 text-gray-300">
                                    <Star className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
});

const FeaturesSection = memo(() => {
    const features = [
        {
            icon: Brain,
            title: "Advanced AI Models",
            description: "State-of-the-art machine learning models tailored to your specific use case"
        },
        {
            icon: Shield,
            title: "Enterprise Security",
            description: "Bank-grade security with end-to-end encryption and compliance standards"
        },
        {
            icon: Zap,
            title: "Real-time Processing",
            description: "Lightning-fast data processing and analysis for instant insights"
        },
        {
            icon: Network,
            title: "Scalable Infrastructure",
            description: "Cloud-native architecture that scales with your business needs"
        },
        {
            icon: Eye,
            title: "Advanced Analytics",
            description: "Comprehensive analytics and reporting for data-driven decisions"
        },
        {
            icon: Cpu,
            title: "Custom Integration",
            description: "Seamless integration with your existing systems and workflows"
        }
    ];

    return (
        <section className="py-20 bg-slate-800">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Powerful Features
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Everything you need to succeed with AI
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="bg-slate-900 border-slate-700 hover:border-blue-500 transition-colors duration-300">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                                        <feature.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <CardTitle className="text-white">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-gray-300">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
});

const CTA = memo(() => (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Ready to Transform Your Business?
                </h2>
                <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                    Join thousands of companies already using our AI solutions to drive innovation and growth.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                        Start Free Trial
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                        Schedule Demo
                    </Button>
                </div>
            </motion.div>
        </div>
    </section>
));

// --- Main Page Component ---

export default function HomePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <div className="text-white text-xl">Loading...</div>
        </div>}>
            <div className="min-h-screen bg-slate-900">
                <Header />
                <main>
                    <HeroSection />
                    <IndustrySection />
                    <FeaturesSection />
                    <CTA />
                </main>
                <Footer />
            </div>
        </Suspense>
    );
}

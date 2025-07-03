"use client";

import React from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Shield, 
  Building2, 
  DollarSign, 
  Target, 
  Clock, 
  CheckCircle,
  ArrowRight,
  FileText,
  Users,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function EPAContractorStrategy() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-900/50 to-purple-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <Badge className="mb-6 bg-blue-600 text-white px-4 py-2">
              🏛️ Federal Contracting Strategy
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              EPA Contractor Roadmap
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              Strategic positioning for EPA environmental consulting contracts with AI-powered compliance monitoring and 90% faster assessments
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="outline" className="text-sm px-4 py-2 bg-green-100 text-green-800 border-green-200">
                $2.5M Year 1 Target
              </Badge>
              <Badge variant="outline" className="text-sm px-4 py-2 bg-blue-100 text-blue-800 border-blue-200">
                99.7% Compliance Accuracy
              </Badge>
              <Badge variant="outline" className="text-sm px-4 py-2 bg-purple-100 text-purple-800 border-purple-200">
                SBIR Eligible
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Strategy Overview */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-400 mb-4" />
                <CardTitle className="text-xl">Federal Procurement Ready</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Pre-configured integrations with FedConnect, SAM.gov, and SNAP marketplace for seamless contracting
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <Target className="h-12 w-12 text-green-400 mb-4" />
                <CardTitle className="text-xl">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Proven 99.7% compliance accuracy with 90% reduction in assessment timeframes
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <DollarSign className="h-12 w-12 text-yellow-400 mb-4" />
                <CardTitle className="text-xl">Revenue Projection</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  $2.5M Year 1 target through strategic EPA contract acquisition and SBIR funding
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Implementation Timeline */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">3-Phase Implementation Plan</h2>
            <p className="text-xl text-gray-300">Strategic roadmap for EPA contractor certification and market entry</p>
          </div>

          <div className="space-y-8">
            {/* Phase 1 */}
            <Card className="bg-gradient-to-r from-blue-900/30 to-blue-800/30 border-blue-400/20">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                  <div>
                    <CardTitle className="text-2xl text-blue-300">Foundation Phase (Months 1-3)</CardTitle>
                    <CardDescription className="text-gray-300">Platform development and compliance certification</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-blue-200">Technical Development</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        EPA database integration
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        Compliance monitoring AI
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        Risk assessment automation
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-blue-200">Business Setup</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        SAM.gov registration
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        Security clearances
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        SBIR application preparation
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Phase 2 */}
            <Card className="bg-gradient-to-r from-green-900/30 to-green-800/30 border-green-400/20">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                  <div>
                    <CardTitle className="text-2xl text-green-300">Market Entry Phase (Months 4-8)</CardTitle>
                    <CardDescription className="text-gray-300">Contract acquisition and pilot implementations</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-green-200">Contract Strategy</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-400" />
                        Small business set-aside targeting
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-400" />
                        IDIQ vehicle positioning
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-400" />
                        Prime contractor partnerships
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-green-200">Pilot Projects</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-400" />
                        Regional EPA office demos
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-400" />
                        State environmental agencies
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-400" />
                        Performance validation
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Phase 3 */}
            <Card className="bg-gradient-to-r from-purple-900/30 to-purple-800/30 border-purple-400/20">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                  <div>
                    <CardTitle className="text-2xl text-purple-300">Scale Phase (Months 9-12)</CardTitle>
                    <CardDescription className="text-gray-300">Full deployment and revenue optimization</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-purple-200">Revenue Targets</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-purple-400" />
                        $2.5M in contracted revenue
                      </li>
                      <li className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-purple-400" />
                        Multiple EPA regions
                      </li>
                      <li className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-purple-400" />
                        Recurring maintenance contracts
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-purple-200">Platform Enhancement</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-purple-400" />
                        Advanced AI capabilities
                      </li>
                      <li className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-purple-400" />
                        Multi-agency integration
                      </li>
                      <li className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-purple-400" />
                        Predictive analytics
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Competitive Advantages */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Competitive Advantages</h2>
            <p className="text-xl text-gray-300">Why we're positioned to win in the EPA contracting space</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <Zap className="h-12 w-12 text-yellow-400 mb-4" />
                <CardTitle className="text-xl">Speed & Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 mb-4">
                  90% faster environmental assessments through AI automation, reducing project timelines from months to weeks
                </CardDescription>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Automated data collection and analysis</li>
                  <li>• Real-time compliance monitoring</li>
                  <li>• Predictive risk assessment</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-400 mb-4" />
                <CardTitle className="text-xl">Accuracy & Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 mb-4">
                  99.7% compliance accuracy through comprehensive EPA database integration and AI-powered verification
                </CardDescription>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Complete regulatory database coverage</li>
                  <li>• Automated compliance verification</li>
                  <li>• Audit trail generation</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Partner with EPA?</h2>
          <p className="text-xl mb-8 opacity-90">
            Explore our comprehensive platform and see how we can accelerate your environmental compliance projects
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact-us">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Users className="mr-2 h-5 w-5" />
                Contact EPA Team
              </Button>
            </Link>
            <Link href="/ai-features">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <FileText className="mr-2 h-5 w-5" />
                View Platform Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 
"use client"

import { useState } from "react"
import { Menu, X, Brain } from "lucide-react"
import Link from "next/link"
import { RoleSwitcher } from "@/components/auth/role-switcher"
import { useAuth } from "@/context/auth-context"
import { Badge } from "@/components/ui/badge"

export function Header() {
  const { role } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href={role ? "/dashboard" : "/"} className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A3E</span>
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900">A3 Environmental</h1>
              <p className="text-sm text-gray-600">Consultants</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard" className="text-gray-700 hover:text-emerald-600 transition-colors">
              Dashboard
            </Link>
            <Link href="/ai-features" className="text-gray-700 hover:text-emerald-600 transition-colors font-semibold relative">
              AI Features
              <span className="absolute -top-2 -right-8 bg-emerald-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                NEW
              </span>
            </Link>
            <Link href="/orchestration" className="text-gray-700 hover:text-purple-600 transition-colors font-semibold relative">
              <div className="flex items-center space-x-1">
                <Brain className="h-4 w-4" />
                <span>Advanced Orchestration</span>
              </div>
              <Badge className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                IRIS
              </Badge>
            </Link>
            <Link href="/field-capture" className="text-gray-700 hover:text-emerald-600 transition-colors">
              Field Capture
            </Link>
            <Link href="/contracts" className="text-gray-700 hover:text-emerald-600 transition-colors">
              Contracts
            </Link>
            <Link href="/portal" className="text-gray-700 hover:text-emerald-600 transition-colors">
              Client Portal
            </Link>
            <Link href="/analytics" className="text-gray-700 hover:text-emerald-600 transition-colors">
              Analytics
            </Link>
            <Link href="/analyst/report-studio" className="text-gray-700 hover:text-emerald-600 transition-colors">
              Report Studio
            </Link>
            <Link href="/ai-content-studio" className="text-gray-700 hover:text-emerald-600 transition-colors font-semibold relative">
              AI Content Studio
              <span className="absolute -top-2 -right-8 bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                NEW
              </span>
            </Link>
            <RoleSwitcher />
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t pt-4 space-y-4">
            <Link href="/dashboard" className="block text-gray-700 hover:text-emerald-600 transition-colors">
              Dashboard
            </Link>
            <Link href="/ai-features" className="block text-gray-700 hover:text-emerald-600 transition-colors font-semibold">
              AI Features <span className="bg-emerald-600 text-white text-xs px-1.5 py-0.5 rounded-full ml-2">NEW</span>
            </Link>
            <Link href="/orchestration" className="block text-gray-700 hover:text-purple-600 transition-colors font-semibold">
              <div className="flex items-center space-x-1">
                <Brain className="h-4 w-4" />
                <span>Advanced Orchestration</span>
                <Badge className="bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded-full ml-2">IRIS</Badge>
              </div>
            </Link>
            <Link href="/field-capture" className="block text-gray-700 hover:text-emerald-600 transition-colors">
              Field Capture
            </Link>
            <Link href="/contracts" className="block text-gray-700 hover:text-emerald-600 transition-colors">
              Contracts
            </Link>
            <Link href="/portal" className="block text-gray-700 hover:text-emerald-600 transition-colors">
              Client Portal
            </Link>
            <Link href="/analytics" className="block text-gray-700 hover:text-emerald-600 transition-colors">
              Analytics
            </Link>
            <Link href="/analyst/report-studio" className="block text-gray-700 hover:text-emerald-600 transition-colors">
              Report Studio
            </Link>
            <Link href="/ai-content-studio" className="block text-gray-700 hover:text-emerald-600 transition-colors font-semibold">
              AI Content Studio <span className="bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded-full ml-2">NEW</span>
            </Link>
            <div className="pt-4 border-t">
              <RoleSwitcher />
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

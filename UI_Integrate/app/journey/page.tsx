"use client"

import { useState } from "react"
import { Leaf, Flame, Award, BadgeCheck, BarChart3, Rocket, Sprout, CalendarDays, Menu, X } from "lucide-react"
import Link from "next/link"

const JourneyPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  return (
    <div className="bg-[#fcfbf8] text-[#333333] min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#004d40] shadow-lg">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 no-underline">
              <Leaf className="h-6 w-6 text-white" />
              <span className="text-2xl font-extrabold text-white">EcoSnap</span>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="font-medium text-white/95 hover:text-white">Home</Link>
              <a href="/#how-it-works" className="font-medium text-white/95 hover:text-white">How It Works</a>
              <a href="/#scanner" className="font-medium text-white/95 hover:text-white">Scanner</a>
              <Link href="/assistant" className="font-medium text-white/95 hover:text-white">AI Assistant</Link>
              <span className="font-semibold text-white underline">My Journey</span>
            </div>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden bg-white/95 rounded-lg mt-2 p-4 shadow-lg">
              <div className="flex flex-col space-y-4">
                <a href="/" className="text-gray-700 hover:text-emerald-700 transition-colors text-left">Home</a>
                <a href="/#how-it-works" className="text-gray-700 hover:text-emerald-700 transition-colors text-left">How It Works</a>
                <a href="/#scanner" className="text-gray-700 hover:text-emerald-700 transition-colors text-left">Scanner</a>
                <a href="/assistant" className="text-gray-700 hover:text-emerald-700 transition-colors text-left">AI Assistant</a>
                <span className="text-emerald-800 font-semibold">My Journey</span>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-28 py-10 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-[#004d40] mb-3">Your Eco-Journey</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See your sustainable story and how your impact has changed over time.
          </p>
        </div>

        <section className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-emerald-100 shadow-[0_4px_12px_rgba(0,0,0,0.06)] p-6 text-center">
            <h3 className="text-base font-semibold text-gray-500 mb-2">Total Receipts Scanned</h3>
            <p className="text-4xl font-bold text-[#004d40]">12</p>
          </div>
          <div className="bg-white rounded-xl border border-emerald-100 shadow-[0_4px_12px_rgba(0,0,0,0.06)] p-6 text-center">
            <h3 className="text-base font-semibold text-gray-500 mb-2">Total Impact This Month</h3>
            <p className="text-4xl font-bold text-[#004d40]">38.5 kg CO₂e</p>
          </div>
          <div className="bg-white rounded-xl border border-emerald-100 shadow-[0_4px_12px_rgba(0,0,0,0.06)] p-6 text-center">
            <h3 className="text-base font-semibold text-gray-500 mb-2">Current Streak</h3>
            <p className="text-4xl font-bold text-[#004d40] flex items-center justify-center gap-2"><Flame className="h-6 w-6 text-amber-500" /> 4 days</p>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-emerald-100 shadow-[0_4px_12px_rgba(0,0,0,0.06)] p-8 mb-8">
          <h2 className="text-3xl font-bold text-[#004d40] mb-6">Your Storyline</h2>
          <div className="relative">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 h-full w-[2px] bg-emerald-700"></div>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-y-12 items-center">
              <div className="md:text-right md:pr-12">
                <p className="font-semibold text-gray-800">Your lowest footprint receipt yet! (2.1 kg CO₂e)</p>
                <span className="text-sm text-gray-500">Nov 13</span>
              </div>
              <div className="hidden md:flex items-center justify-center">
                <div className="w-9 h-9 rounded-full bg-emerald-50 border-2 border-emerald-600 flex items-center justify-center shadow-sm">
                  <Leaf className="h-5 w-5 text-emerald-700" />
                </div>
              </div>
              <div className="hidden md:block" />

              <div className="hidden md:block" />
              <div className="flex items-center justify-center">
                <div className="w-9 h-9 rounded-full bg-emerald-50 border-2 border-emerald-600 flex items-center justify-center shadow-sm">
                  <BadgeCheck className="h-5 w-5 text-emerald-700" />
                </div>
              </div>
              <div className="md:pl-12">
                <p className="font-semibold text-gray-800">Achievement Unlocked: 10 Scans!</p>
                <span className="text-sm text-gray-500">Nov 10</span>
              </div>

              <div className="md:text-right md:pr-12">
                <p className="font-semibold text-gray-800">First time you chose a low-carbon alternative!</p>
                <span className="text-sm text-gray-500">Nov 8</span>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-9 h-9 rounded-full bg-emerald-50 border-2 border-emerald-600 flex items-center justify-center shadow-sm">
                  <BarChart3 className="h-5 w-5 text-emerald-700" />
                </div>
              </div>
              <div className="hidden md:block" />

              <div className="hidden md:block" />
              <div className="flex items-center justify-center">
                <div className="w-9 h-9 rounded-full bg-emerald-50 border-2 border-emerald-600 flex items-center justify-center shadow-sm">
                  <Rocket className="h-5 w-5 text-emerald-700" />
                </div>
              </div>
              <div className="md:pl-12">
                <p className="font-semibold text-gray-800">Your journey begins! (First receipt scanned)</p>
                <span className="text-sm text-gray-500">Nov 1</span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-emerald-100 shadow-[0_4px_12px_rgba(0,0,0,0.06)] p-8">
          <h2 className="text-3xl font-bold text-[#004d40] mb-6">Your Badge Collection</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-2 transition-transform hover:scale-110 shadow-sm">
                <span className="text-3xl font-bold text-emerald-800">1</span>
              </div>
              <span className="font-semibold text-sm">First Scan</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-red-500 flex items-center justify-center mb-2 transition-transform hover:scale-110 shadow-sm">
                <span className="text-3xl font-extrabold text-emerald-800">10</span>
              </div>
              <span className="font-semibold text-sm">10 Scans</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-2 transition-transform hover:scale-110 shadow-sm">
                <Sprout className="h-10 w-10 text-emerald-700" />
              </div>
              <span className="font-semibold text-sm">Eco-Beginner</span>
            </div>
            <div className="flex flex-col items-center opacity-50">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-2 grayscale">
                <Leaf className="h-10 w-10 text-gray-500" />
              </div>
              <span className="font-semibold text-sm">Low-Carbon Pro</span>
            </div>
            <div className="flex flex-col items-center opacity-50">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-2 grayscale">
                <CalendarDays className="h-10 w-10 text-gray-500" />
              </div>
              <span className="font-semibold text-sm">30-Day Streak</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#004d40] text-white mt-16">
        <div className="max-w-6xl mx-auto px-5 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand Section */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Leaf className="h-7 w-7 text-amber-400" />
                <span className="text-2xl font-bold">EcoSnap</span>
              </div>
              <p className="text-emerald-100 text-sm">
                Making environmental impact tangible through AI-powered carbon footprint analysis of everyday purchases.
              </p>
            </div>

            {/* Features Column */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-emerald-100 text-sm">
                <li>
                  <a href="#" className="hover:text-white">Universal Document Scanner</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">Multi-Category Analysis</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">Greener Alternatives</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">Progress Dashboard</a>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-emerald-100 text-sm">
                <li>
                  <a href="#" className="hover:text-white">About Us</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">Terms of Service</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">Contact</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-emerald-800 pt-8 text-center">
            <p className="text-emerald-100 text-sm">© 2025 EcoSnap. Making sustainability actionable.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default JourneyPage

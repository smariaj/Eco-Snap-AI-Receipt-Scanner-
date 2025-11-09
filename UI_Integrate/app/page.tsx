"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaf, Menu, X, Upload, BarChart3, Camera, PieChart } from "lucide-react"
import Image from "next/image"

interface AnalysisResult {
  totalFootprint: number;
  categories: {
    name: string;
    value: number;
    suggestions: string[];
  }[];
  itemBreakdown: {
    item: string;
    co2e: number;
    category: string;
  }[];
}

const CurvedDivider = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 1200 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  ></svg>
)

export default function EcoSnap() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [navbarOnWhite, setNavbarOnWhite] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [selectedImage, setSelectedImage] = useState("")
  const [analysisError, setAnalysisError] = useState<string | null>(null)

  useEffect(() => {
    setIsVisible(true)

    const handleScroll = () => {
      const scrollY = window.scrollY
      const heroSection = document.getElementById("hero")
      const heroHeight = heroSection?.offsetHeight || 0

      setNavbarOnWhite(scrollY > heroHeight - 100)
    }

    window.addEventListener("scroll", handleScroll)

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const element = entry.target as HTMLElement
        const staggerElements = element.querySelectorAll(".stagger-child")

        if (entry.isIntersecting) {
          element.classList.remove("animate-fade-in-up")
          staggerElements.forEach((child) => {
            child.classList.remove("animate-fade-in-up")
          })

          setTimeout(() => {
            element.classList.add("animate-fade-in-up")
            staggerElements.forEach((child, index) => {
              setTimeout(() => {
                child.classList.add("animate-fade-in-up")
              }, index * 200)
            })
          }, 100)
        } else {
          element.classList.remove("animate-fade-in-up")
          staggerElements.forEach((child) => {
            child.classList.remove("animate-fade-in-up")
          })
        }
      })
    }, observerOptions)

    const animateElements = document.querySelectorAll(".animate-on-scroll")
    animateElements.forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", handleScroll)
    }
  }, [showResults])

  useEffect(() => {
    if (showResults) {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [showResults]);

  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
      setMobileMenuOpen(false)
    }
  }

  const handleAnalyze = async () => {
    if (!selectedImage) return

    setIsAnalyzing(true)
    setAnalysisError(null) // Reset error state
    try {
      // Convert base64 image to File
      const response = await fetch(selectedImage)
      const blob = await response.blob()
      const file = new File([blob], 'receipt.jpg', { type: blob.type })
      
      const formData = new FormData()
      formData.append('file', file)

      console.log("Sending request to /api/analyze...")
      const apiResponse = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })

      console.log("API Response status:", apiResponse.status)
      console.log("API Response headers:", Object.fromEntries(apiResponse.headers.entries()))

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text()
        console.error("API Error response:", errorText)
        throw new Error(`Analysis failed: ${apiResponse.status} - ${errorText}`)
      }

      const data = await apiResponse.json()
      console.log("Analysis data received:", data)
      setAnalysisResult(data)
      setShowResults(true)
    } catch (error) {
      console.error("Analysis error:", error)
      setAnalysisError(error.message)
      alert(`Analysis failed: ${error.message}`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <>
      {/* Navigation Bar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          navbarOnWhite ? "bg-white/90 backdrop-blur-md shadow-lg" : "bg-emerald-700/0 backdrop-blur-md"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Leaf className={`h-6 w-6 transition-colors duration-300 text-amber-300`} />
              <span
                className={`text-xl font-bold transition-colors duration-300 ${navbarOnWhite ? "text-emerald-900" : "text-white"}`}
              >
                ECOSNAP
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => smoothScrollTo("hero")}
                className={`transition-all duration-300 hover:scale-105 font-medium ${
                  navbarOnWhite ? "text-emerald-800 hover:text-emerald-600" : "text-white hover:text-blue-100"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => smoothScrollTo("how-it-works")}
                className={`transition-all duration-300 hover:scale-105 font-medium ${
                  navbarOnWhite ? "text-emerald-800 hover:text-emerald-600" : "text-white hover:text-blue-100"
                }`}
              >
                How It Works
              </button>
              <button
                onClick={() => smoothScrollTo("scanner")}
                className={`transition-all duration-300 hover:scale-105 font-medium ${
                  navbarOnWhite ? "text-emerald-800 hover:text-emerald-600" : "text-white hover:text-blue-100"
                }`}
              >
                Scanner
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden ${navbarOnWhite ? "text-emerald-800" : "text-white"}`}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white/95 backdrop-blur-sm rounded-lg mt-2 p-4 shadow-lg">
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => smoothScrollTo("hero")}
                  className="text-gray-700 hover:text-emerald-600 transition-colors text-left"
                >
                  Home
                </button>
                <button
                  onClick={() => smoothScrollTo("how-it-works")}
                  className="text-gray-700 hover:text-emerald-600 transition-colors text-left"
                >
                  How It Works
                </button>
                <button
                  onClick={() => smoothScrollTo("scanner")}
                  className="text-gray-700 hover:text-emerald-600 transition-colors text-left"
                >
                  Scanner
                </button>
                <button
                  onClick={() => {
                    const footer = document.querySelector("footer")
                    if (footer) {
                      footer.scrollIntoView({ behavior: "smooth", block: "start" })
                    }
                    setMobileMenuOpen(false)
                  }}
                  className="text-gray-700 hover:text-emerald-600 transition-colors text-left"
                >
                  About
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section
          id="hero"
          className={`relative min-h-screen flex items-center justify-center overflow-hidden ${isVisible ? "opacity-100" : "opacity-0"} transition-opacity duration-1000`}
        >
          {/* Forest footprint background image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/design-mode/image.png"
              alt="Forest with footprint"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          <div className="container relative z-10 px-4 py-32 text-center text-white">
            <div className="mb-4">
              <p className="text-sm md:text-base font-semibold uppercase tracking-widest text-blue-200 letter-spacing">
                Track, Analyze, and Reduce
              </p>
            </div>

            {/* Hero heading */}
            <h1 className="text-6xl md:text-8xl font-black mb-12 leading-tight">
              <div className="text-white">YOUR CARBON</div>
              <div className="text-amber-300 mt-2 text-9xl">FOOTPRINT</div>
            </h1>

            <p className="text-lg md:text-2xl mb-12 max-w-4xl mx-auto text-blue-50 leading-relaxed font-light">
              EcoSnap turns your shopping receipts into a powerful tool for climate action. Just snap a photo to
              instantly track the carbon impact of your purchases.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                onClick={() => smoothScrollTo("scanner")}
                size="lg"
                className="bg-cyan-400 text-emerald-900 hover:bg-cyan-300 px-8 py-3 text-lg font-bold shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:-translate-y-1 active:scale-95 transform rounded-full"
              >
                Get Started Free
              </Button>
              <Button
                onClick={() => smoothScrollTo("how-it-works")}
                size="lg"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-emerald-700 px-8 py-3 text-lg font-bold transition-all duration-300 shadow-lg hover:scale-110 hover:shadow-2xl hover:-translate-y-1 active:scale-95 transform rounded-full animate-pulse hover:animate-none"
              >
                How it Works
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="relative py-24 px-4 bg-gray-50 animate-on-scroll overflow-hidden">
          <div className="container mx-auto max-w-7xl relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold text-emerald-800 mb-6 stagger-child">How It Works</h2>
              <p className="text-2xl text-emerald-700 max-w-4xl mx-auto stagger-child">
                Get your analysis in 3 simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1: Snap Your Receipt */}
              <div className="border-2 border-emerald-200 rounded-lg p-8 hover:shadow-lg transition-shadow stagger-child bg-white">
                <div className="mx-auto mb-6 p-4 rounded-full w-fit bg-cyan-100">
                  <Camera className="h-8 w-8 text-emerald-700" />
                </div>
                <h3 className="text-xl font-bold text-emerald-900 mb-4 text-center">Snap Your Receipt</h3>
                <p className="text-gray-600 text-center">Take a photo or upload a digital file of any receipt.</p>
              </div>

              {/* Card 2: See Your Impact */}
              <div className="border-2 border-emerald-200 rounded-lg p-8 hover:shadow-lg transition-shadow stagger-child bg-white">
                <div className="mx-auto mb-6 p-4 rounded-full w-fit bg-cyan-100">
                  <PieChart className="h-8 w-8 text-emerald-700" />
                </div>
                <h3 className="text-xl font-bold text-emerald-900 mb-4 text-center">See Your Impact</h3>
                <p className="text-gray-600 text-center">
                  Our AI instantly analyzes the carbon footprint of each item.
                </p>
              </div>

              {/* Card 3: Discover Alternatives */}
              <div className="border-2 border-emerald-200 rounded-lg p-8 hover:shadow-lg transition-shadow stagger-child bg-white">
                <div className="mx-auto mb-6 p-4 rounded-full w-fit bg-cyan-100">
                  <Leaf className="h-8 w-8 text-emerald-700" />
                </div>
                <h3 className="text-xl font-bold text-emerald-900 mb-4 text-center">Discover Alternatives</h3>
                <p className="text-gray-600 text-center">
                  Get personalized tips for greener choices and track your progress.
                </p>
              </div>
            </div>

            <div className="flex justify-center mt-16"></div>
          </div>
        </section>

        {/* Scanner Section */}
        <section
          id="scanner"
          className="relative py-10 px-4 pt-36 min-h-screen flex items-center justify-center bg-emerald-700 animate-on-scroll overflow-hidden"
        >
          <div className="container max-w-5xl relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">Snap Your Receipt</h2>
              <p className="text-blue-100 max-w-3xl mx-auto stagger-child text-xl">
                Take a photo of your receipt or upload it directly to instantly analyze the carbon footprint of your
                purchases.
              </p>
            </div>

            {selectedImage ? (
              <div className="max-w-2xl mx-auto">
                <div className="relative rounded-2xl overflow-hidden mb-8 shadow-xl">
                  <img
                    src={selectedImage || "/placeholder.svg"}
                    alt="Selected receipt"
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    size="lg"
                    className="bg-cyan-400 text-emerald-900 hover:bg-cyan-300 px-10 py-4 text-lg font-bold shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:-translate-y-1 active:scale-95 transform rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? "Processing..." : "View Your Carbon Footprint"}
                  </Button>
                  <Button
                    onClick={() => setSelectedImage("")}
                    size="lg"
                    className="px-10 py-4 text-lg font-bold text-emerald-900 bg-white border-2 border-white hover:bg-gray-100 hover:text-emerald-900 transition-all duration-300 rounded-full shadow-lg"
                  >
                    Choose Different Image
                  </Button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => {
                  const input = document.createElement("input")
                  input.type = "file"
                  input.accept =
                    ".pdf,.jpg,.jpeg,.png,.gif,.svg,.webp,.avif,.tiff,.tif,application/pdf,image/jpeg,image/png,image/gif,image/svg+xml,image/webp,image/avif,image/tiff"
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = (event) => {
                        setSelectedImage(event.target?.result as string)
                      }
                      reader.readAsDataURL(file)
                    }
                  }
                  input.click()
                }}
                className="relative flex flex-col items-center justify-center p-24 border-4 border-dashed border-cyan-300 rounded-3xl cursor-pointer hover:border-cyan-200 transition-all duration-300 w-full bg-emerald-700"
              >
                <Upload className="h-16 w-16 text-cyan-300 mb-8" />
                <p className="text-2xl md:text-3xl font-bold text-white text-center">
                  Drop your receipt image here or click to upload
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Results Section */}
        {showResults && (
          <section
            id="results"
            className="relative py-10 px-4 pt-36 min-h-screen bg-gradient-to-b from-gray-50 to-amber-50 animate-on-scroll overflow-hidden"
          >
            <div className="container max-w-7xl mx-auto relative z-10">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-6">Your Impact Report</h2>
                <p className="text-gray-600 max-w-3xl mx-auto text-xl">
                  Understand your carbon footprint and discover ways to reduce it
                </p>
              </div>

              {analysisResult ? (
                <div className="grid md:grid-cols-2 gap-10">
                  {/* Total Footprint Card */}
                  <Card className="shadow-xl border-emerald-200 md:col-span-2 bg-white">
                    <CardHeader className="pb-6">
                      <CardTitle className="text-emerald-800 flex items-center gap-3 text-2xl">
                        <Leaf className="h-6 w-6 text-emerald-700" />
                        Total Carbon Footprint
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-5xl font-bold text-emerald-700 mb-2">
                        {analysisResult.totalFootprint.toFixed(2)} kg CO₂e
                      </div>
                      <p className="text-gray-600">
                        This is the equivalent of driving {(analysisResult.totalFootprint / 0.21).toFixed(0)} km in a
                        car
                      </p>
                    </CardContent>
                  </Card>

                  {/* Category Breakdown */}
                  {analysisResult.categories.map((category, index) => (
                    <Card key={index} className="shadow-xl border-emerald-200 bg-white">
                      <CardHeader className="pb-6">
                        <CardTitle className="text-emerald-800 flex items-center gap-3">
                          <BarChart3 className="h-6 w-6" />
                          {category.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-emerald-700 mb-4">
                          {category.value.toFixed(2)} kg CO₂e
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2">Greener Alternatives:</h4>
                          <ul className="space-y-2">
                            {category.suggestions.map((suggestion, i) => (
                              <li key={i} className="text-gray-600 flex items-start gap-2">
                                <Leaf className="h-4 w-4 text-emerald-700 mt-1 flex-shrink-0" />
                                <span>{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Item Breakdown */}
                  <Card className="shadow-xl border-emerald-200 md:col-span-2 bg-white">
                    <CardHeader className="pb-6">
                      <CardTitle className="text-emerald-800 flex items-center gap-3">
                        <BarChart3 className="h-6 w-6" />
                        Item Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Item
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                CO₂e (kg)
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {analysisResult.itemBreakdown.map((item, index) => (
                              <tr key={index}>
                                <td className="px-3 py-2 whitespace-normal text-sm">{item.item}</td>
                                <td className="px-3 py-2 whitespace-normal text-sm">{item.category}</td>
                                <td className="px-3 py-2 whitespace-normal text-sm font-medium text-emerald-700">
                                  {item.co2e.toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center p-16 bg-white rounded-lg shadow-lg">
                  <p className="text-gray-500 text-xl">Analyzing your receipt...</p>
                </div>
              )}
              {analysisError && (
                <div className="mt-8 text-center p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-lg">
                  <h3 className="text-xl font-bold mb-2">An Error Occurred</h3>
                  <p>{analysisError}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="bg-emerald-900 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {/* Brand Section */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Leaf className="h-6 w-6 text-amber-400" />
                  <span className="text-xl font-bold">EcoSnap</span>
                </div>
                <p className="text-blue-100 mb-3 text-sm">
                  Making environmental impact tangible through AI-powered carbon footprint analysis of everyday
                  purchases.
                </p>
              </div>

              {/* Features Column */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Features</h3>
                <ul className="space-y-1 text-blue-100 text-sm">
                  <li>Universal Document Scanner</li>
                  <li>Multi-Category Analysis</li>
                  <li>Greener Alternatives</li>
                  <li>Progress Dashboard</li>
                </ul>
              </div>

              {/* Company Column */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Company</h3>
                <ul className="space-y-1 text-blue-100 text-sm">
                  <li>About Us</li>
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                  <li>Contact</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-emerald-800 pt-6 text-center">
              <p className="text-blue-100 text-sm">© 2025 EcoSnap. Making sustainability actionable.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

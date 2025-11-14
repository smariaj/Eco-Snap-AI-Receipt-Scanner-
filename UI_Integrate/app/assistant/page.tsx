'use client'

import { useState } from 'react'
import { Leaf, MessageSquare, Send, Menu, X } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function EcoAssistant() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text?: string; html?: JSX.Element }[]>([
    {
      role: 'ai',
      text:
        "Hi! I'm your AI Eco Assistant. How can I help you today? You can ask me things like:",
    },
    {
      role: 'user',
      text: "What's the footprint of an avocado?",
    },
    {
      role: 'ai',
      html: (
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
            The footprint of an avocado
          </h3>
          <p style={{ color: '#111827', marginBottom: '0.75rem' }}>
            The footprint of an avocado is influenced by several factors. The biggest three:
          </p>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <div>
              <strong style={{ color: '#111827' }}>💧 Water Usage</strong>
              <ul style={{ marginTop: '0.25rem', paddingLeft: '1rem', color: '#111827' }}>
                <li>Avocados are water‑intensive: ~1,000–2,000 liters per kg.</li>
                <li><strong>High water footprint</strong> compared to most fruits.</li>
                <li><strong>Water stress</strong> in dry regions affects local communities.</li>
              </ul>
            </div>
            <div>
              <strong style={{ color: '#111827' }}>🌲 Land Use & Deforestation</strong>
              <ul style={{ marginTop: '0.25rem', paddingLeft: '1rem', color: '#111827' }}>
                <li>Expansion can lead to land clearing in sensitive areas.</li>
                <li><strong>Habitat loss</strong> displaces wildlife and reduces biodiversity.</li>
              </ul>
            </div>
            <div>
              <strong style={{ color: '#111827' }}>✈️ Transportation & Refrigeration</strong>
              <ul style={{ marginTop: '0.25rem', paddingLeft: '1rem', color: '#111827' }}>
                <li>Often grown far from consumers and shipped long distances.</li>
                <li><strong>Carbon footprint</strong> rises with air freight and cold‑chain storage.</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendPrompt = async (text: string) => {
    const prompt = text.trim()
    if (!prompt) return
    setMessages((prev) => [...prev, { role: 'user', text: prompt }])
    setInput('')
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg)
      }
      const data = await res.json()
      const reply = typeof data?.text === 'string' && data.text.length > 0 ? data.text : 'No answer received.'
      setMessages((prev) => [...prev, { role: 'ai', text: reply }])
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      setError(msg)
      setMessages((prev) => [...prev, { role: 'ai', text: `Error: ${msg}` }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fcfbf8' }}>
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Leaf className="h-6 w-6" style={{ color: '#004d40' }} />
              <span className="text-xl font-bold" style={{ color: '#004d40' }}>
                ECOSNAP
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="font-medium hover:opacity-80" style={{ color: '#004d40' }}>
                Home
              </a>
              <a href="/#how-it-works" className="font-medium hover:opacity-80" style={{ color: '#004d40' }}>
                How It Works
              </a>
              <a href="/#scanner" className="font-medium hover:opacity-80" style={{ color: '#004d40' }}>
                Scanner
              </a>
              <span className="font-semibold underline" style={{ color: '#004d40' }}>
                AI Assistant
              </span>
              <a href="/journey" className="font-medium hover:opacity-80" style={{ color: '#004d40' }}>
                My Journey
              </a>
            </div>

            {/* Mobile button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden" style={{ color: '#004d40' }}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Nav */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white/95 backdrop-blur-sm rounded-lg mt-2 p-4 shadow-lg">
              <div className="flex flex-col space-y-4">
                <a href="/" className="text-gray-700 hover:text-emerald-600 transition-colors text-left">
                  Home
                </a>
                <a href="/#how-it-works" className="text-gray-700 hover:text-emerald-600 transition-colors text-left">
                  How It Works
                </a>
                <a href="/#scanner" className="text-gray-700 hover:text-emerald-600 transition-colors text-left">
                  Scanner
                </a>
                <span className="text-emerald-700 font-semibold">AI Assistant</span>
                <a href="/journey" className="text-gray-700 hover:text-emerald-600 transition-colors text-left">
                  My Journey
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Page Title */}
      <section className="pt-28 pb-6 px-4">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-5xl font-bold mb-2" style={{ color: '#004d40' }}>
            Eco Assistant
          </h1>
          <p className="text-lg" style={{ color: '#111827' }}>
            Ask me anything about your carbon footprint, sustainable products, or how to reduce your impact.
          </p>
        </div>
      </section>

      {/* Chat Card */}
      <section className="px-4 pb-24">
        <div className="container mx-auto max-w-5xl">
          <Card className="shadow-md rounded-2xl bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-2xl" style={{ color: '#004d40' }}>
                <MessageSquare className="h-6 w-6" /> AI Eco Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Chat History */}
              <div className="space-y-4">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`max-w-3xl rounded-2xl p-4 shadow-sm ${
                      m.role === 'ai' ? 'self-start' : 'self-end ml-auto'
                    }`}
                    style={{
                      backgroundColor: m.role === 'ai' ? '#F5F5F5' : '#004d40',
                      color: m.role === 'ai' ? '#111827' : '#ffffff',
                    }}
                  >
                    {m.html ? m.html : m.text}
                  </div>
                ))}

                {/* Suggestions */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    onClick={() => sendPrompt("What's the footprint of an avocado?")}
                    className="rounded-full"
                    style={{ borderColor: '#c8e6c9', color: '#004d40' }}
                  >
                    What's the footprint of an avocado?
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => sendPrompt('Suggest a low-carbon alternative for...')}
                    className="rounded-full"
                    style={{ borderColor: '#c8e6c9', color: '#004d40' }}
                  >
                    Suggest a low-carbon alternative for...
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => sendPrompt('Explain my last impact report')}
                    className="rounded-full"
                    style={{ borderColor: '#c8e6c9', color: '#004d40' }}
                  >
                    Explain my last impact report
                  </Button>
                </div>
              </div>

              {/* Input Bar */}
              <div className="mt-6 flex items-center gap-3">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 rounded-full border px-4 py-3 shadow-sm"
                  style={{ borderColor: '#e5e7eb', color: '#111827' }}
                />
                <Button
                  onClick={() => sendPrompt(input)}
                  className="rounded-full px-5"
                  style={{ backgroundColor: '#004d40', color: '#ffffff' }}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              {loading && (
                <div className="mt-3 text-sm" style={{ color: '#004d40' }}>Thinking…</div>
              )}
              {error && (
                <div className="mt-3 text-sm text-red-700">{error}</div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Leaf className="h-6 w-6 text-amber-400" />
                <span className="text-xl font-bold">EcoSnap</span>
              </div>
              <p className="text-blue-100 mb-3 text-sm">
                Making environmental impact tangible through AI-powered carbon footprint analysis of everyday purchases.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Features</h3>
              <ul className="space-y-1 text-blue-100 text-sm">
                <li>Universal Document Scanner</li>
                <li>Multi-Category Analysis</li>
                <li>Greener Alternatives</li>
                <li>Progress Dashboard</li>
              </ul>
            </div>
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
  )
}

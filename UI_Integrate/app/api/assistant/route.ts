import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : ""
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Server missing GEMINI_API_KEY" }, { status: 500 })
    }

    let discovered: string[] = []
    try {
      const listRes = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`)
      if (listRes.ok) {
        const listJson = await listRes.json()
        const modelsArr = Array.isArray(listJson.models) ? listJson.models : []
        const candidates = modelsArr
          .filter((m: any) => Array.isArray(m?.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'))
          .map((m: any) => {
            const n = String(m?.name || '')
            return n.startsWith('models/') ? n.slice(7) : n
          })
        const preferOrder = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-1.0-pro', 'gemini-pro', 'gemini-flash']
        candidates.sort((a: string, b: string) => {
          const ai = preferOrder.findIndex(p => a.includes(p))
          const bi = preferOrder.findIndex(p => b.includes(p))
          return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
        })
        discovered = candidates
      }
    } catch {}
    const models = [
      process.env.GEMINI_MODEL || 'gemini-1.5-flash-latest',
      ...discovered,
      'gemini-1.5-flash-8b-latest',
      'gemini-1.5-pro-latest',
      'gemini-pro',
    ]
    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    }

    let lastErrorText = ''
    const generationConfig = {
      temperature: 0.7,
      maxOutputTokens: 512,
    }
    const shouldRetry = (status: number) => status === 429 || status === 503
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
    for (const model of models) {
      const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 30000)
      try {
        let attempt = 0
        while (attempt < 3) {
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...payload, generationConfig }),
            signal: controller.signal,
          })
          if (!res.ok) {
            const ct = res.headers.get('content-type') || ''
            let msg = ''
            if (ct.includes('application/json')) {
              const j = await res.json().catch(() => null)
              msg = (j && j.error && j.error.message) || JSON.stringify(j)
            } else {
              msg = await res.text()
            }
            lastErrorText = msg || `HTTP ${res.status}`
            if (shouldRetry(res.status)) {
              attempt++
              await sleep(1000 * Math.pow(2, attempt - 1))
              continue
            }
            if (res.status === 404 || res.status === 400) break
            return NextResponse.json({ error: lastErrorText }, { status: res.status })
          }
          const data = await res.json()
          const parts = data?.candidates?.[0]?.content?.parts ?? []
          const text = parts.map((p: any) => p?.text || "").join("\n").trim()
          if (text) return NextResponse.json({ text, model })
          const dt = String(data?.candidates?.[0]?.output_text || '')
          if (dt) return NextResponse.json({ text: dt, model })
          break
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : "Unknown error"
        lastErrorText = message
      } finally {
        clearTimeout(timeout)
      }
    }
    return NextResponse.json({ error: `LLM error: ${lastErrorText || 'no compatible model or overloaded'}` }, { status: 502 })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

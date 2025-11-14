import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 })
    }

    // Forward the request to the Flask backend
    // Default to 127.0.0.1 to avoid any localhost resolution quirks
    const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:5000'
    const backendFormData = new FormData()
    backendFormData.append('file', file)

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 60000)
    let response: Response
    try {
      response = await fetch(`${backendUrl}/analyze-receipt`, {
        method: 'POST',
        body: backendFormData,
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      })
    } catch (err: unknown) {
      clearTimeout(timeout)
      const message = err instanceof Error ? err.message : 'Unknown error'
      try {
        const pingController = new AbortController()
        const pingTimeout = setTimeout(() => pingController.abort(), 5000)
        const health = await fetch(`${backendUrl}/`, { signal: pingController.signal })
        clearTimeout(pingTimeout)
        if (!health.ok) {
          return NextResponse.json({ error: `Backend not healthy: ${health.status}` }, { status: 502 })
        }
      } catch {
        return NextResponse.json({ error: `Backend unreachable: ${message}` }, { status: 502 })
      }
      return NextResponse.json({ error: `Backend error: ${message}` }, { status: 502 })
    }
    clearTimeout(timeout)

    if (!response.ok) {
      const ct = response.headers.get('content-type') || ''
      if (ct.includes('application/json')) {
        const json = await response.json()
        const msg = typeof json?.error === 'string' ? json.error : JSON.stringify(json)
        return NextResponse.json({ error: msg }, { status: response.status })
      }
      const errorText = await response.text()
      return NextResponse.json({ error: errorText || 'Backend error' }, { status: response.status })
    }

    const backendData = await response.json()
    console.log("Backend data received:", backendData)
    
    // Validate backend data structure
    if (!backendData.results || !Array.isArray(backendData.results)) {
      console.error("Invalid backend data structure:", backendData)
      return NextResponse.json({ error: "Invalid response from analysis service" }, { status: 500 })
    }
    
    // Transform the backend response to match the frontend expected format
    const toLower = (s: string) => s.toLowerCase()
    const hasKeyword = (s: string, keywords: string[]) => {
      const n = toLower(s)
      return keywords.some((k) => new RegExp(`\\b${k}s?\\b`).test(n))
    }
    const FOOD = [
      'milk','cheese','beef','lamb','pork','chicken','poultry','fish','egg','rice','wheat','corn','tomato','tomatoes','spinach','vegetable','vegetables','fruit','fruits','apple','banana','peanut','peanuts','lentil','lentils','chickpea','chickpeas','sorghum','sugar','sugarcane','legume','beans'
    ]
    const HOUSEHOLD = ['plastic','cleaning','detergent','container','bottle','bag','soap','shampoo']

    const totals = backendData.results.reduce(
      (acc: { food: number; household: number; other: number }, item: any) => {
        const name = String(item.item || '')
        const val = Number(item.carbon || 0)
        if (name && hasKeyword(name, FOOD)) acc.food += val
        else if (name && hasKeyword(name, HOUSEHOLD)) acc.household += val
        else acc.other += val
        return acc
      },
      { food: 0, household: 0, other: 0 }
    )

    const categoriesBase = [
      { name: 'Food & Beverages', value: totals.food, suggestions: [
        'Choose local and seasonal products',
        'Opt for lower-carbon protein sources',
        'Reduce food waste and buy in bulk',
      ] },
      { name: 'Household Items', value: totals.household, suggestions: [
        'Prefer reusable and minimal packaging',
        'Pick eco-labeled or recycled materials',
        'Avoid single-use items',
      ] },
      { name: 'Other', value: totals.other, suggestions: [
        'Check product sustainability certifications',
        'Consider lifecycle impact before purchasing',
        'Support environmentally responsible brands',
      ] },
    ]

    const categories = categoriesBase.filter((c) => c.value > 0)

    const totalFootprint = totals.food + totals.household + totals.other

    const analysisResult = {
      totalFootprint,
      categories,
      itemBreakdown: backendData.results.map((item: any) => {
        const name = String(item.item || '')
        const val = Number(item.carbon || 0)
        const category = hasKeyword(name, FOOD)
          ? 'Food & Beverages'
          : hasKeyword(name, HOUSEHOLD)
          ? 'Household Items'
          : 'Other'
        return { item: name || 'Unknown Item', co2e: val, category }
      }),
    }

    return NextResponse.json(analysisResult)
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

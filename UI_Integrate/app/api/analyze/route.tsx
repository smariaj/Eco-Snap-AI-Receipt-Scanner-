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
    const analysisResult = {
      totalFootprint: backendData.results.reduce((sum: number, item: any) => sum + (item.carbon || 0), 0),
      categories: [
        {
          name: "Food & Beverages",
          value: backendData.results.filter((item: any) => 
            item.item && ['milk', 'cheese', 'beef', 'chicken', 'fish', 'rice', 'wheat', 'corn', 'tomatoes', 'apples', 'bananas'].some(food => 
              item.item.toLowerCase().includes(food)
            )
          ).reduce((sum: number, item: any) => sum + (item.carbon || 0), 0),
          suggestions: [
            "Choose local and seasonal products to reduce transportation emissions",
            "Opt for plant-based alternatives to reduce food-related carbon footprint",
            "Buy in bulk to reduce packaging waste",
          ],
        },
        {
          name: "Household Items",
          value: backendData.results.filter((item: any) => 
            item.item && ['plastic', 'cleaning', 'container', 'bottle', 'bag'].some(household => 
              item.item.toLowerCase().includes(household)
            )
          ).reduce((sum: number, item: any) => sum + (item.carbon || 0), 0),
          suggestions: [
            "Look for products with minimal packaging",
            "Choose eco-friendly or recycled alternatives",
            "Buy reusable items instead of single-use products",
          ],
        },
        {
          name: "Other",
          value: backendData.results.filter((item: any) => 
            item.item && !['milk', 'cheese', 'beef', 'chicken', 'fish', 'rice', 'wheat', 'corn', 'tomatoes', 'apples', 'bananas', 'plastic', 'cleaning', 'container', 'bottle', 'bag'].some(category => 
              item.item.toLowerCase().includes(category)
            )
          ).reduce((sum: number, item: any) => sum + (item.carbon || 0), 0),
          suggestions: [
            "Check product certifications for sustainability",
            "Consider the product lifecycle before purchasing",
            "Support brands with strong environmental commitments",
          ],
        },
      ],
      itemBreakdown: backendData.results.map((item: any) => ({
        item: item.item || "Unknown Item",
        co2e: item.carbon || 0,
        category: item.item && ['milk', 'cheese', 'beef', 'chicken', 'fish', 'rice', 'wheat', 'corn', 'tomatoes', 'apples', 'bananas'].some(food => 
          item.item.toLowerCase().includes(food)
        ) ? "Food & Beverages" : 
        item.item && ['plastic', 'cleaning', 'container', 'bottle', 'bag'].some(household => 
          item.item.toLowerCase().includes(household)
        ) ? "Household Items" : "Other"
      })),
    }

    return NextResponse.json(analysisResult)
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

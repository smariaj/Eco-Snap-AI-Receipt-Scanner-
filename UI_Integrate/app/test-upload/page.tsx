"use client"

import { useState, useEffect } from "react"

export default function TestUploadPage() {
  const [status, setStatus] = useState("Starting test...")
  const [response, setResponse] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const runTest = async () => {
      try {
        setStatus("Fetching image...")
        // Fetch the image from the public directory
        const imageResponse = await fetch("/images/design-mode/image.png")
        if (!imageResponse.ok) {
          throw new Error("Failed to fetch test image.")
        }
        const blob = await imageResponse.blob()
        const file = new File([blob], 'image.png', { type: 'image/png' })

        const formData = new FormData()
        formData.append('file', file)

        setStatus("Sending request to /api/analyze...")
        const apiResponse = await fetch("/api/analyze", {
          method: "POST",
          body: formData,
        })

        setStatus(`Received response with status: ${apiResponse.status}`)

        if (!apiResponse.ok) {
          const errorText = await apiResponse.text()
          setError(errorText)
          setResponse(null)
        } else {
          const data = await apiResponse.json()
          setResponse(data)
          setError(null)
        }
      } catch (e: any) {
        setStatus("Test failed with an exception.")
        setError(e.message)
        setResponse(null)
      }
    }

    runTest()
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Automated API Test</h1>
      <h2>Status: {status}</h2>
      {error && (
        <div>
          <h3>Error:</h3>
          <pre style={{ background: '#fdd', border: '1px solid red', padding: '10px', whiteSpace: 'pre-wrap' }}>
            {error}
          </pre>
        </div>
      )}
      {response && (
        <div>
          <h3>Success Response:</h3>
          <pre style={{ background: '#dfd', border: '1px solid green', padding: '10px', whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

import type { Config } from '@netlify/functions'

export default async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  let formData: Record<string, unknown>
  try {
    const body = await req.json()
    formData = body.formData
    if (!formData) throw new Error('Missing formData')
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  // Try multiple API key env vars (OPENROUTER_API_KEY is priority, fallback to VITE_OPENROUTER_API_KEY)
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY
  
  if (!apiKey) {
    console.error('FATAL: No OpenRouter API key found in environment')
    return Response.json({ 
      error: 'OPENROUTER_API_KEY not configured in Netlify environment',
      hint: 'Add OPENROUTER_API_KEY to Netlify site settings → Environment variables'
    }, { status: 500 })
  }

  const prompt = `Kamu adalah expert HR dan CV writer profesional Indonesia.
Buatkan CV yang profesional, menarik, dan ATS-friendly berdasarkan data berikut: ${JSON.stringify(formData)}

Instruksi:
- Tulis summary yang kuat dan menarik (3-4 kalimat)
- Perkuat setiap poin pengalaman dengan action verbs
- Organisir skills dengan rapi
- Tone profesional tapi personal, Bahasa Indonesia
- Balas HANYA dengan JSON valid berikut, tanpa markdown, tanpa penjelasan apapun:
{
  "profile": { "name": "", "email": "", "phone": "", "location": "", "jobTitle": "", "summary": "" },
  "education": [{ "institution": "", "degree": "", "year": "", "description": "" }],
  "experience": [{ "company": "", "position": "", "period": "", "points": [] }],
  "skills": { "technical": [], "soft": [] },
  "languages": [],
  "achievements": []
}`

  try {
    console.log('[DEBUG] Calling OpenRouter API with model: deepseek/deepseek-chat')
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NETLIFY_SITE_URL || 'http://localhost:3000',
        'X-Title': 'CVCraft AI',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2048,
        temperature: 0.7,
      }),
    })

    console.log(`[DEBUG] OpenRouter response status: ${response.status}`)

    // Handle non-200 responses
    if (!response.ok) {
      let errorData: any = {}
      const contentType = response.headers.get('content-type')
      
      try {
        if (contentType?.includes('application/json')) {
          errorData = await response.json()
        } else {
          const text = await response.text()
          errorData = { raw_response: text }
        }
      } catch (e) {
        errorData = { parse_error: 'Could not parse error response' }
      }

      console.error(`[ERROR] OpenRouter API error (${response.status}):`, errorData)
      
      return Response.json(
        { 
          error: 'AI generation failed', 
          status: response.status,
          details: errorData,
          message: getErrorMessage(response.status, errorData)
        }, 
        { status: response.status }
      )
    }

    // Parse successful response
    let data: any
    const contentType = response.headers.get('content-type')
    
    if (!contentType?.includes('application/json')) {
      const text = await response.text()
      console.error('[ERROR] Invalid content-type. Response:', text.substring(0, 200))
      return Response.json({ 
        error: 'Invalid response from OpenRouter',
        details: `Expected JSON, got ${contentType}`
      }, { status: 500 })
    }

    try {
      data = await response.json()
    } catch (parseErr) {
      console.error('[ERROR] Failed to parse response JSON:', parseErr)
      return Response.json({ 
        error: 'Failed to parse AI response',
        details: 'Response was not valid JSON'
      }, { status: 500 })
    }

    const text = data.choices?.[0]?.message?.content || ''

    if (!text) {
      console.error('[ERROR] Empty content from AI response:', data)
      return Response.json({ 
        error: 'Empty response from AI',
        details: 'AI returned empty content'
      }, { status: 500 })
    }

    console.log('[DEBUG] AI generated content length:', text.length)

    // Parse JSON from response — strip any accidental markdown fences
    const cleaned = text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim()
    
    let result: any
    try {
      result = JSON.parse(cleaned)
    } catch (jsonErr) {
      console.error('[ERROR] Failed to parse generated JSON:', jsonErr)
      console.error('[DEBUG] Generated content:', text.substring(0, 300))
      return Response.json({ 
        error: 'Failed to parse CV JSON from AI',
        details: jsonErr instanceof Error ? jsonErr.message : 'Invalid JSON format'
      }, { status: 500 })
    }

    console.log('[DEBUG] CV generated successfully')
    return Response.json({ result })
  } catch (err) {
    console.error('[ERROR] Unexpected error:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return Response.json({ 
      error: 'AI generation failed', 
      message,
      type: err instanceof Error ? err.constructor.name : 'Unknown'
    }, { status: 500 })
  }
}

function getErrorMessage(status: number, errorData: any): string {
  if (status === 401) {
    return 'API Key invalid atau expired. Cek OPENROUTER_API_KEY di Netlify environment.'
  }
  if (status === 429) {
    return 'Rate limit exceeded. Coba lagi dalam beberapa detik.'
  }
  if (status === 503) {
    return 'OpenRouter service unavailable. Coba lagi nanti.'
  }
  if (errorData?.error?.message) {
    return errorData.error.message
  }
  return `HTTP ${status}: ${JSON.stringify(errorData).substring(0, 100)}`
}

export const config: Config = {
  path: '/api/generate-cv',
}

import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    return res.status(200).setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type')
      .end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { formData } = req.body
  if (!formData) {
    return res.status(400).json({ error: 'Missing formData' })
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  
  if (!apiKey) {
    console.error('FATAL: No OpenRouter API key found in environment')
    return res.status(500).json({ 
      error: 'OPENROUTER_API_KEY not configured in Vercel environment',
      hint: 'Add OPENROUTER_API_KEY to Vercel project settings → Environment Variables'
    })
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
        'HTTP-Referer': process.env.VERCEL_URL || 'http://localhost:3000',
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
      
      return res.status(response.status).json({ 
        error: 'AI generation failed', 
        status: response.status,
        details: errorData,
        message: getErrorMessage(response.status, errorData)
      })
    }

    let data: any
    const contentType = response.headers.get('content-type')
    
    if (!contentType?.includes('application/json')) {
      const text = await response.text()
      console.error('[ERROR] Invalid content-type. Response:', text.substring(0, 200))
      return res.status(500).json({ 
        error: 'Invalid response from OpenRouter',
        details: `Expected JSON, got ${contentType}`
      })
    }

    try {
      data = await response.json()
    } catch (parseErr) {
      console.error('[ERROR] Failed to parse response JSON:', parseErr)
      return res.status(500).json({ 
        error: 'Failed to parse AI response',
        details: 'Response was not valid JSON'
      })
    }

    const text = data.choices?.[0]?.message?.content || ''

    if (!text) {
      console.error('[ERROR] Empty content from AI response:', data)
      return res.status(500).json({ 
        error: 'Empty response from AI',
        details: 'AI returned empty content'
      })
    }

    console.log('[DEBUG] AI generated content length:', text.length)

    const cleaned = text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim()
    
    let result: any
    try {
      result = JSON.parse(cleaned)
    } catch (jsonErr) {
      console.error('[ERROR] Failed to parse generated JSON:', jsonErr)
      console.error('[DEBUG] Generated content:', text.substring(0, 300))
      return res.status(500).json({ 
        error: 'Failed to parse CV JSON from AI',
        details: jsonErr instanceof Error ? jsonErr.message : 'Invalid JSON format'
      })
    }

    console.log('[DEBUG] CV generated successfully')
    return res.status(200).json({ result })
  } catch (err) {
    console.error('[ERROR] Unexpected error:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return res.status(500).json({ 
      error: 'AI generation failed', 
      message,
      type: err instanceof Error ? err.constructor.name : 'Unknown'
    })
  }
}

function getErrorMessage(status: number, errorData: any): string {
  if (status === 401) {
    return 'API Key invalid atau expired. Cek OPENROUTER_API_KEY di Vercel environment.'
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

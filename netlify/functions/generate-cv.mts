import type { Config } from '@netlify/functions'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic()

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
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''

    // Parse JSON from response — strip any accidental markdown fences
    const cleaned = text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim()
    const result = JSON.parse(cleaned)

    return Response.json({ result })
  } catch (err) {
    console.error('AI generation error:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return Response.json({ error: 'AI generation failed', message }, { status: 500 })
  }
}

export const config: Config = {
  path: '/api/generate-cv',
}

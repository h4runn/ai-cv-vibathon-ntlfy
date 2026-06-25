#!/usr/bin/env node

/**
 * Direct API Test Script
 * Test Netlify Function endpoint locally dan di production
 */

const API_KEY = process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY

console.log('\n╔════════════════════════════════════════════════════════════╗')
console.log('║          CVCraft AI - Function Test Script               ║')
console.log('╚════════════════════════════════════════════════════════════╝\n')

if (!API_KEY) {
  console.error('❌ Error: OPENROUTER_API_KEY not found in environment')
  console.log('\nSet it with:')
  console.log('  Windows: $env:OPENROUTER_API_KEY="sk-or-v1-xxx"')
  console.log('  Linux:   export OPENROUTER_API_KEY="sk-or-v1-xxx"')
  process.exit(1)
}

console.log('✅ API Key found:', API_KEY.substring(0, 20) + '...\n')

// Test data
const testFormData = {
  name: 'Test User',
  email: 'test@example.com',
  phone: '+62812345678',
  location: 'Jakarta, Indonesia',
  jobTitle: 'Software Developer',
  linkedin: 'https://linkedin.com/in/testuser',
  institution: 'Universitas Indonesia',
  degree: 'Sarjana Teknik Informatika',
  graduationYear: '2024',
  educationDesc: 'IPK 3.8, aktif organisasi',
  company: 'PT Tech Indonesia',
  position: 'Junior Developer',
  period: '2024 - Present',
  experiencePoints: '• Develop REST API dengan Node.js\n• Implement database schema dengan PostgreSQL\n• Optimize code performance',
  experiences: [],
  technicalSkills: 'Node.js, React, PostgreSQL, Docker, AWS',
  softSkills: 'Problem Solving, Team Work, Communication',
  languages: 'Indonesian (Native), English (Professional)',
  achievements: 'Top Performer Q1 2024'
}

async function testFunction(endpoint) {
  console.log(`\n📝 Testing endpoint: ${endpoint}`)
  console.log('=' .repeat(60))
  
  try {
    console.log('[1] Sending request...')
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formData: testFormData })
    })
    
    console.log(`[2] Response status: ${response.status} ${response.statusText}`)
    console.log(`[3] Content-Type: ${response.headers.get('content-type')}`)
    
    if (response.status === 404) {
      console.error('❌ 404 Error: Endpoint not found!')
      console.log('\nPossible causes:')
      console.log('  1. Function file not compiled')
      console.log('  2. Netlify dev server not running')
      console.log('  3. Wrong endpoint path')
      return false
    }
    
    const data = await response.json()
    
    if (!response.ok) {
      console.error('❌ Request failed:', data)
      return false
    }
    
    if (data.result && data.result.profile) {
      console.log('✅ Success! CV generated:')
      console.log('   Name:', data.result.profile.name)
      console.log('   Email:', data.result.profile.email)
      console.log('   Job Title:', data.result.profile.jobTitle)
      console.log('   Experience entries:', data.result.experience.length)
      console.log('   Technical skills:', data.result.skills.technical.length)
      return true
    } else {
      console.error('❌ Invalid response format:', data)
      return false
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
    return false
  }
}

async function runTests() {
  console.log('[TEST 1] Local Development Server')
  console.log('Make sure: npx netlify dev is running on port 3000\n')
  
  const localTest = await testFunction('http://localhost:3000/.netlify/functions/generate-cv')
  
  if (localTest) {
    console.log('\n✅ LOCAL TEST PASSED!')
    console.log('\nNext steps:')
    console.log('  1. git push origin main')
    console.log('  2. Netlify auto-deploys')
    console.log('  3. Test production URL')
  } else {
    console.log('\n❌ LOCAL TEST FAILED!')
    console.log('\nDebug steps:')
    console.log('  1. Is npx netlify dev running?')
    console.log('  2. Check: netlify/functions/generate-cv.ts exists?')
    console.log('  3. Check browser console for errors')
    console.log('  4. Check Netlify dev terminal for function errors')
  }
}

runTests().catch(console.error)

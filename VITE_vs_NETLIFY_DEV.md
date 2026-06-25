# 🔥 HTTP 404 - THE REAL ISSUE EXPLAINED

## ❌ THE ACTUAL PROBLEM

Kamu mendapat 404 karena:

**Running:** `npm run dev` (Vite dev server on port 5173)
**Need:** `npx netlify dev` (Netlify dev server on port 3000)

Netlify Functions HANYA tersedia di Netlify dev server, bukan di Vite dev server!

---

## 📊 VITE vs NETLIFY DEV - PERBEDAANNYA

```
VITE DEV SERVER (npm run dev)
├─ Port: 5173
├─ Runs: React frontend only
├─ Netlify Functions: ❌ NOT AVAILABLE
├─ Endpoint /.netlify/functions/*: ❌ 404 ERROR
└─ Good for: Frontend development only

NETLIFY DEV SERVER (npx netlify dev)
├─ Port: 3000
├─ Runs: React frontend + Netlify Functions
├─ Netlify Functions: ✅ AVAILABLE
├─ Endpoint /.netlify/functions/*: ✅ WORKS
└─ Good for: Full stack development (frontend + backend)
```

---

## ✅ THE SOLUTION

### NEVER do this (will get 404):
```bash
npm run dev
# Then try to access: http://localhost:5173/create
# Try to generate CV
# Result: HTTP 404 Error ❌
```

### DO THIS instead (will work):
```bash
npx netlify dev
# Then access: http://localhost:3000/create
# Try to generate CV
# Result: CV generates successfully! ✅
```

---

## 🚀 STEP-BY-STEP FIX

### STEP 1: Wait for npm install to finish
The `npm install -D netlify-cli` is running in background.

Check if it finished:
```bash
npm list netlify-cli
# Should show: netlify-cli@17.0.0 or similar
```

### STEP 2: Stop any running dev servers
```bash
# If Vite dev is running: Ctrl+C to stop
# If Netlify dev is running: Ctrl+C to stop
```

### STEP 3: Set environment variable
```powershell
# Windows PowerShell
$env:OPENROUTER_API_KEY = "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"
```

### STEP 4: Start Netlify dev server
```bash
npx netlify dev
```

Expected output:
```
◈ Netlify Dev ◈
◈ Loaded function: generate-cv
◈ Server started on http://localhost:3000
```

### STEP 5: Open browser
Go to: **http://localhost:3000/create** (NOT 5173!)

### STEP 6: Test CV generation
1. Fill form
2. Click "Generate CV"
3. Should work! ✅

---

## 🎯 KEY DIFFERENCES

| Aspect | Vite Dev | Netlify Dev |
|--------|----------|-------------|
| Command | `npm run dev` | `npx netlify dev` |
| Port | 5173 | 3000 |
| Frontend | ✅ Works | ✅ Works |
| Backend Functions | ❌ NOT available | ✅ Works |
| API endpoints | ❌ 404 | ✅ Available |
| Full-stack testing | ❌ NO | ✅ YES |

---

## ⚠️ COMMON MISTAKES

❌ **Mistake 1:** Run `npm run dev`, then try to generate CV
```
Result: HTTP 404 Error (functions not available in Vite)
```

❌ **Mistake 2:** Forget to set OPENROUTER_API_KEY before running
```
Result: Function runs but returns API key error
```

❌ **Mistake 3:** Try to access localhost:5173 for backend testing
```
Result: 404 (Netlify functions only available at 3000)
```

---

## ✅ CORRECT WORKFLOW

### For FRONTEND only development:
```bash
npm run dev
# Access: http://localhost:5173
# Note: Backend functions won't work
```

### For FULL-STACK development (frontend + backend functions):
```bash
npx netlify dev
# Access: http://localhost:3000
# Everything works! ✅
```

### For PRODUCTION:
```bash
npm run build
# Deployed to Netlify
# Netlify handles both frontend + functions
```

---

## 🧪 QUICK TEST

### To verify it works:

1. Stop all servers (Ctrl+C)

2. Set API key:
```powershell
$env:OPENROUTER_API_KEY = "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"
```

3. Start Netlify dev:
```bash
npx netlify dev
```

4. Open: http://localhost:3000/create

5. Fill form and generate CV

6. Check browser console (F12):
```
[DEBUG] Calling OpenRouter API...
[DEBUG] OpenRouter response status: 200
✅ Success!
```

---

## 📋 SETUP CHECKLIST

- [ ] `npm install -D netlify-cli` finished
- [ ] OPENROUTER_API_KEY set in .env
- [ ] OPENROUTER_API_KEY set in environment (PowerShell)
- [ ] No Vite dev server running
- [ ] Run: `npx netlify dev`
- [ ] See: "Loaded function: generate-cv"
- [ ] Access: http://localhost:3000/create
- [ ] Generate CV works
- [ ] No 404 error

---

## 🚀 COMMANDS TO USE

### Development (Full-stack):
```bash
npx netlify dev
# OR
npm run dev:netlify
```

### Development (Frontend only):
```bash
npm run dev
# Note: Backend won't work
```

### Build:
```bash
npm run build
```

### Preview:
```bash
npm run preview
```

---

## 💡 WHY THIS HAPPENS

**Vite** is a **frontend bundler**
- Purpose: Bundle React code for browser
- Has: Hot module reloading for frontend
- Missing: Backend function handling

**Netlify Dev** is a **full-stack simulator**
- Purpose: Simulate Netlify environment locally
- Has: Frontend + Backend functions
- Includes: Function routing + environment setup

For testing Netlify Functions locally, MUST use Netlify Dev!

---

## ✨ SUMMARY

**Problem:** `npm run dev` doesn't support Netlify Functions
**Solution:** Use `npx netlify dev` instead
**Port:** Change from 5173 → 3000
**Result:** Functions available + Everything works!

---

## 🎯 DO THIS RIGHT NOW

1. Make sure `npm install -D netlify-cli` finishes
2. Stop current dev server (if running)
3. Set: `$env:OPENROUTER_API_KEY = "sk-or-v1-xxx"`
4. Run: `npx netlify dev`
5. Go to: http://localhost:3000/create
6. Test CV generation
7. Should work! ✅

That's it! 🚀

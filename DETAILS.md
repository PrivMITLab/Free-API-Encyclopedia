# 📖 Free API Encyclopedia - Complete Details & Guide

> **325+ Free APIs ka Complete Encyclopedia** — Search, Filter, Live Demo, aur bahut kuch!

---

## 📋 Table of Contents

1. [App Kya Hai?](#app-kya-hai)
2. [Complete Features List](#complete-features-list)
3. [UI/UX Features](#uiux-features)
4. [Live Demo System](#live-demo-system)
5. [CORS Proxy System](#cors-proxy-system)
6. [Search & Filter System](#search--filter-system)
7. [API Data Structure](#api-data-structure)
8. [Khud Se API Kaise Add Karein](#khud-se-api-kaise-add-karein)
9. [Category System](#category-system)
10. [Auth Types](#auth-types)
11. [Free Tier Types](#free-tier-types)
12. [Rate Limit Format](#rate-limit-format)
13. [CORS Status Types](#cors-status-types)
14. [Troubleshooting](#troubleshooting)
15. [Best Practices](#best-practices)
16. [File Structure](#file-structure)

---

## 🚀 App Kya Hai?

Ye ek **Free API Encyclopedia** web app hai jisme **325+ free APIs** ka complete data hai. Har API ki poori details di gayi hai:

- ✅ **API Name & Provider** — Kaunsi company ne banayi hai
- ✅ **Auth Requirements** — Login chahiye ya nahi
- ✅ **Daily/Monthly Limits** — Free tier mein kitna use kar sakte ho
- ✅ **CORS Status** — Browser se directly kaam karegi ya nahi
- ✅ **Use Cases** — Kiske liye useful hai
- ✅ **Why Use** — Kyun use karna chahiye
- ✅ **Pro Tips** — Best practices
- ✅ **cURL Example** — Terminal mein kaise chalayein
- ✅ **Live Demo** — Browser mein directly try karein
- ✅ **CORS Proxy** — Agar CORS block kare toh proxy se try karein

---

## 🎯 Complete Features List

### 🔍 Search & Discovery
| Feature | Description |
|---------|-------------|
| **Global Search** | API name, provider, description, use cases sab mein search |
| **Category Filter** | 7 categories: AI, Testing, Finance, Gaming, Music, DevTools, Science |
| **Auth Filter** | NONE, Key, OAuth, Login Required — filter by auth type |
| **Free Tier Filter** | Free Forever, Freemium, Trial, Paid — filter by pricing |
| **Sort Options** | Sort by ID, Name, Category |
| **Favorites** | APIs ko favorite karo, localStorage mein save hota hai |
| **Result Count** | Real-time count dikhata hai kitne APIs match kiye |

### 📊 API Card Features
| Feature | Description |
|---------|-------------|
| **Category Emoji** | Har category ka unique emoji (🤖🧪💰🎮🎵🛠️🏛️) |
| **API Number** | Sequential ID (#1, #2, etc.) |
| **Provider Badge** | Provider name with icon |
| **Auth Badge** | NONE = green, Key = yellow, OAuth = blue, Login = orange |
| **Limit Badge** | Daily/monthly limits clearly shown |
| **Free Tier Badge** | Color-coded pricing badge |
| **CORS Badge** | Yes = green, No = red, Partial = yellow |
| **Hover Effect** | Card par hover karne par shadow + scale animation |
| **Click to Open** | Card click karne par full details modal khulta hai |

### 📋 Modal Features (Full Details)
| Feature | Description |
|---------|-------------|
| **API Header** | Name, provider, category, ID — sab ek saath |
| **Auth Section** | Auth type + explanation + signup warning |
| **Limits Section** | Daily/monthly limits + rate limit details |
| **Provider Section** | Provider name + description |
| **Use Cases** | Array of use cases with bullet points |
| **Why Use** | Detailed explanation of benefits |
| **Pro Tips** | Array of tips with checkmark icons |
| **Example Request** | cURL command with Copy button |
| **Live Demo** | Real-time API call with loading/error/success states |
| **CORS Proxy** | 3 proxy options (Direct, AllOrigins, corsproxy.io) |
| **Error Handling** | CORS vs Network vs Timeout — clear error messages |
| **Copy Buttons** | cURL copy, JSON response copy |
| **Close Options** | X button, ESC key, overlay click |

### 🌐 Live Demo System
| Feature | Description |
|---------|-------------|
| **Real Fetch** | Browser se actual API call hoti hai |
| **Loading State** | Spinner + "Fetching data..." message |
| **Success State** | Green checkmark + formatted JSON response |
| **Error Detection** | CORS, Network, Timeout, HTTP errors alag-alag detect |
| **Auto-Suggest** | CORS error aaye toh proxy enable karne ka suggestion |
| **Proxy Toggle** | 3 options: Direct, AllOrigins, corsproxy.io |
| **Proxy Info** | "What is this?" button with explanation |
| **URL Display** | Full request URL dikhata hai |
| **Method Display** | GET, POST, etc. dikhata hai |
| **Response Copy** | JSON response copy kar sakte ho |
| **cURL Fallback** | Hamesha cURL option available |

### 🎨 UI/UX Features
| Feature | Description |
|---------|-------------|
| **Dark Mode** | System preference se auto-detect |
| **Responsive** | Mobile, tablet, desktop — sab pe kaam kare |
| **Smooth Animations** | Hover, transition, scale effects |
| **Color Coding** | Auth, limits, CORS — sab color-coded |
| **Empty States** | Search result na mile toh helpful message |
| **Loading States** | Data load hote time spinner |
| **Error States** | API fail ho toh graceful error message |
| **Keyboard Support** | ESC se modal close |
| **Scroll to Top** | Smooth scrolling |
| **Selection Style** | Custom text selection color |
| **Code Highlighting** | JSON response syntax highlighted |

---

## 🎨 UI/UX Features

### 🎯 Design System
- **Colors**: Purple/Indigo primary theme
- **Typography**: System fonts + Monospace for code
- **Spacing**: Consistent padding/margins
- **Borders**: Rounded corners (rounded-xl, rounded-2xl)
- **Shadows**: Layered shadows for depth
- **Transitions**: Smooth hover/focus animations

### 📱 Responsive Breakpoints
- **Mobile**: < 640px — Single column cards
- **Tablet**: 640px - 1024px — 2 column grid
- **Desktop**: > 1024px — 3-4 column grid
- **Large**: > 1280px — 4-5 column grid

### 🎭 Color Coding System
| Element | Color | Meaning |
|---------|-------|---------|
| **Auth: NONE** | 🟢 Green | No login needed |
| **Auth: Key** | 🟡 Yellow | API key required |
| **Auth: OAuth** | 🔵 Blue | OAuth authentication |
| **Auth: Login** | 🟠 Orange | Login/signup required |
| **CORS: Yes** | 🟢 Green | Browser safe |
| **CORS: No** | 🔴 Red | CORS blocked |
| **CORS: Partial** | 🟡 Yellow | Some endpoints work |
| **Free Forever** | 🟢 Green | Always free |
| **Freemium** | 🔵 Blue | Free + paid tiers |
| **Trial** | 🟠 Orange | Limited time free |
| **Paid** | 🔴 Red | Paid only |

---

## 🌐 Live Demo System

### Kaise Kaam Karta Hai
1. User modal mein **"Try Live"** button dabata hai
2. App `demoEndpoint` se full URL banata hai
3. `fetch()` se actual API call hoti hai
4. Response JSON format mein dikhta hai
5. Agar error aaye toh clear message + suggestions

### Error Types aur Solutions
| Error Type | Message | Solution |
|------------|---------|----------|
| **CORS Blocked** | 🚫 CORS policy ne block kiya | Proxy enable karo |
| **Network Error** | 🔌 Internet connection issue | Connection check karo |
| **Timeout** | ⏱️ API response nahi aaya | Baad mein try karo |
| **HTTP Error** | ❌ Server ne error diya | URL/params check karo |

### Browser-Safe APIs
Ye APIs browser se directly kaam karti hain (CORS allow karti hain):
- JSONPlaceholder, ReqRes, FakeStore, RandomUser
- Dog CEO, PokeAPI, Rick & Morty, SWAPI
- Cat Facts, Advice Slip, Ghibli API
- CoinGecko, DefiLlama, Nager.Date
- REST Countries, Open-Meteo, SpaceX
- USGS Earthquake, Met Museum, Wikipedia
- Postman Echo, IP-API, IPinfo
- Lyrics.ovh, TVmaze, TheCatAPI
- Aur bahut saari...

---

## 🔓 CORS Proxy System

### Kya Hai CORS Proxy?
CORS (Cross-Origin Resource Sharing) ek browser security feature hai. Kuch APIs browser se direct request allow nahi karti. CORS proxy ek intermediate server hai jo request ko forward karta hai aur response wapas bhejta hai.

### Available Proxies
| Proxy | URL | Speed | Reliability |
|-------|-----|-------|-------------|
| **Direct** | (No proxy) | ⚡ Fastest | ✅ Best |
| **AllOrigins** | api.allorigins.win | 🟡 Medium | ✅ Good |
| **corsproxy.io** | corsproxy.io | 🟡 Medium | ✅ Good |

### Kaise Use Karein
1. Modal mein **"Try Live"** dabao
2. Agar CORS error aaye → **"Use AllOrigins"** button dabao
3. Proxy se request retry hogi
4. Agar phir bhi fail ho → **"Try corsproxy.io"** dabao
5. Last option → cURL copy karo aur terminal mein chalao

### ⚠️ Important Notes
- Proxy sirf **testing** ke liye hai
- Production mein proxy use **nahi** karna chahiye
- Proxy server down ho sakta hai
- Sensitive data proxy se **nahi** bhejna chahiye
- Rate limits proxy ke through bhi apply hote hain

---

## 🔍 Search & Filter System

### Search
- **Kya search karein**: API name, provider, description, use cases
- **Case insensitive**: "github" = "GitHub" = "GITHUB"
- **Partial match**: "api" = "GitHub API", "NASA API", etc.
- **Real-time**: Type karte hi results update hote hain

### Category Filter
| Emoji | Category | APIs |
|-------|----------|------|
| 🤖 | AI & Agentic | Gemini, Groq, OpenAI, etc. |
| 🧪 | Testing & Placeholder | JSONPlaceholder, ReqRes, etc. |
| 💰 | Finance, Crypto & Web3 | CoinGecko, Coinbase, etc. |
| 🎮 | Gaming & Esports | Chess.com, RAWG, etc. |
| 🎵 | Music & Multimedia | Spotify, YouTube, etc. |
| 🛠️ | DevTools & Infrastructure | GitHub, IP-API, etc. |
| 🏛️ | Gov, Science & World | NASA, SpaceX, etc. |

### Auth Filter
| Filter | Meaning |
|--------|---------|
| **All** | Sab APIs dikhao |
| **NONE** | Bina login/key ke use karo |
| **Key** | API key chahiye |
| **OAuth** | OAuth authentication chahiye |
| **Login Required** | Account banana padega |

### Sort Options
| Option | Description |
|--------|-------------|
| **ID (Default)** | Sequential number se sort |
| **Name (A-Z)** | Alphabetical order |
| **Category** | Category ke hisaab se group |

---

## 📦 API Data Structure

Har API entry mein ye fields hain:

```typescript
interface APIEntry {
  id: number;              // Unique ID (1, 2, 3, ...)
  name: string;            // API ka naam
  provider: string;        // Provider company
  category: string;        // Category name
  auth: string;            // Auth type (NONE, Key, OAuth, LOGIN_REQUIRED)
  limits: string;          // Rate limit description
  description: string;     // Short description
  website?: string;        // Official website URL
  docs?: string;           // Documentation URL
  baseUrl: string;         // Base API URL
  demoEndpoint?: string;   // Demo endpoint path
  demoMethod?: string;     // HTTP method (GET, POST, etc.)
  demoParams?: string;     // Query parameters
  freeTier: string;        // Free tier type
  requiresSignup: boolean; // Signup required ya nahi
  cors: string;            // CORS status (Yes, No, Partial)
  rateLimitDetails: string;// Detailed rate limit info
  useCases: string[];      // Use cases array
  whyUse: string;          // Why use this API
  tips: string[];          // Pro tips array
  exampleRequest: string;  // cURL example
  browserSafe?: boolean;   // Browser mein safely kaam karegi
}
```

---

## 🛠️ Khud Se API Kaise Add Karein

### Step 1: File Open Karo
```
src/apiData.ts file kholo
```

### Step 2: Last Entry Ke Baad Naya API Add Karo
File ke end mein `API_DATA` array ke andar naya object add karo:

```typescript
{
  id: 401,                    // Next available number
  name: "My New API",         // API ka naam
  provider: "My Company",     // Provider company
  category: "AI & Agentic",   // Category choose karo
  auth: "Key",                // NONE, Key, OAuth, LOGIN_REQUIRED
  limits: "1,000 req / day",  // Rate limit
  description: "Short description of what this API does.",
  website: "https://example.com",
  docs: "https://example.com/docs",
  baseUrl: "https://api.example.com",
  demoEndpoint: "/v1/data",   // Endpoint path
  demoMethod: "GET",          // GET, POST, PUT, DELETE
  demoParams: "limit=3",      // Query params (optional)
  freeTier: "Free Forever",   // Free Forever, Freemium, Trial, Paid
  requiresSignup: true,       // true ya false
  cors: "Yes",                // Yes, No, Partial
  rateLimitDetails: "1,000 requests per day, 100 per hour.",
  useCases: [
    "Use case 1",
    "Use case 2",
    "Use case 3"
  ],
  whyUse: "Detailed explanation of why this API is useful.",
  tips: [
    "Tip 1: Always cache responses.",
    "Tip 2: Use pagination for large datasets.",
    "Tip 3: Handle errors gracefully."
  ],
  exampleRequest: 'curl -X GET "https://api.example.com/v1/data?limit=3" -H "Authorization: Bearer YOUR_KEY"',
  browserSafe: true           // true = browser mein kaam karegi
}
```

### Step 3: Category Choose Karo
Sirf ye 7 categories use karo:
- `"AI & Agentic"`
- `"Testing & Placeholder"`
- `"Finance, Crypto & Web3"`
- `"Gaming & Esports"`
- `"Music & Multimedia"`
- `"DevTools & Infrastructure"`
- `"Gov, Science & World"`

### Step 4: Auth Type Choose Karo
| Auth Type | Kab Use Karein |
|-----------|----------------|
| `"NONE"` | Bina kisi login/key ke kaam kare |
| `"Key"` | API key chahiye (header ya query param) |
| `"OAuth"` | OAuth 2.0 authentication chahiye |
| `"LOGIN_REQUIRED"` | Account banana padega |

### Step 5: Free Tier Choose Karo
| Free Tier | Meaning |
|-----------|---------|
| `"Free Forever"` | Hamesha free rahega |
| `"Freemium"` | Free tier + paid upgrade |
| `"Trial"` | Limited time free (e.g., 30 days) |
| `"Paid"` | Sirf paid plan |

### Step 6: CORS Status Set Karo
| CORS Status | Meaning |
|-------------|---------|
| `"Yes"` | Browser se directly kaam karegi |
| `"No"` | CORS block karega (proxy chahiye) |
| `"Partial"` | Kuch endpoints kaam karte hain |

### Step 7: browserSafe Flag Set Karo
| Value | Meaning |
|-------|---------|
| `true` | Browser mein directly kaam karegi |
| `false` | CORS proxy chahiye |
| `undefined` | Unknown — app try karega |

### Step 8: Demo Endpoint Set Karo
```typescript
// Example: JSONPlaceholder
baseUrl: "https://jsonplaceholder.typicode.com",
demoEndpoint: "/posts",
demoMethod: "GET",
demoParams: "_limit=3"
// Result: https://jsonplaceholder.typicode.com/posts?_limit=3

// Example: REST Countries
baseUrl: "https://restcountries.com",
demoEndpoint: "/v3.1/name/india",
demoMethod: "GET",
// Result: https://restcountries.com/v3.1/name/india

// Example: No demo (key required)
baseUrl: "https://api.openai.com",
// demoEndpoint mat do — app automatically "Try cURL" dikhayega
```

### Step 9: Save & Test
```bash
# Save file
# App automatically reload hoga (hot reload)
# Modal mein jaake "Try Live" test karo
```

### ✅ Complete Example
```typescript
{
  id: 401,
  name: "NASA APOD",
  provider: "NASA",
  category: "Gov, Science & World",
  auth: "Key",
  limits: "1,000 req / day",
  description: "Daily Astronomy Picture of the Day with explanation.",
  website: "https://api.nasa.gov",
  docs: "https://api.nasa.gov/#apod",
  baseUrl: "https://api.nasa.gov",
  demoEndpoint: "/planetary/apod",
  demoMethod: "GET",
  demoParams: "api_key=DEMO_KEY&count=3",
  freeTier: "Free Forever",
  requiresSignup: false,
  cors: "Yes",
  rateLimitDetails: "1,000 requests per day with DEMO_KEY.",
  useCases: [
    "Daily space photography",
    "Educational content",
    "Science apps"
  ],
  whyUse: "NASA ka official API jo daily space photos deta hai. DEMO_KEY se bina signup ke kaam karta hai.",
  tips: [
    "DEMO_KEY use karo testing ke liye (rate limited)",
    "Apna API key generate karo higher limits ke liye",
    "count parameter se multiple photos fetch karo"
  ],
  exampleRequest: 'curl -X GET "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&count=3"',
  browserSafe: true
}
```

---

## 📂 Category System

### 1. 🤖 AI & Agentic
AI models, ML services, NLP, computer vision, speech-to-text, translation, chatbots, etc.

### 2. 🧪 Testing & Placeholder
Mock data, fake APIs, testing endpoints, placeholder images, random data generators.

### 3. 💰 Finance, Crypto & Web3
Stock market, crypto prices, blockchain, currency exchange, banking, payments.

### 4. 🎮 Gaming & Esports
Game databases, player stats, esports, game mods, speedruns, game prices.

### 5. 🎵 Music & Multimedia
Music APIs, movie/TV databases, stock photos, GIFs, videos, lyrics.

### 6. 🛠️ DevTools & Infrastructure
GitHub, IP tools, email services, databases, hosting, monitoring, CI/CD.

### 7. 🏛️ Gov, Science & World
Government data, science APIs, weather, news, social media, education.

---

## 🔐 Auth Types

### NONE
- Koi login/key nahi chahiye
- Directly use kar sakte ho
- Example: JSONPlaceholder, REST Countries, PokeAPI

### Key
- API key chahiye (header ya query parameter)
- Provider se key generate karni padti hai
- Example: OpenAI, NASA, OpenWeather

### OAuth
- OAuth 2.0 authentication
- User authorization flow
- Example: Spotify, Google, Twitter

### LOGIN_REQUIRED
- Account banana padega
- Dashboard se API key manage karni padti hai
- Example: GitHub, Firebase, Supabase

---

## 💰 Free Tier Types

### Free Forever
- Hamesha free rahega
- Koi time limit nahi
- Example: JSONPlaceholder, REST Countries

### Freemium
- Free tier available hai
- Paid upgrade for more features
- Example: OpenAI, Spotify, GitHub

### Trial
- Limited time free (e.g., 30 days)
- Uske baad paid plan chahiye
- Example: Some AI APIs

### Paid
- Sirf paid plans available
- Free trial ho sakta hai
- Example: Some enterprise APIs

---

## ⏱️ Rate Limit Format

Rate limits ko ye format mein likho:

```
"15 RPM / 1M tokens"     // Requests per minute + token limit
"1,000 req / mo"         // Requests per month
"100 req / min"          // Requests per minute
"5 req / sec"            // Requests per second
"❌ No Limit"            // No rate limit
"Varies"                 // Provider ke hisaab se
"High"                   // High rate limit
```

---

## 🔒 CORS Status Types

### Yes
- Browser se directly kaam karegi
- `browserSafe: true` set karo
- Example: JSONPlaceholder, REST Countries

### No
- CORS block karega
- Proxy chahiye ya cURL use karo
- `browserSafe: false` set karo
- Example: OpenAI, GitHub (some endpoints)

### Partial
- Kuch endpoints kaam karte hain
- Kuch CORS block karte hain
- `browserSafe: false` set karo (safe side)
- Example: Spotify, YouTube

---

## 🐛 Troubleshooting

### Problem: API add kiya par modal mein nahi dikh raha
**Solution**: `id` unique hona chahiye. Duplicate ID check karo.

### Problem: Live demo mein CORS error aa raha hai
**Solution**: 
1. `cors: "No"` set karo
2. `browserSafe: false` set karo
3. Modal mein proxy enable karo
4. Ya cURL copy karo

### Problem: HTTP-only API proxy se kaam nahi kar rahi (jaise IP-API)
**Solution**: 
⚠️ **CORS proxies sirf HTTPS URLs support karte hain!**

Agar API `http://` use karta hai (HTTPS nahi):
1. Yellow warning box dikhega: "HTTP-only API detected"
2. AllOrigins aur corsproxy.io buttons disabled ho jayenge
3. Sirf **Direct** request try kar sakte ho
4. Best solution: **cURL copy karke terminal mein run karo**
5. Production mein: Apne backend server se call karo (backend HTTP handle kar sakta hai)

**Example**: 
- IP-API free tier → `http://ip-api.com` (proxy nahi chalega ❌)
- IP-API paid tier → `https://pro.ip-api.com` (proxy chalega ✅)
- CoinGecko → `https://api.coingecko.com` (proxy chalega ✅)

### Problem: Search mein API nahi mil raha
**Solution**: `name`, `provider`, `description`, `useCases` sab mein search hota hai. Spelling check karo.

### Problem: Category filter kaam nahi kar raha
**Solution**: Category name exactly match hona chahiye. Spacing/capitalization check karo.

### Problem: Build fail ho raha hai
**Solution**: 
1. TypeScript errors check karo
2. Missing commas check karo
3. String quotes check karo
4. `npm run build` run karo

### Problem: Favorites save nahi ho rahe
**Solution**: Browser localStorage use hota hai. Incognito mode mein test mat karo.

---

## ✅ Best Practices

### API Add Karte Time
1. **Unique ID**: Har API ka ID unique hona chahiye
2. **Correct Category**: Sirf 7 allowed categories use karo
3. **Valid URLs**: Website aur docs URLs valid hone chahiye
4. **Test Demo**: Live demo test karo before adding
5. **Set browserSafe**: Agar browser mein kaam kare toh `true` set karo
6. **Clear Description**: Short aur clear description likho
7. **Useful Tips**: Practical tips likho jo developers ko help karein

### cURL Example
```bash
# GET request
curl -X GET "https://api.example.com/v1/data?limit=3"

# With API key in header
curl -X GET "https://api.example.com/v1/data" -H "Authorization: Bearer YOUR_KEY"

# With API key in query param
curl -X GET "https://api.example.com/v1/data?api_key=YOUR_KEY"

# POST request
curl -X POST "https://api.example.com/v1/data" -H "Content-Type: application/json" -d '{"key":"value"}'
```

### Rate Limit Tips
- Hamesha caching implement karo
- Exponential backoff use karo
- Error handling zaroori hai
- Rate limit headers check karo

---

## 📁 File Structure

```
free-api-encyclopedia/
├── public/
│   └── favicon.svg          # App favicon
├── src/
│   ├── main.tsx             # Entry point
│   ├── App.tsx              # Main app component
│   ├── apiData.ts           # All API data (325+ APIs)
│   └── index.css            # Global styles
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── tailwind.config.js       # Tailwind CSS config
├── postcss.config.js        # PostCSS config
├── README.md                # Project overview
├── GUIDE.md                 # Usage guide
├── CUSTOMIZE.md             # Customization guide
└── DETAILS.md               # This file - Complete details
```

---

## 📊 Quick Reference

### Add API Checklist
- [ ] Unique `id` set kiya
- [ ] Correct `category` choose kiya
- [ ] `auth` type set kiya (NONE/Key/OAuth/LOGIN_REQUIRED)
- [ ] `limits` description likhi
- [ ] `freeTier` set kiya
- [ ] `requiresSignup` boolean set kiya
- [ ] `cors` status set kiya
- [ ] `browserSafe` flag set kiya
- [ ] `baseUrl` valid URL hai
- [ ] `demoEndpoint` set kiya (agar applicable)
- [ ] `useCases` array likhi
- [ ] `whyUse` explanation likhi
- [ ] `tips` array likhi
- [ ] `exampleRequest` cURL likha
- [ ] Live demo test kiya

### Category Quick Reference
| Emoji | Category | Count |
|-------|----------|-------|
| 🤖 | AI & Agentic | 50+ |
| 🧪 | Testing & Placeholder | 40+ |
| 💰 | Finance, Crypto & Web3 | 40+ |
| 🎮 | Gaming & Esports | 30+ |
| 🎵 | Music & Multimedia | 20+ |
| 🛠️ | DevTools & Infrastructure | 50+ |
| 🏛️ | Gov, Science & World | 50+ |

---

## 🎓 Learning Path

### Beginner
1. App explore karo
2. Search aur filter try karo
3. Ek API ka modal kholo
4. Live demo try karo
5. cURL copy karo aur terminal mein chalao

### Intermediate
1. Apna favorite API dhundho
2. CORS proxy try karo
3. Multiple APIs compare karo
4. Rate limits samjho
5. Auth types samjho

### Advanced
1. Naya API add karo
2. Custom category banao
3. Proxy customize karo
4. App fork karo aur modify karo
5. Apne project mein integrate karo

---

> **Created with ❤️ for developers** | **325+ Free APIs** | **2026 Edition**

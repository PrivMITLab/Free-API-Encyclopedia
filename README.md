# 🚀 Free API Encyclopedia (2026 Edition)

**A polished developer directory of 200+ documented APIs with auth details, rate limits, cURL examples, favorites, and safer browser live demos.**

A beautiful, searchable web app showcasing free APIs with real-time live demos, complete metadata, and copy-paste code examples. Built with React, Vite, and Tailwind CSS.

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwindcss)

## ✨ Features

### 📚 Complete API Database
- **200+ documented APIs** currently included in the app data file
- Structured so it can still be extended far beyond the current set
- All 7 categories: AI & Agents, Testing, Finance, Gaming, Music, DevTools, Science
- Every entry includes:
  - ✅ **Daily/Monthly limits** (e.g., "15 RPM / 1M tokens", "1,000 req / mo", "❌ No Limit")
  - ✅ **Auth requirements** (None, API Key, OAuth) with clear badges
  - ✅ **Free tier details** (Free Forever, Freemium, Free Trial)
  - ✅ **Signup requirement** warning
  - ✅ **Provider information**
  - ✅ **CORS support** status
  - ✅ **Rate limit breakdown** (per minute, hour, day, month)
  - ✅ **Use cases** and target audience
  - ✅ **Why use this API** explanation
  - ✅ **Pro tips** for best practices
  - ✅ **Copy-paste cURL** examples
  - ✅ **Base URL** and documentation links

### 🔴 Real-Time Live Demos
- Click any API → **"Try live"** button
- **Actual fetch() calls** to real APIs (no mocks)
- **🆕 CORS Proxy Toggle** — switch between:
  - **Direct**: Fetches API directly (works if CORS enabled)
  - **AllOrigins**: Routes through api.allorigins.win proxy
  - **corsproxy.io**: Alternative CORS proxy option
- **🆕 Smart Error Detection**:
  - Detects CORS vs Network vs Timeout errors
  - Automatically suggests enabling proxy when CORS blocks
  - Shows helpful action buttons to try different proxies
- Shows:
  - Request URL (with proxy indicator if enabled)
  - Live JSON response (pretty-printed)
  - Loading states with proxy info
  - Success indicator showing how request was made
  - Copy response button
- For protected APIs, explains auth requirements and points to docs/cURL
- **Always shows cURL copy option** for terminal/Postman usage

### 🎨 Beautiful UI
- **Card grid** with category emojis (🤖 AI, 🧪 Testing, 💰 Finance, 🎮 Gaming, 🎵 Music, 🛠️ DevTools, 🏛️ Science)
- **Detailed modal** for each API with tabs for:
  - Authentication details
  - Rate limits
  - Use cases
  - Why use
  - Pro tips
  - Code example
  - Live demo
- **Search** by name, provider, description, use cases
- **Filter** by category and auth type
- **Sort** by ID, name, or category
- **Favorites** with localStorage persistence
- **Dark mode** support (follows system preference)
- **Responsive** design (mobile, tablet, desktop)
- **Copy buttons** for cURL and JSON
- **Smooth animations** and hover effects

### 🛡️ Production Ready
- TypeScript strict mode
- AbortController with 15s timeout
- **CORS Proxy system** with multiple fallback options
- Graceful degradation for CORS-blocked or protected APIs
- Local storage for preferences and favorites
- Better modal accessibility (ESC close, focus target, overlay close)
- Clipboard fallback support
- Static favicon included for Vercel/static hosting
- No external dependencies except React

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone or download the project
cd your-project-folder

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
├── src/
│   ├── App.tsx          # Main application component
│   ├── apiData.ts       # 📊 API encyclopedia data source (200+ documented entries)
│   ├── main.tsx         # React entry point
│   ├── index.css        # Tailwind styles
│   └── utils/
│       └── cn.ts        # Class name utility
├── public/
│   └── favicon.svg      # Static favicon for Vercel/static deployments
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript config
├── README.md            # This file
├── CUSTOMIZE.md         # Customization guide
└── GUIDE.md             # Usage guide
```

## 📊 Adding More APIs

All API data lives in `src/apiData.ts`. To add more APIs (up to 325+ from the spec):

1. Open `src/apiData.ts`
2. Find the `API_DATA` array
3. Add new entries following this structure:

```typescript
{
  id: 75,
  name: "Your API Name",
  provider: "Company Name",
  category: "Finance", // AI, Testing, Finance, Gaming, Music, DevTools, Science
  auth: "NONE", // NONE, Key, OAuth
  limits: "❌ No Limit", // e.g., "1,000 req / mo", "15 RPM"
  description: "Short description",
  website: "https://example.com",
  docs: "https://docs.example.com",
  baseUrl: "https://api.example.com/v1",
  demoEndpoint: "/endpoint",
  demoMethod: "GET",
  demoParams: { limit: "5" },
  tags: ["tag1", "tag2"],
  freeTier: "Free Forever", // Free Forever, Freemium, Free Trial, Self-hosted
  requiresSignup: false,
  cors: true,
  rateLimitDetails: {
    perMinute: "60", // or undefined
    perHour: undefined,
    perDay: undefined,
    perMonth: undefined
  },
  useCases: ["Use case 1", "Use case 2"],
  whyUse: "Detailed explanation of why this API is useful",
  tips: [
    "Pro tip 1",
    "Pro tip 2"
  ],
  exampleRequest: `curl -X GET "https://api.example.com/v1/endpoint?limit=5" \\
  -H "Accept: application/json"`
}
```

### Field Guide

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | number | ✅ | Unique ID (1-325+) |
| `name` | string | ✅ | API name |
| `provider` | string | ✅ | Company/organization |
| `category` | enum | ✅ | One of 7 categories |
| `auth` | enum | ✅ | NONE, Key, or OAuth |
| `limits` | string | ✅ | Human-readable limit (shown on card) |
| `description` | string | ✅ | 1-2 sentence description |
| `website` | string | ✅ | Official website |
| `docs` | string | ✅ | Documentation URL |
| `baseUrl` | string | ✅ | API base URL |
| `demoEndpoint` | string | ✅ | Endpoint for live demo |
| `demoMethod` | enum | ✅ | GET or POST |
| `demoParams` | object | ⚪ | Query params for demo |
| `freeTier` | enum | ✅ | Free Forever, Freemium, Free Trial, Self-hosted |
| `requiresSignup` | boolean | ✅ | Does it need account? |
| `cors` | boolean | ✅ | CORS enabled? |
| `rateLimitDetails` | object | ✅ | Detailed limits |
| `useCases` | string[] | ✅ | 3-6 use cases |
| `whyUse` | string | ✅ | 2-3 sentence explanation |
| `tips` | string[] | ✅ | 2-4 pro tips |
| `exampleRequest` | string | ✅ | cURL example |

### Categories

Use exactly these category names:
- `"AI"` - AI & Agentic APIs
- `"Testing"` - Testing & Placeholder
- `"Finance"` - Finance, Crypto & Web3
- `"Gaming"` - Gaming & Esports
- `"Music"` - Music & Multimedia
- `"DevTools"` - DevTools & Infrastructure
- `"Science"` - Gov, Science & World

## 🎯 Usage Examples

### Searching
- Type in search box: "weather", "crypto", "github"
- Searches name, provider, description, tags, and use cases

### Filtering
- Click category buttons to filter by type
- Click auth buttons to show only "No Auth" or "API Key" APIs
- Combine filters

### Favorites
- Click ♡ on any card to favorite it
- Favorites are saved in localStorage
- Use the **Favorites** toggle in the toolbar to view only saved items

### Live Demo
1. Click any API card
2. Scroll to "Live Demo" section
3. Click "Try live" button
4. See real JSON response from the API
5. Copy response with "Copy response" button

## 🔧 Customization

See **[CUSTOMIZE.md](./CUSTOMIZE.md)** for detailed instructions on:
- Changing colors and theme
- Adding your own API categories
- Customizing card layout
- Modifying the modal
- Changing fonts
- Adding analytics
- Deployment options

## 📖 User Guide

See **[GUIDE.md](./GUIDE.md)** for:
- How to use the app
- Understanding API metadata
- Reading rate limits
- When to use each API
- Best practices
- Troubleshooting
- Contributing new APIs

## 🛠️ Tech Stack

- **React 19** - UI library
- **TypeScript 5.9** - Type safety
- **Vite 7** - Build tool & dev server
- **Tailwind CSS 4** - Styling
- **clsx + tailwind-merge** - Class composition

No other dependencies! Lightweight and fast.

## 📦 Build & Deploy

### Build

```bash
npm run build
```

Output in `dist/` folder - single HTML file (thanks to vite-plugin-singlefile).

### Deploy Options

**Vercel** (recommended)
```bash
npm i -g vercel
vercel
```

**Netlify**
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

**GitHub Pages**
```bash
# Build first
npm run build

# Deploy dist folder to gh-pages branch
npx gh-pages -d dist
```

**Any static host** - Upload `dist/` folder

## 🤝 Contributing

Want to add more APIs or improve the app?

1. Fork the repository
2. Add APIs to `src/apiData.ts` following the structure above
3. Test locally: `npm run dev`
4. Build to verify: `npm run build`
5. Submit a pull request

### Adding the remaining 285+ APIs

The app currently has 40+ APIs as examples. The spec includes 325+ APIs. To add them all:

1. Create a spreadsheet with all fields
2. Fill in data from the original list
3. Generate JSON/typeScript array
4. Add to `API_DATA` in `src/apiData.ts`
5. Test a sample of live demos

**Tip**: For APIs that require keys, set `demoEndpoint` to a public endpoint or omit live demo.

## 🐛 Troubleshooting

### Live demo not working?

**CORS error**: Many APIs block browser requests. This is normal. The app shows a helpful note.

**Network error**: Check your internet connection.

**Timeout**: API took longer than 10 seconds. Try again.

### Build errors?

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Type errors?

```bash
# Check TypeScript
npx tsc --noEmit
```

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🙏 Acknowledgments

- API list curated for the "Definitive 325+ Free API Encyclopedia (2026 Edition)"
- Built with ❤️ for developers who need quick access to free APIs
- Inspired by the need for better API discovery

## 📞 Support

Found a bug? API not working? Want to add your API?

- Open an issue on GitHub
- Check API documentation for latest limits
- Verify CORS status with your browser devtools

## 🗺️ Roadmap

- [ ] Add all 325+ APIs from the spec
- [ ] API health monitoring
- [ ] User ratings and reviews
- [ ] Code snippet generator (JS, Python, cURL)
- [ ] Export favorites as JSON
- [ ] Dark/light theme toggle
- [ ] More categories
- [ ] API comparison tool

---

**Made with ⚡ by developers, for developers**

*Research Date: March 2026 | Last Updated: 2026-03-29*

---

### Quick Links

- 📖 [Usage Guide](./GUIDE.md)
- 🎨 [Customization Guide](./CUSTOMIZE.md)
- 🐛 [Report Bug](../../issues)
- 💡 [Request Feature](../../issues)
- ⭐ [Star on GitHub](../../stargazers)

---

**Pro Tip**: Bookmark this app! Use it whenever you need mock data, testing endpoints, or want to prototype without setting up a backend.

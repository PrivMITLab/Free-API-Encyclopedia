# 🎨 Customization Guide

Complete guide to customize the Free API Encyclopedia app to match your brand, needs, and style preferences.

## 🎯 Quick Customizations

### Change App Title & Meta

Edit `index.html`:

```html
<title>Your Custom Title - Free API Directory</title>
<meta name="description" content="Your custom description here" />
```

Edit `src/App.tsx` (line ~650):

```typescript
<h1 className="text-2xl font-bold tracking-tight">
  Your Brand Name
  <span className="ml-2 text-xs font-normal text-zinc-500">v2026.1</span>
</h1>
```

### Change Colors

The app uses Tailwind CSS. Main color definitions are in `src/App.tsx`.

#### Primary Gradient (used in header badges and buttons)

Find this class (around line 370):
```typescript
"bg-gradient-to-br from-violet-500 to-fuchsia-500"
```

Change to your brand colors:
```typescript
// Blue theme
"bg-gradient-to-br from-blue-500 to-cyan-500"

// Green theme
"bg-gradient-to-br from-emerald-500 to-teal-500"

// Orange theme
"bg-gradient-to-br from-orange-500 to-rose-500"

// Custom hex (use arbitrary values)
"bg-gradient-to-br from-[#FF6B6B] to-[#4ECDC4]"
```

#### Background Colors

Main app background (line ~645):
```typescript
// Current: light gray / dark zinc
"bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100"

// Pure white / black
"bg-white text-black dark:bg-black dark:text-white"

// Warm theme
"bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100"
```

#### Card Colors

API cards (line ~580):
```typescript
"bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"

// Glass morphism
"bg-white/80 backdrop-blur dark:bg-zinc-900/80 border-zinc-200/50"

// Subtle
"bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800"
```

### Change Fonts

Add to `index.html` in `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

Then in `src/index.css` or via Tailwind config:

```css
body {
  font-family: 'Inter', system-ui, sans-serif;
}

code, pre {
  font-family: 'JetBrains Mono', monospace;
}
```

Or use Tailwind classes:
```typescript
// In App.tsx
<div className="font-['Inter'] ...">
```

## 🏗️ Structural Customizations

### Add New Category

1. **Update type in `src/apiData.ts`**:

```typescript
export type ApiEntry = {
  // ... existing fields
  category: "AI" | "Testing" | "Finance" | "Gaming" | "Music" | "DevTools" | "Science" | "YourNewCategory";
  // ...
}
```

2. **Add category metadata in `src/App.tsx`** (around line 90):

```typescript
const categoryMeta: Record<ApiEntry["category"], { label: string; emoji: string; color: string }> = {
  // ... existing categories
  YourNewCategory: { label: "Your Category", emoji: "🎯", color: "from-pink-500 to-rose-500" },
}
```

3. **Add APIs with new category** in `src/apiData.ts`:

```typescript
{
  id: 400,
  name: "New API",
  category: "YourNewCategory",
  // ... rest of fields
}
```

### Change Card Layout

Current card is defined around line ~560 in `src/App.tsx`.

#### Make cards more compact:

```typescript
// Reduce padding
"p-4" instead of "p-5"

// Smaller text
"text-sm" instead of "text-[13px]"

// Hide description
// Remove or comment out the description paragraph
```

#### Make cards larger:

```typescript
// Increase padding
"p-6" instead of "p-5"

// Larger title
"text-lg" instead of "text-[15px]"

// Add more details
// Add provider, tags, etc. in the card footer
```

#### Change grid columns:

Find the grid (line ~565):
```typescript
"grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"

// 2 columns max
"grid gap-4 sm:grid-cols-2"

// 5 columns on xl
"grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"

// Masonry-like (different heights)
"columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
```

### Customize Modal

Modal starts around line ~670 in `src/App.tsx`.

#### Change modal size:

```typescript
// Current: max-w-3xl
// Smaller
"max-w-2xl"
// Larger
"max-w-5xl"
// Full screen on mobile
"max-w-[95vw] md:max-w-3xl"
```

#### Reorder sections:

The modal sections are in this order:
1. Header (name, provider, badges)
2. Description
3. Link buttons (Visit, Docs)
4. Auth section
5. Limits section
6. Use Cases
7. Why Use
8. Pro Tips
9. Example request
10. Live Demo

To reorder, cut and paste the entire `<section>` blocks.

#### Hide sections:

Comment out or remove sections you don't want:
```typescript
{/* 
<section>
  <h3>Pro Tips</h3>
  ...
</section>
*/}
```

### Add Your Own Branding

#### Logo in header:

Replace the emoji logo (line ~653):
```typescript
// Current
<span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-md shadow-violet-500/20">
  🚀
</span>

// With image
<img src="/logo.png" alt="Logo" className="h-9 w-9 rounded-2xl shadow-md" />

// With custom SVG
<span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-black text-white">
  <YourLogoComponent />
</span>
```

#### Footer branding:

Add footer before closing `</div>` of main app:
```typescript
<footer className="border-t border-zinc-200 dark:border-zinc-800 mt-16 py-8 text-center text-sm text-zinc-500">
  <p>© 2026 Your Company. Built with ❤️</p>
  <p className="mt-1">
    <a href="#" className="hover:text-violet-600">Privacy</a>
    {" · "}
    <a href="#" className="hover:text-violet-600">Terms</a>
  </p>
</footer>
```

## 🎛️ Functional Customizations

### Change Default Filters

Set default category (line ~140):
```typescript
const [category, setCategory] = useState<ApiEntry["category"] | "All">("AI") // Default to AI
```

Set default auth filter (line ~141):
```typescript
const [authFilter, setAuthFilter] = useState<"All" | ApiEntry["auth"]>("NONE") // Default to no auth
```

Set default sort (line ~142):
```typescript
const [sortBy, setSortBy] = useState<"id" | "name" | "category">("name") // Default sort by name
```

### Add More Sort Options

1. Add sort option to type:
```typescript
const [sortBy, setSortBy] = useState<"id" | "name" | "category" | "provider">("id")
```

2. Add UI button (around line ~530):
```typescript
<button onClick={() => setSortBy("provider")} className={...}>
  Provider {sortBy === "provider" && "✓"}
</button>
```

3. Add sort logic (around line ~170):
```typescript
if (sortBy === "name") list.sort((a, b) => a.name.localeCompare(b.name))
if (sortBy === "category") list.sort((a, b) => a.category.localeCompare(b.category))
if (sortBy === "provider") list.sort((a, b) => a.provider.localeCompare(b.provider))
```

### Change Items Per Page

Currently shows all items. To add pagination:

1. Add state:
```typescript
const [page, setPage] = useState(1)
const itemsPerPage = 12
```

2. Slice the filtered list:
```typescript
const paginated = useMemo(() => {
  const start = (page - 1) * itemsPerPage
  return filtered.slice(start, start + itemsPerPage)
}, [filtered, page])
```

3. Use `paginated` instead of `filtered` in the grid
4. Add pagination controls below the grid

### Add Export Feature

Add button to export favorites (around line ~510):

```typescript
<button
  onClick={() => {
    const favs = filtered.filter(a => favs.has(a.id))
    const data = JSON.stringify(favs, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "favorite-apis.json"
    a.click()
  }}
  className="rounded-xl border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-sm"
>
  Export Favorites
</button>
```

## 🎨 Advanced Styling

### Custom Tailwind Config

Create `tailwind.config.js` in project root:

```javascript
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          900: '#0c4a6e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
      }
    }
  }
}
```

Then use: `bg-brand-500`, `font-sans`, `animate-fade-in`

### Dark Mode Toggle

Add manual dark mode toggle:

1. State:
```typescript
const [isDark, setIsDark] = useState(true)
```

2. Apply class:
```typescript
<div className={cn("min-h-screen", isDark && "dark")}>
```

3. Toggle button:
```typescript
<button onClick={() => setIsDark(!isDark)}>
  {isDark ? "☀️" : "🌙"}
</button>
```

4. Update Tailwind config to use class strategy:
```javascript
// tailwind.config.js
export default {
  darkMode: 'class',
  // ...
}
```

### Add Animations

Using Tailwind's built-in animations:

```typescript
// Fade in cards
"animate-in fade-in duration-300"

// Slide in modal
"animate-in slide-in-from-bottom-4 duration-300"

// Pulse for loading
"animate-pulse"

// Spin for spinner (already used)
// "animate-spin"
```

Custom keyframes in `src/index.css`:

```css
@keyframes slide-up {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
```

## 🔌 Adding Features

### Search by Tags

Add tag search (modify search logic around line ~160):

```typescript
if (q) {
  const needle = q.toLowerCase()
  list = list.filter(a =>
    a.name.toLowerCase().includes(needle) ||
    a.provider.toLowerCase().includes(needle) ||
    a.description.toLowerCase().includes(needle) ||
    a.tags.some(t => t.toLowerCase().includes(needle)) || // Add tag search
    a.useCases.some(u => u.toLowerCase().includes(needle))
  )
}
```

Show tags on cards:

```typescript
<div className="flex flex-wrap gap-1 mt-2">
  {api.tags.slice(0, 3).map(tag => (
    <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800">
      #{tag}
    </span>
  ))}
</div>
```

### Add API Status Indicator

Add status field to `ApiEntry` type:

```typescript
status: "operational" | "degraded" | "down"
```

Display in card:

```typescript
<span className={cn(
  "h-2 w-2 rounded-full",
  api.status === "operational" && "bg-emerald-500",
  api.status === "degraded" && "bg-amber-500",
  api.status === "down" && "bg-red-500"
)} />
```

### Copy as Code Snippets

Add tabs for different languages in the modal:

```typescript
const [codeLang, setCodeLang] = useState<"curl" | "js" | "python">("curl")

// In modal
<div className="flex gap-2 mb-2">
  {(["curl", "js", "python"] as const).map(lang => (
    <button onClick={() => setCodeLang(lang)}>{lang}</button>
  ))}
</div>

<pre>
  {codeLang === "curl" && api.exampleRequest}
  {codeLang === "js" && `fetch('${api.baseUrl}${api.demoEndpoint}')...`}
  {codeLang === "python" && `requests.get('${api.baseUrl}${api.demoEndpoint}')`}
</pre>
```

## 🚀 Performance Customizations

### Lazy Load Modal

Currently modal is always rendered. To lazy load:

```typescript
{selected && (
  <ApiModal api={selected} ... />
)}
```

Already implemented! Modal only renders when `selected` is not null.

### Virtual Scrolling

For 325+ APIs, add virtual scrolling:

```bash
npm install @tanstack/react-virtual
```

Then wrap the grid with virtualizer.

### Image Optimization

If adding API logos:

```typescript
<img 
  src={api.logo} 
  loading="lazy"
  decoding="async"
  className="..."
  alt=""
/>
```

## 🌐 Deployment Customizations

### Custom Domain

Vercel: Add domain in project settings

### Favicon / Static Hosting Notes

The app now ships with `public/favicon.svg`, and `index.html` already includes icon tags. This fixes the common Vercel/static deploy issue where the browser requests `/favicon.ico` or shows a missing icon in tabs/social previews.

If you want your own icon:
1. Replace `public/favicon.svg`
2. Keep the existing `<link rel="icon" ...>` tags in `index.html`
3. Rebuild and redeploy

Netlify: Domain management → Add custom domain

### Analytics

Add Plausible:

```html
<!-- in index.html -->
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

Add Google Analytics:

```html
<!-- in index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXX');
</script>
```

Track API clicks in `src/App.tsx`:

```typescript
const openModal = (api: ApiEntry) => {
  setSelected(api)
  // Track
  if (window.gtag) {
    window.gtag('event', 'api_view', { api_name: api.name })
  }
}
```

## 🔌 Customize CORS Proxy Options

The app includes a built-in CORS proxy toggle. You can customize the available proxies.

### Current Proxy Options (in `src/App.tsx`)

```typescript
type ProxyOption = "none" | "allorigins" | "corsproxy" | "corssh";

// Build URL with or without proxy
const buildFetchUrl = (originalUrl: string, proxy: ProxyOption): string => {
  switch (proxy) {
    case "allorigins":
      return `https://api.allorigins.win/raw?url=${encodeURIComponent(originalUrl)}`;
    case "corsproxy":
      return `https://corsproxy.io/?${encodeURIComponent(originalUrl)}`;
    case "corssh":
      return `https://cors.sh/${originalUrl}`;
    default:
      return originalUrl;
  }
};
```

### Add Your Own Proxy

1. Add to `ProxyOption` type:
```typescript
type ProxyOption = "none" | "allorigins" | "corsproxy" | "corssh" | "myproxy";
```

2. Add case in `buildFetchUrl`:
```typescript
case "myproxy":
  return `https://my-cors-proxy.com/?url=${encodeURIComponent(originalUrl)}`;
```

3. Add button in the proxy toggle UI (search for "CORS Proxy:"):
```typescript
<button
  onClick={() => setUseProxy("myproxy")}
  className={classNames(
    "rounded-lg px-3 py-1.5 text-xs font-medium transition",
    useProxy === "myproxy"
      ? "bg-orange-600 text-white"
      : "bg-white text-slate-600 ..."
  )}
  type="button"
>
  My Proxy
</button>
```

### Self-Hosted Proxy Options

For production apps, consider self-hosting a CORS proxy:

1. **cors-anywhere** (Node.js):
```bash
git clone https://github.com/Rob--W/cors-anywhere.git
cd cors-anywhere
npm install
npm start
```

2. **simple-cors-proxy** (Cloudflare Worker):
Deploy to Cloudflare Workers for free:
```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const targetUrl = url.searchParams.get('url')
  if (!targetUrl) return new Response('Missing url param', { status: 400 })
  
  const response = await fetch(targetUrl)
  const newHeaders = new Headers(response.headers)
  newHeaders.set('Access-Control-Allow-Origin', '*')
  
  return new Response(response.body, {
    status: response.status,
    headers: newHeaders
  })
}
```

3. **Vercel Edge Function**:
```typescript
// api/proxy.ts
export const config = { runtime: 'edge' }

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url)
  const targetUrl = searchParams.get('url')
  if (!targetUrl) return new Response('Missing url', { status: 400 })
  
  const res = await fetch(targetUrl)
  return new Response(res.body, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': res.headers.get('Content-Type') || 'application/json'
    }
  })
}
```

### Disable Proxy Feature

To hide the proxy toggle completely, find and remove this section in `src/App.tsx`:

```typescript
{/* CORS Proxy Toggle */}
<div className="mt-4 rounded-xl bg-slate-100 p-4 ...">
  ...
</div>
```

And set `useProxy` to always be `"none"`:
```typescript
const [useProxy] = useState<ProxyOption>("none");
```

## 🎯 Configuration Object

For easier customization, create a config file:

Create `src/config.ts`:

```typescript
export const config = {
  appName: "Free API Encyclopedia",
  appVersion: "v2026.1",
  primaryColor: "violet",
  defaultCategory: "All" as const,
  defaultSort: "id" as const,
  showFavoritesFirst: true,
  itemsPerPage: 0, // 0 = show all
  enableAnalytics: false,
  socialLinks: {
    github: "https://github.com/...",
    twitter: "https://twitter.com/...",
  }
}
```

Then import and use in `App.tsx`:

```typescript
import { config } from "./config"

// Use config.appName instead of hardcoded string
```

## ✅ Testing Your Customizations

After making changes:

```bash
# Type check
npx tsc --noEmit

# Lint
npm run build

# Test locally
npm run dev

# Build for production
npm run build

# Preview
npm run preview
```

## 🐛 Common Issues

### Colors not updating
- Clear browser cache
- Restart dev server
- Check Tailwind class is correct

### Types errors
- Run `npx tsc --noEmit` to see errors
- Ensure all required fields are filled for new APIs
- Check category names match exactly

### Layout broken
- Check for unclosed tags
- Verify Tailwind classes are valid
- Use browser devtools to inspect

## 📚 Resources

- [Tailwind CSS Docs](https://tailwindcss.com)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

**Need help?** Check the [README](./README.md) or [Usage Guide](./GUIDE.md)

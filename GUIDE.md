# 📖 User Guide - Free API Encyclopedia

Complete guide on how to use the Free API Encyclopedia app effectively.

## 🎯 What is This App?

The Free API Encyclopedia is a curated directory of **200+ documented APIs** that you can browse, compare, and test safely in one place. Each API is documented with:

- **Real limits** - Daily, monthly, rate limits (not made up!)
- **Auth requirements** - Do you need a key or not?
- **Live demos** - Actually fetch real data
- **Copy-paste code** - Ready to use cURL examples
- **Pro tips** - Best practices from experience

## 🚀 Getting Started

### Opening the App

1. Open the app in your browser
2. You'll see a grid of API cards
3. Each card shows: name, provider, category, auth type, and limits

### Understanding the Cards

Each card contains:

```
┌─────────────────────────────────┐
│ 🤖 Gemini 1.5              ⭐   │
│ Google Cloud                    │
│                                │
│ Multimodal model for text...   │
│                                │
│ [AI] [Key] [15 RPM]            │
│ 1M tokens free, great for...   │
└─────────────────────────────────┘
```

- **Top left**: Category emoji + API name
- **Top right**: Star to favorite (♡ → ★)
- **Subtitle**: Provider name
- **Description**: What it does
- **Badges**: Category, Auth, Limits
- **Bottom**: Free tier info

### Category Emojis

- 🤖 AI & Agentic APIs
- 🧪 Testing & Placeholder
- 💰 Finance, Crypto & Web3
- 🎮 Gaming & Esports
- 🎵 Music & Multimedia
- 🛠️ DevTools & Infrastructure
- 🏛️ Government, Science & World

## 🔍 Finding APIs

### Search

Use the search box at the top to find APIs:

- **By name**: "github", "weather", "cat"
- **By provider**: "google", "spotify", "nasa"
- **By use case**: "testing", "crypto", "music"
- **By tech**: "graphql", "websocket", "rest"

Search looks through:
- API name
- Provider
- Description
- Tags
- Use cases

**Tips:**
- Search is case-insensitive
- Partial matches work ("weath" finds "weather")
- Clear search with the ✕ button

### Filter by Category

Click category buttons below search:
- Click "AI" to see only AI APIs
- Click "Testing" for mock data APIs
- Click "All" to see everything

You can combine filters!

### Filter by Auth

Choose auth type:
- **All Auth**: Show all APIs
- **No Auth**: APIs that work immediately (best for testing)
- **API Key**: Requires signup and key (usually more powerful)

### Sort

Click sort buttons:
- **ID**: Original order (by list position)
- **Name**: Alphabetical A→Z
- **Category**: Grouped by category

### Favorites

Click the ♡ on any card to favorite it:
- ♡ = Not favorited
- ★ = Favorited (saved in browser)

Use the **Favorites** toggle in the toolbar to view only your favorited APIs. Favorites are saved in your browser (localStorage) and persist between visits.

## 📋 Viewing API Details

Click any API card to open the detailed modal.

### Modal Sections

1. **Header**
   - Name, provider, category badge
   - Quick badges: Auth, Limits, CORS, Free Tier
   - Close button (✕) or press ESC

2. **Description**
   - Full explanation of what the API does

3. **Quick Links**
   - **Visit** - Go to official website
   - **Docs** - Open documentation

4. **Auth Section**
   - Whether you need a key
   - How to get it
   - If signup is required (⚠️ warning)

5. **Limits Section**
   - Rate limits per minute/hour/day/month
   - Free tier explanation
   - "Free Forever" vs "Freemium" vs "Free Trial"

6. **Use Cases**
   - Bullet list of when to use this API
   - Who it's for
   - Common applications

7. **Why Use This API**
   - 2-3 sentence explanation
   - What makes it special
   - Comparison to alternatives

8. **Pro Tips**
   - Best practices
   - Gotchas to avoid
   - Performance tips
   - Caching recommendations

9. **Example Request**
   - Copy-paste cURL command
   - Click "Copy cURL" button
   - Works in terminal immediately (for no-auth APIs)

10. **Live Demo**
    - Click "Try live" to fetch real data
    - See actual JSON response
    - URL shown above response
    - Copy response button
    - Note about CORS

## 🧪 Using Live Demos

### How It Works

When you click "Try live":
1. App makes a real `fetch()` request to the API
2. Shows loading spinner (with proxy info if enabled)
3. Displays JSON response (pretty-printed)
4. Shows success indicator showing how request was made
5. Or shows error with helpful suggestions

### 🆕 CORS Proxy Toggle

The app includes a **CORS Proxy** toggle system to bypass browser restrictions:

```
┌──────────────────────────────────────────────────┐
│ CORS Proxy: [Direct] [AllOrigins] [corsproxy.io]│
│                                                  │
│ ✅ Proxy enabled: Requests will be routed       │
│ through api.allorigins.win to bypass CORS       │
└──────────────────────────────────────────────────┘
```

**Options:**
- **Direct**: Fetches API directly (works if CORS enabled)
- **AllOrigins**: Routes through api.allorigins.win proxy
- **corsproxy.io**: Alternative CORS proxy option

**How to use:**
1. First try with "Direct" - works for many public APIs
2. If you see CORS error, click "AllOrigins" or "corsproxy.io"
3. Click "Try live" again
4. If still fails, try the other proxy option
5. Last resort: Copy cURL command for terminal/Postman

### Smart Error Detection

The app automatically detects error types:

**🚫 CORS Error:**
- Shows: "CORS blocked! Browser security prevents direct access"
- Suggests: "Enable 'Use Proxy' below to bypass this"
- Action buttons: "Use AllOrigins" / "Use corsproxy.io"

**⏱️ Timeout Error:**
- Shows: "Request timed out after 15 seconds"
- Suggests: "API server may be slow. Try again later"

**❌ HTTP Error:**
- Shows: "Server returned error: HTTP 404"
- Suggests: Check endpoint URL or API status

**🔌 Network Error:**
- Shows: "Network error"
- Suggests: Check internet connection

### Which APIs Work?

**✅ Usually works in browser (Direct):**
- Public GET endpoints with CORS headers
- Examples: JSONPlaceholder, Cat Facts, Dog CEO, CoinGecko, REST Countries

**✅ Works with Proxy:**
- Most public APIs that block CORS
- The proxy routes request through a server that adds CORS headers

**⚠️ May not work even with proxy:**
- APIs that require API keys (key can't be sent through proxy securely)
- APIs with IP-based rate limiting
- POST/PUT/DELETE requests (some proxies only support GET)

**This is normal.** For protected APIs, use the cURL command.

### Understanding CORS

**CORS** = Cross-Origin Resource Sharing

Browsers block requests to different domains unless the API explicitly allows it.

**Why?** Security - prevents malicious sites from using your credentials.

**Solution options:**
1. **Use CORS Proxy** (built into the app!)
2. Use the cURL command in terminal
3. Backend server (Node.js, Python, etc.)
4. Serverless function (Vercel, Netlify)
5. Postman or Insomnia

### Demo States

- **Idle**: "Click 'Try live' to fetch real data"
- **Loading**: Spinning circle with "Fetching via allorigins proxy..."
- **Success**: ✅ badge + JSON response + copy button
- **CORS Error**: Red box + "Enable proxy" suggestion buttons
- **Other Error**: Red box + helpful tips

### Always Available: cURL Copy

Even if live demo doesn't work, you can always:
```
┌────────────────────────────────────────────────────┐
│ Prefer terminal? Copy and run cURL directly.      │
│                                    [Copy cURL]    │
└────────────────────────────────────────────────────┘
```

## 🎓 Understanding API Metadata

### Auth Types

**NONE** (Green badge)
- No signup required
- No key needed
- Start using immediately
- Perfect for prototyping
- Example: JSONPlaceholder, Cat Facts

**Key** (Amber badge)
- Requires API key
- Usually free signup
- Key goes in header or query param
- More features and higher limits
- Example: GitHub, OpenWeather

**OAuth** (Blue badge)
- Requires OAuth flow
- More complex
- For user data access
- Example: Spotify, Google

### Free Tier Types

**Free Forever**
- Always free
- No credit card
- Generous limits
- Sustainable business model
- Example: JSONPlaceholder, REST Countries

**Freemium**
- Free tier + paid plans
- Enough for small projects
- Pay for more usage
- Example: GitHub, Supabase

**Free Trial**
- Free for limited time
- Then must pay
- Often requires credit card
- Example: Some AI APIs

**Self-hosted**
- Open source
- Run on your server
- No limits
- Example: Flowise

### Rate Limits

Limits shown as:
- **15 RPM** = 15 requests per minute
- **1,000 req / mo** = 1,000 requests per month
- **10-30 RPM** = between 10 and 30
- **❌ No Limit** = no hard limit (but be nice!)

Rate limit details breakdown:
- **Per minute**: Burst limit
- **Per hour**: Sustained limit
- **Per day**: Daily quota
- **Per month**: Monthly quota

**Best practice:** Cache responses! Don't hit the API every time.

### CORS Support

**Yes** (Green badge)
- Works in browser
- Live demo will work
- Can use in frontend

**No** (Gray badge)
- Blocked by browser
- Need backend proxy
- cURL still works

## 💡 Use Cases Guide

### When to Use Each Category

**🤖 AI APIs**
- Build chatbots
- Add AI features
- Generate content
- Process text/images

**🧪 Testing APIs**
- Learn API basics
- Mock backend
- Prototype UI
- Demo apps
- No signup needed!

**💰 Finance APIs**
- Track crypto prices
- Show exchange rates
- Display stock data
- Build dashboards

**🎮 Gaming APIs**
- Show player stats
- Build companion apps
- Track leaderboards
- Game data lookup

**🎵 Music APIs**
- Search songs
- Display metadata
- Build players
- Music discovery

**🛠️ DevTools APIs**
- Git integration
- Deploy automation
- IP geolocation
- Email sending

**🏛️ Science APIs**
- Weather apps
- Space data
- Country info
- Research tools

## 🛡️ Best Practices

### Rate Limit Handling

1. **Cache responses**
   ```javascript
   // Cache for 30 minutes
   localStorage.setItem('weather', JSON.stringify({
     data: response,
     timestamp: Date.now()
   }))
   ```

2. **Implement backoff**
   - If rate limited, wait before retrying
   - Exponential backoff: 1s, 2s, 4s, 8s...

3. **Show loading states**
   - Don't let users spam the button
   - Disable during fetch

### Error Handling

Always use try/catch:

```javascript
try {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  // Use data
} catch (err) {
  // Show fallback UI
  console.error(err)
}
```

### Security

**Never expose API keys in frontend!**

❌ Bad:
```javascript
fetch('https://api.example.com?key=SECRET_KEY')
```

✅ Good:
```javascript
// Use serverless function
fetch('/api/proxy-endpoint')
```

Serverless function holds the key securely.

### When to Get a Key

Get an API key when:
- Building production app
- Need higher limits
- Accessing user-specific data
- Using paid features

Don't need key for:
- Learning
- Prototypes
- Demos
- Personal projects (sometimes)

## 🔧 Common Workflows

### Workflow 1: Quick Prototype

1. Search for "testing" or filter by Testing category
2. Pick a no-auth API like JSONPlaceholder
3. Copy cURL example
4. Use live demo to see response shape
5. Build UI with mock data
6. Later replace with real API

### Workflow 2: Find Free Alternative

1. You need a weather API
2. Search "weather"
3. Compare options:
   - Open-Meteo: No auth, no limit ✅
   - OpenWeather: Requires key, 60/min
4. Choose based on needs
5. Read pro tips
6. Copy example code

### Workflow 3: Plan Production App

1. Filter by your category
2. Show only "API Key" auth
3. Check free tier: "Freemium" or "Free Forever"?
4. Note rate limits
5. Read why-use section
6. Check CORS (need backend?)
7. Bookmark favorites
8. Read docs

## 📱 Mobile Usage

App is fully responsive:

- **Phone**: 1 column, stacked filters
- **Tablet**: 2 columns
- **Desktop**: 3-4 columns

All features work on mobile:
- Tap cards to open modal
- Scroll to see all sections
- Copy buttons work
- Search and filters work

**Tip**: Use landscape for better modal viewing.

## 🎯 Power User Tips

### Keyboard Shortcuts

- **ESC**: Close modal
- **/**: Focus search (browser default)
- **Tab**: Navigate buttons

### URL Sharing

Currently no URL state, but you can:
1. Favorite APIs you like
2. Export favorites (see CUSTOMIZE.md)
3. Share specific API by name

### Batch Operations

To work with multiple APIs:
1. Favorite them all
2. Enable the Favorites toggle
3. Open each in new tab (middle-click)
4. Compare side by side

### Finding the Best API

For any use case, compare:
1. Auth required?
2. Rate limits
3. CORS support
4. Free tier type
5. Pro tips for gotchas
6. Live demo response

## 🐛 Troubleshooting

### Live demo shows CORS error

**Normal!** Many APIs block browsers.

Solutions:
- Use cURL in terminal
- Use backend proxy
- Use serverless function
- Try no-auth APIs instead

### Live demo times out

API took >10 seconds. Try:
- Check your internet
- Try again later
- API might be down

### Search not finding API

- Check spelling
- Try broader term
- Check category filter
- Clear filters
- Check auth filter

### Favorites disappeared

- LocalStorage was cleared
- Different browser/device
- Private/incognito mode

**Solution**: Export favorites regularly (see CUSTOMIZE.md)

### Modal won't close

- Click ✕ button
- Press ESC key
- Click dark backdrop
- Refresh page (last resort)

## 📚 Learning Path

### Beginner

1. Start with Testing category
2. Pick JSONPlaceholder
3. Try live demo (it works!)
4. Copy cURL and run in terminal
5. Understand JSON response
6. Try other no-auth APIs

### Intermediate

1. Get a free API key (GitHub)
2. Try key-based API
3. Learn about headers
4. Implement in your project
5. Handle errors
6. Add caching

### Advanced

1. Use APIs needing backend
2. Implement rate limiting
3. Add retry logic
4. Monitor usage
5. Optimize requests
6. Contribute new APIs to this list

## 🤝 Contributing

Found an API that's missing or outdated?

1. Check README.md for contribution guide
2. Add to `src/apiData.ts`
3. Follow the structure
4. Test live demo
5. Submit PR

## 📞 Getting Help

### API not working?

1. Check API status page
2. Verify your key (if required)
3. Check rate limits
4. Read error message
5. Check docs

### App issue?

1. Refresh page
2. Clear cache
3. Try different browser
4. Check console for errors
5. Report bug on GitHub

## 🎓 Key Takeaways

- ✅ **No-auth APIs** are best for learning
- ✅ **Always cache** to respect rate limits
- ✅ **Never expose keys** in frontend
- ✅ **Read pro tips** to avoid gotchas
- ✅ **Test with live demo** before coding
- ✅ **Check CORS** before using in browser
- ✅ **Favorite APIs** you want to remember

## 🔗 Useful Links

- **Copy-paste code**: Use cURL examples
- **Documentation**: Click "Docs" in modal
- **Official site**: Click "Visit" in modal
- **This guide**: Bookmark for reference
- **Customize**: See CUSTOMIZE.md
- **Contribute**: See README.md

---

**Remember**: The best API is the one that fits your needs, not the most popular one. Use filters to find APIs with no auth for quick starts, then upgrade to key-based APIs when you need more power.

**Pro tip**: Start with JSONPlaceholder to learn the basics, then explore!

---

*Questions? Check the README or open an issue on GitHub.*

*Last updated: 2026-03-29*

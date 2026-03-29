import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  API_DATA,
  CATEGORIES,
  formatAuth,
  formatFreeTier,
  getCategoryEmoji,
  type ApiCategory,
  type ApiEntry,
  type AuthType,
} from "./apiData";

type SortBy = "id" | "name" | "category";
type AuthFilter = "all" | AuthType;
type CategoryFilter = "all" | ApiCategory;
type ViewMode = "grid" | "list";
type Theme = "light" | "dark";
type CodeLanguage = "curl" | "javascript" | "python";

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

async function copyToClipboard(text: string) {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fallback below
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "true");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    const copied = document.execCommand("copy");
    document.body.removeChild(textarea);
    return copied;
  } catch {
    return false;
  }
}

function joinUrl(baseUrl?: string, endpoint?: string) {
  if (!baseUrl) return "";
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  if (endpoint === undefined || endpoint === null || endpoint === "") return normalizedBase;
  return `${normalizedBase}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
}

function loadFavorites() {
  if (typeof window === "undefined") return [] as number[];
  try {
    const raw = window.localStorage.getItem("api-favorites");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((value): value is number => typeof value === "number") : [];
  } catch {
    return [];
  }
}

function loadTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    const saved = window.localStorage.getItem("api-theme");
    return (saved === "light" || saved === "dark") ? saved : "dark";
  } catch {
    return "dark";
  }
}

function saveTheme(theme: Theme) {
  try {
    window.localStorage.setItem("api-theme", theme);
  } catch {}
}

function generateJSFetch(api: ApiEntry) {
  const url = api.baseUrl ? `${joinUrl(api.baseUrl, api.demoEndpoint)}${api.demoParams ? `?${new URLSearchParams(api.demoParams).toString()}` : ''}` : '<API_URL>';
  const headers = api.auth === 'NONE' 
    ? `{ 'Accept': 'application/json' }`
    : `{ 'Accept': 'application/json', 'Authorization': 'Bearer YOUR_API_KEY' }`;
  
  return `fetch('${url}', {
  method: 'GET',
  headers: ${headers}
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`;
}

function generatePythonCode(api: ApiEntry) {
  const url = api.baseUrl ? `${joinUrl(api.baseUrl, api.demoEndpoint)}${api.demoParams ? `?${new URLSearchParams(api.demoParams).toString()}` : ''}` : '<API_URL>';
  const headers = api.auth === 'NONE'
    ? "{'Accept': 'application/json'}"
    : "{'Accept': 'application/json', 'Authorization': 'Bearer YOUR_API_KEY'}";
  
  return `import requests

url = "${url}"
headers = ${headers}

response = requests.get(url, headers=headers)
data = response.json()
print(data)`;
}

function exportAsJSON(apis: ApiEntry[]) {
  const dataStr = JSON.stringify(apis, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `apis-export-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function exportAsCSV(apis: ApiEntry[]) {
  const headers = ['ID', 'Name', 'Provider', 'Category', 'Auth', 'Limits', 'Description', 'Website'];
  const rows = apis.map(api => [
    api.id,
    api.name,
    api.provider,
    api.category,
    api.auth,
    api.limits,
    api.description.replace(/[,\n]/g, ' '),
    api.website
  ]);
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `apis-export-${Date.now()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function BrowserDemoStatus({ api }: { api: ApiEntry }) {
  const canRun = canRunBrowserDemo(api);

  return (
    <div
      className={classNames(
        "rounded-2xl p-4 text-sm ring-1 ring-inset",
        canRun
          ? "bg-emerald-50 text-emerald-900 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-100 dark:ring-emerald-900/50"
          : "bg-amber-50 text-amber-900 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-100 dark:ring-amber-900/50"
      )}
    >
      <div className="font-medium">{canRun ? "Browser live demo available" : "Browser live demo limited"}</div>
      <p className="mt-1 leading-relaxed opacity-90">{getDemoUnavailableReason(api)}</p>
    </div>
  );
}

// Check if API has been tested and marked as browser-safe
function canRunBrowserDemo(api: ApiEntry) {
  // If browserSafe is explicitly set, use that
  if (api.browserSafe !== undefined) {
    return api.browserSafe;
  }
  // Fallback: only run if all conditions are met
  const method = api.demoMethod ?? "GET";
  return Boolean(api.baseUrl) && api.demoEndpoint !== undefined && method === "GET" && api.auth === "NONE" && api.cors === "Yes";
}

function getDemoUnavailableReason(api: ApiEntry) {
  if (!api.baseUrl || api.demoEndpoint === undefined) {
    return "This entry documents the API, but a safe browser demo endpoint has not been configured yet.";
  }

  // If browserSafe is explicitly false or not set
  if (api.browserSafe === false) {
    return "This API has been tested and does not support direct browser requests. Use the cURL command or call from your backend.";
  }

  if (canRunBrowserDemo(api)) {
    return "✅ This endpoint has been tested and works directly from the browser.";
  }

  if (api.auth !== "NONE") {
    return "This API requires authentication (API Key, OAuth, or Login). For security, use the cURL example or call from a backend/serverless function.";
  }

  if ((api.demoMethod ?? "GET") !== "GET") {
    return "This demo requires a POST request or custom body. Browser preview is disabled to avoid errors.";
  }

  if (api.cors === "No") {
    return "This provider blocks browser cross-origin requests (CORS). Use the cURL command, Postman, or your backend instead.";
  }

  if (api.cors === "Partial") {
    return "This API has partial CORS support. Some endpoints may work, others may be blocked. Try using cURL or backend if browser demo fails.";
  }

  return "This API may not support direct browser requests. Use the cURL command for reliable results.";
}

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <button
      onClick={async () => {
        const ok = await copyToClipboard(text);
        setFailed(!ok);
        setCopied(ok);
        window.setTimeout(() => {
          setCopied(false);
          setFailed(false);
        }, 1600);
      }}
      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
      type="button"
    >
      {copied ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          Copied
        </>
      ) : failed ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
          Failed
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

function Badge({ children, color = "slate" }: { children: ReactNode; color?: string }) {
  const colors: Record<string, string> = {
    emerald:
      "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-400/30",
    amber:
      "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-400/30",
    blue: "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-950/50 dark:text-blue-300 dark:ring-blue-400/30",
    violet:
      "bg-violet-50 text-violet-700 ring-violet-600/20 dark:bg-violet-950/50 dark:text-violet-300 dark:ring-violet-400/30",
    slate: "bg-slate-50 text-slate-700 ring-slate-600/10 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
    rose: "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-950/50 dark:text-rose-300 dark:ring-rose-400/30",
  };

  return (
    <span className={classNames("inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset", colors[color] || colors.slate)}>
      {children}
    </span>
  );
}

// CORS Proxy type for toggling between direct and proxied requests
type ProxyOption = "none" | "allorigins" | "corsproxy" | "corssh";

function Modal({ api, onClose }: { api: ApiEntry | null; onClose: () => void }) {
  const [demoData, setDemoData] = useState<unknown>(null);
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoError, setDemoError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<"cors" | "network" | "timeout" | "http" | null>(null);
  const [useProxy, setUseProxy] = useState<ProxyOption>("none");
  const [lastAttemptedProxy, setLastAttemptedProxy] = useState<ProxyOption>("none");
  const [showProxyHelp, setShowProxyHelp] = useState(false);
  const [codeTab, setCodeTab] = useState<CodeLanguage>("curl");
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!api) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setDemoData(null);
    setDemoError(null);
    setErrorType(null);
    setUseProxy("none");
    setLastAttemptedProxy("none");
    setShowProxyHelp(false);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [api, onClose]);

  if (!api) return null;

  const auth = formatAuth(api.auth);
  const tier = formatFreeTier(api.freeTier);
  const demoUrl = api.baseUrl ? `${joinUrl(api.baseUrl, api.demoEndpoint)}${api.demoParams ? `?${new URLSearchParams(api.demoParams).toString()}` : ""}` : "";
  const browserDemoEnabled = canRunBrowserDemo(api);

  // Build URL with or without proxy
  const buildFetchUrl = (originalUrl: string, proxy: ProxyOption): string => {
    // Check if URL is HTTP (not HTTPS) - proxies usually don't support HTTP
    const isHttpOnly = originalUrl.toLowerCase().startsWith('http://');
    
    if (isHttpOnly && proxy !== 'none') {
      // Most CORS proxies don't support HTTP-only URLs
      return originalUrl; // Fallback to direct
    }
    
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

  const shareApi = () => {
    const shareData = {
      title: `${api.name} API`,
      text: `${api.description}\n\nProvider: ${api.provider}\nAuth: ${auth.label}\nLimits: ${api.limits}`,
      url: api.website,
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => copyToClipboard(api.website));
    } else {
      copyToClipboard(api.website);
      alert("Link copied to clipboard!");
    }
  };

  const runLiveDemo = async () => {
    if (!api.baseUrl || api.demoEndpoint === undefined) {
      setDemoData(null);
      setDemoError(getDemoUnavailableReason(api));
      return;
    }

    setDemoLoading(true);
    setDemoError(null);
    setErrorType(null);
    setDemoData(null);
    setLastAttemptedProxy(useProxy);

    try {
      const baseUrl = new URL(joinUrl(api.baseUrl, api.demoEndpoint));
      if (api.demoParams) {
        Object.entries(api.demoParams).forEach(([key, value]) => {
          baseUrl.searchParams.set(key, value);
        });
      }

      const originalUrl = baseUrl.toString();
      const fetchUrl = buildFetchUrl(originalUrl, useProxy);

      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 15000);

      const headers: Record<string, string> = {
        Accept: "application/json",
      };

      // cors.sh requires origin header
      if (useProxy === "corssh") {
        headers["x-cors-api-key"] = "temp_" + Date.now();
      }

      const response = await fetch(fetchUrl, {
        method: "GET",
        headers,
        signal: controller.signal,
      });

      window.clearTimeout(timeout);

      if (!response.ok) {
        setErrorType("http");
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        setDemoData(await response.json());
      } else {
        const text = await response.text();
        // Try to parse as JSON anyway (some proxies don't set content-type)
        try {
          setDemoData(JSON.parse(text));
        } catch {
          setDemoData({ _rawText: text.slice(0, 5000) });
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch";
      
      // Detect error type
      if (message === "The operation was aborted." || message.includes("aborted")) {
        setErrorType("timeout");
        setDemoError("⏱️ Request timed out after 15 seconds. The API server may be slow or unreachable.");
      } else if (message.includes("Failed to fetch") || message.includes("NetworkError") || message.includes("CORS")) {
        setErrorType("cors");
        const isHttpOnly = demoUrl.toLowerCase().startsWith('http://');
        
        if (useProxy === "none") {
          if (isHttpOnly) {
            setDemoError("🚫 CORS blocked! This HTTP-only API cannot use CORS proxies. Use the cURL command or call from your backend server.");
          } else {
            setDemoError("🚫 CORS blocked! Browser security prevents direct access. Enable 'Use Proxy' below to bypass this.");
            setShowProxyHelp(true);
          }
        } else {
          if (isHttpOnly) {
            setDemoError(`❌ Proxy doesn't support HTTP URLs. This API requires HTTPS or backend access. Use the cURL command instead.`);
          } else {
            setDemoError(`🚫 Request failed even with ${useProxy} proxy. Try a different proxy or use the cURL command.`);
          }
        }
      } else if (message.startsWith("HTTP")) {
        setErrorType("http");
        setDemoError(`❌ Server returned error: ${message}`);
      } else {
        setErrorType("network");
        setDemoError(`❌ Network error: ${message}`);
      }
    } finally {
      setDemoLoading(false);
    }
  };

  // Helper function removed - auto-suggestions now inline in error handling

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="api-modal-title"
        className="my-8 w-full max-w-4xl rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white/85 p-6 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/85 sm:p-8">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <span className="text-lg">{getCategoryEmoji(api.category)}</span>
                {api.category}
              </span>
              <span>•</span>
              <span>{api.provider}</span>
            </div>
            <h2 id="api-modal-title" className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {api.name}
            </h2>
            <p className="mt-2 max-w-3xl text-slate-600 dark:text-slate-300">{api.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge color={auth.color}>
                <span className="mr-1">{auth.icon}</span>
                {auth.label}
              </Badge>
              <Badge color={tier.color}>{tier.label}</Badge>
              <Badge color={api.cors === "Yes" ? "emerald" : api.cors === "Partial" ? "amber" : "rose"}>CORS: {api.cors}</Badge>
              <Badge color="slate">{api.limits}</Badge>
              <Badge color="slate">#{api.id}</Badge>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            onClick={onClose}
            type="button"
            aria-label="Close details dialog"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700 focus:outline-none focus:ring-4 focus:ring-violet-500/20 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-8 p-6 sm:p-8">
          <div className="flex flex-wrap gap-2">
            <a
              href={api.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Visit website
            </a>
            <a
              href={api.docs}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-900 ring-1 ring-inset ring-slate-300 transition hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700 dark:hover:bg-slate-700"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              Read docs
            </a>
            <button
              onClick={shareApi}
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-900 ring-1 ring-inset ring-slate-300 transition hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700 dark:hover:bg-slate-700"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              Share
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Auth</h3>
              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-inset ring-slate-200 dark:bg-slate-800/50 dark:ring-slate-700">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{auth.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-slate-900 dark:text-white">{auth.label}</div>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {api.auth === "NONE"
                        ? "No login/key required. Great for testing."
                        : api.auth === "Key"
                        ? "Get an API key from the provider dashboard."
                        : api.auth === "OAuth"
                        ? "OAuth flow required. Follow the provider documentation."
                        : "Sign in to access the API. Follow the provider authentication guide."}
                    </p>
                    {api.requiresSignup && (
                      <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-amber-700 dark:text-amber-300">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                          <path d="M12 9v4" />
                          <path d="M12 17h.01" />
                        </svg>
                        Requires provider signup
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Limits</h3>
              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-inset ring-slate-200 dark:bg-slate-800/50 dark:ring-slate-700">
                <div className="text-2xl font-semibold text-slate-900 dark:text-white">{api.limits}</div>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {api.freeTier === "Free Forever" ? "Generous free tier with no expiry." : api.freeTier === "Freemium" ? "Free tier with optional paid upgrades." : "Trial period with limited usage."}
                </p>
                {api.rateLimitDetails && (
                  <p className="mt-2 border-t border-slate-200 pt-2 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    {api.rateLimitDetails}
                  </p>
                )}
              </div>
            </section>

            <section className="space-y-4 lg:col-span-2">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Use cases</h3>
              <div className="flex flex-wrap gap-2">
                {api.useCases.map((useCase) => (
                  <span
                    key={useCase}
                    className="rounded-xl bg-violet-50 px-3 py-1.5 text-sm font-medium text-violet-700 ring-1 ring-inset ring-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:ring-violet-900/50"
                  >
                    {useCase}
                  </span>
                ))}
              </div>
            </section>

            <section className="space-y-4 lg:col-span-2">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Why use this API?</h3>
              <p className="rounded-2xl bg-blue-50 p-4 text-sm leading-relaxed text-blue-900 ring-1 ring-inset ring-blue-200 dark:bg-blue-950/30 dark:text-blue-100 dark:ring-blue-900/50">
                {api.whyUse}
              </p>
            </section>

            <section className="space-y-4 lg:col-span-2">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Pro tips</h3>
              <ul className="space-y-2 rounded-2xl bg-amber-50 p-4 ring-1 ring-inset ring-amber-200 dark:bg-amber-950/30 dark:ring-amber-900/50">
                {api.tips.map((tip, idx) => (
                  <li key={idx} className="flex gap-3 text-sm leading-relaxed text-amber-900 dark:text-amber-100">
                    <span className="mt-0.5 text-amber-600 dark:text-amber-400">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Code examples</h3>
                <div className="flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                  <button
                    onClick={() => setCodeTab("curl")}
                    type="button"
                    className={classNames(
                      "rounded px-3 py-1.5 text-xs font-medium transition",
                      codeTab === "curl"
                        ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    )}
                  >
                    cURL
                  </button>
                  <button
                    onClick={() => setCodeTab("javascript")}
                    type="button"
                    className={classNames(
                      "rounded px-3 py-1.5 text-xs font-medium transition",
                      codeTab === "javascript"
                        ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    )}
                  >
                    JavaScript
                  </button>
                  <button
                    onClick={() => setCodeTab("python")}
                    type="button"
                    className={classNames(
                      "rounded px-3 py-1.5 text-xs font-medium transition",
                      codeTab === "python"
                        ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    )}
                  >
                    Python
                  </button>
                </div>
              </div>
              <div className="relative">
                <pre className="overflow-x-auto rounded-2xl bg-slate-900 p-4 text-sm leading-relaxed text-slate-100 dark:bg-slate-950">
                  <code className="font-mono">
                    {codeTab === "curl" && api.exampleRequest}
                    {codeTab === "javascript" && generateJSFetch(api)}
                    {codeTab === "python" && generatePythonCode(api)}
                  </code>
                </pre>
                <div className="absolute right-3 top-3">
                  <CopyButton 
                    text={codeTab === "curl" ? api.exampleRequest : codeTab === "javascript" ? generateJSFetch(api) : generatePythonCode(api)} 
                    label={`Copy ${codeTab}`} 
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4 lg:col-span-2">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Live demo</h3>

              <BrowserDemoStatus api={api} />

              <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-medium text-slate-900 dark:text-white">{api.demoMethod || "GET"}</span>
                      <code className="truncate font-mono text-xs text-slate-600 dark:text-slate-400">{demoUrl || "—"}</code>
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {browserDemoEnabled
                        ? useProxy === "none"
                          ? "Direct browser request. May hit CORS limits."
                          : `Using ${useProxy} proxy to bypass CORS.`
                        : "Browser demo unavailable. Use cURL or backend."}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={runLiveDemo}
                      disabled={demoLoading || !demoUrl}
                      type="button"
                      className={classNames(
                        "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition",
                        demoLoading || !demoUrl
                          ? "cursor-not-allowed bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-600"
                          : "bg-violet-600 text-white hover:bg-violet-500 active:scale-[0.98]"
                      )}
                    >
                      {demoLoading ? (
                        <>
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                          </svg>
                          Running...
                        </>
                      ) : (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                          Try live
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* CORS Proxy Controls */}
                <div className="mt-4 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                  {/* HTTP Warning */}
                  {demoUrl && demoUrl.toLowerCase().startsWith('http://') && (
                    <div className="mb-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-900 dark:bg-amber-950/50 dark:text-amber-100">
                      <div className="flex items-start gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0">
                          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                          <line x1="12" y1="9" x2="12" y2="13"/>
                          <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                        <div>
                          <p className="font-medium">⚠️ HTTP-only API detected</p>
                          <p className="mt-1">This API uses HTTP (not HTTPS). CORS proxies don't support HTTP URLs. Use the cURL command or call from your backend server instead.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">CORS Proxy:</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setUseProxy("none")}
                          type="button"
                          className={classNames(
                            "rounded-lg px-2.5 py-1 text-xs font-medium transition",
                            useProxy === "none"
                              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                              : "bg-white text-slate-600 ring-1 ring-slate-300 hover:bg-slate-50 dark:bg-slate-700 dark:text-slate-300 dark:ring-slate-600 dark:hover:bg-slate-600"
                          )}
                        >
                          Direct
                        </button>
                        <button
                          onClick={() => setUseProxy("allorigins")}
                          type="button"
                          disabled={demoUrl.toLowerCase().startsWith('http://')}
                          className={classNames(
                            "rounded-lg px-2.5 py-1 text-xs font-medium transition",
                            useProxy === "allorigins"
                              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                              : "bg-white text-slate-600 ring-1 ring-slate-300 hover:bg-slate-50 dark:bg-slate-700 dark:text-slate-300 dark:ring-slate-600 dark:hover:bg-slate-600",
                            demoUrl.toLowerCase().startsWith('http://') && "cursor-not-allowed opacity-50"
                          )}
                          title={demoUrl.toLowerCase().startsWith('http://') ? "Proxy doesn't support HTTP URLs" : ""}
                        >
                          AllOrigins
                        </button>
                        <button
                          onClick={() => setUseProxy("corsproxy")}
                          type="button"
                          disabled={demoUrl.toLowerCase().startsWith('http://')}
                          className={classNames(
                            "rounded-lg px-2.5 py-1 text-xs font-medium transition",
                            useProxy === "corsproxy"
                              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                              : "bg-white text-slate-600 ring-1 ring-slate-300 hover:bg-slate-50 dark:bg-slate-700 dark:text-slate-300 dark:ring-slate-600 dark:hover:bg-slate-600",
                            demoUrl.toLowerCase().startsWith('http://') && "cursor-not-allowed opacity-50"
                          )}
                          title={demoUrl.toLowerCase().startsWith('http://') ? "Proxy doesn't support HTTP URLs" : ""}
                        >
                          corsproxy.io
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowProxyHelp(!showProxyHelp)}
                      type="button"
                      className="text-xs text-violet-600 hover:text-violet-500 dark:text-violet-400"
                    >
                      {showProxyHelp ? "Hide" : "What is this?"}
                    </button>
                  </div>

                  {showProxyHelp && (
                    <div className="mt-3 rounded-lg bg-blue-50 p-3 text-xs text-blue-900 dark:bg-blue-950/50 dark:text-blue-100">
                      <p className="font-medium">🛡️ CORS Proxy Help:</p>
                      <ul className="mt-1.5 space-y-1 pl-4">
                        <li>• <strong>Direct:</strong> Calls API directly (may fail with CORS errors)</li>
                        <li>• <strong>AllOrigins:</strong> Free HTTPS proxy via api.allorigins.win</li>
                        <li>• <strong>corsproxy.io:</strong> Alternative HTTPS proxy service</li>
                      </ul>
                      <p className="mt-2 rounded bg-amber-100 p-2 text-amber-900 dark:bg-amber-950/50 dark:text-amber-100">
                        ⚠️ <strong>HTTP limitation:</strong> Proxies only support HTTPS URLs. If this API uses HTTP, you must use cURL or call from your backend.
                      </p>
                      <p className="mt-2 text-blue-800 dark:text-blue-200">
                        💡 Proxies are rate-limited. Never use in production—always call APIs from your backend server.
                      </p>
                    </div>
                  )}

                  {useProxy !== "none" && (
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-600 dark:text-emerald-400">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                      </svg>
                      <span className="text-slate-600 dark:text-slate-400">
                        Proxy enabled: Requests will be routed through {useProxy === "allorigins" ? "api.allorigins.win" : useProxy === "corsproxy" ? "corsproxy.io" : "cors.sh"} to bypass CORS
                      </span>
                    </div>
                  )}
                </div>

                {demoError && (
                  <div className="mt-4 rounded-xl bg-rose-50 p-4 ring-1 ring-inset ring-rose-200 dark:bg-rose-950/30 dark:ring-rose-900/50">
                    <div className="flex items-start gap-3">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0 text-rose-600 dark:text-rose-400">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-rose-900 dark:text-rose-100">Demo failed</p>
                        <p className="mt-1 text-sm text-rose-800 dark:text-rose-200">{demoError}</p>
                        
                        {errorType === "cors" && useProxy === "none" && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            <p className="w-full text-xs font-medium text-rose-900 dark:text-rose-100">💡 Try enabling a CORS proxy:</p>
                            <button
                              onClick={() => { setUseProxy("allorigins"); setTimeout(runLiveDemo, 100); }}
                              type="button"
                              className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-500"
                            >
                              Use AllOrigins
                            </button>
                            <button
                              onClick={() => { setUseProxy("corsproxy"); setTimeout(runLiveDemo, 100); }}
                              type="button"
                              className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-rose-700 ring-1 ring-rose-300 hover:bg-rose-50 dark:bg-rose-900 dark:text-rose-200 dark:ring-rose-700"
                            >
                              Use corsproxy.io
                            </button>
                          </div>
                        )}

                        {errorType === "cors" && useProxy !== "none" && lastAttemptedProxy === useProxy && (
                          <div className="mt-3">
                            <p className="text-xs text-rose-800 dark:text-rose-200">💡 Proxy didn't work. Try another option:</p>
                            <div className="mt-2 flex gap-2">
                              {useProxy !== "corsproxy" && (
                                <button
                                  onClick={() => { setUseProxy("corsproxy"); setTimeout(runLiveDemo, 100); }}
                                  type="button"
                                  className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-rose-700 ring-1 ring-rose-300 hover:bg-rose-50"
                                >
                                  Try corsproxy.io
                                </button>
                              )}
                              <CopyButton text={api.exampleRequest} label="Copy cURL" />
                            </div>
                          </div>
                        )}

                        {(errorType === "timeout" || errorType === "network" || errorType === "http") && (
                          <div className="mt-3">
                            <CopyButton text={api.exampleRequest} label="Copy cURL instead" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {demoData && (
                  <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-600 dark:text-emerald-400">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        Response ({useProxy === "none" ? "Direct" : `via ${useProxy} proxy`})
                      </div>
                      <CopyButton text={JSON.stringify(demoData, null, 2)} label="Copy JSON" />
                    </div>
                    <pre className="max-h-80 overflow-auto rounded-xl bg-slate-950 p-4 text-xs leading-relaxed text-emerald-100">
                      <code className="font-mono">{JSON.stringify(demoData, null, 2)}</code>
                    </pre>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-xs dark:bg-slate-800/50">
                  <span className="text-slate-600 dark:text-slate-400">
                    Prefer terminal? Copy and run cURL directly.
                  </span>
                  <CopyButton text={api.exampleRequest} label="Copy cURL" />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [authFilter, setAuthFilter] = useState<AuthFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("id");
  const [selected, setSelected] = useState<ApiEntry | null>(null);
  const [favorites, setFavorites] = useState<number[]>(() => loadFavorites());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  // New features state
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [theme, setTheme] = useState<Theme>(() => loadTheme());
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    window.localStorage.setItem("api-favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    saveTheme(theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.remove('light-mode');
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

  const filtered = useMemo(() => {
    let list = [...API_DATA];

    if (categoryFilter !== "all") list = list.filter((api) => api.category === categoryFilter);
    if (authFilter !== "all") list = list.filter((api) => api.auth === authFilter);
    if (showFavoritesOnly) list = list.filter((api) => favorites.includes(api.id));

    if (query) {
      const term = query.toLowerCase();
      list = list.filter((api) => {
        return (
          api.name.toLowerCase().includes(term) ||
          api.provider.toLowerCase().includes(term) ||
          api.description.toLowerCase().includes(term) ||
          api.category.toLowerCase().includes(term) ||
          api.useCases.some((useCase) => useCase.toLowerCase().includes(term))
        );
      });
    }

    switch (sortBy) {
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "category":
        list.sort((a, b) => a.category.localeCompare(b.category) || a.id - b.id);
        break;
      default:
        list.sort((a, b) => a.id - b.id);
    }

    return list;
  }, [query, categoryFilter, authFilter, sortBy, favorites, showFavoritesOnly]);

  // Pagination
  const paginatedData = useMemo(() => {
    const endIdx = currentPage * itemsPerPage;
    return filtered.slice(0, endIdx);
  }, [filtered, currentPage, itemsPerPage]);

  const hasMore = paginatedData.length < filtered.length;
  const loadMore = () => setCurrentPage(p => p + 1);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, categoryFilter, authFilter, showFavoritesOnly]);

  // Stats calculation
  const stats = useMemo(() => {
    const byCategory: Record<string, number> = {};
    const byAuth: Record<string, number> = {};
    let freeCount = 0;
    let corsFriendly = 0;
    
    API_DATA.forEach(api => {
      byCategory[api.category] = (byCategory[api.category] || 0) + 1;
      byAuth[api.auth] = (byAuth[api.auth] || 0) + 1;
      if (api.freeTier === 'Free Forever') freeCount++;
      if (api.browserSafe || api.cors === 'Yes') corsFriendly++;
    });
    
    return { byCategory, byAuth, freeCount, corsFriendly, total: API_DATA.length };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('input[type="text"]')?.focus();
      }
      // Number keys 1-7 for category filter
      if (e.key >= '1' && e.key <= '7' && !e.ctrlKey && !e.metaKey && !(e.target instanceof HTMLInputElement)) {
        const cats = (['ai','testing','finance','gaming','music','devtools','science'])[parseInt(e.key) - 1];
        if (cats) setCategoryFilter(cats as CategoryFilter);
      }
      // T to toggle theme
      if (e.key === 't' && !e.ctrlKey && !e.metaKey && !(e.target instanceof HTMLInputElement)) {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
      }
      // V to toggle view
      if (e.key === 'v' && !e.ctrlKey && !e.metaKey && !(e.target instanceof HTMLInputElement)) {
        setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
      }
      // S to toggle stats
      if (e.key === 's' && !e.ctrlKey && !e.metaKey && !(e.target instanceof HTMLInputElement)) {
        setShowStats(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const toggleFavorite = (id: number) => {
    setFavorites((current) => (current.includes(id) ? current.filter((fav) => fav !== id) : [...current, id]));
  };

  const resetFilters = () => {
    setQuery("");
    setCategoryFilter("all");
    setAuthFilter("all");
    setShowFavoritesOnly(false);
    setSortBy("id");
  };

  const hasActiveFilters = query !== "" || categoryFilter !== "all" || authFilter !== "all" || showFavoritesOnly;

  return (
    <div className={classNames("min-h-screen bg-slate-50 text-slate-900 antialiased transition-colors dark:bg-slate-950 dark:text-slate-100", theme === 'light' && 'light')}>
      <main className="mx-auto max-w-[1400px] px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-600 via-fuchsia-600 to-indigo-600 p-[1px] shadow-2xl shadow-violet-500/20">
          <div className="relative rounded-[2.5rem] bg-white px-6 py-12 dark:bg-slate-950 sm:px-10 sm:py-16">
            <div className="absolute right-6 top-6 flex items-center gap-2">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode (Press T)`}
              >
                {theme === 'dark' ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setShowStats(!showStats)}
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                title="Toggle stats (Press S)"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </button>
            </div>

            <div className="mx-auto max-w-4xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-1.5 text-sm font-medium text-violet-700 ring-1 ring-inset ring-violet-200 dark:bg-violet-950/50 dark:text-violet-300 dark:ring-violet-900/50">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                {stats.total}+ Free APIs • 2026 Edition
              </div>

              <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
                Free API <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">Encyclopedia</span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                A curated collection of {stats.total}+ free APIs for developers. Each entry includes auth details, rate limits, live demos with CORS proxy support, code examples in cURL/JS/Python, and practical usage guidance.
              </p>

              {showStats && (
                <div className="mt-8 grid gap-3 sm:grid-cols-4">
                  <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Total APIs</div>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-950/30">
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.freeCount}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Free Forever</div>
                  </div>
                  <div className="rounded-2xl bg-blue-50 p-4 dark:bg-blue-950/30">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.byAuth.NONE || 0}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">No Auth</div>
                  </div>
                  <div className="rounded-2xl bg-violet-50 p-4 dark:bg-violet-950/30">
                    <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">{stats.corsFriendly}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Browser Ready</div>
                  </div>
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Live demos with CORS proxy
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                  Multi-language code
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-500">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  </svg>
                  Export & share
                </span>
              </div>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-4">
              <div className="rounded-2xl bg-slate-50 p-5 text-center ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.total}</div>
                <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">APIs catalogued</div>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-5 text-center ring-1 ring-emerald-200 dark:bg-emerald-950/30 dark:ring-emerald-900/50">
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.byAuth.NONE || 0}</div>
                <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">No auth required</div>
              </div>
              <div className="rounded-2xl bg-blue-50 p-5 text-center ring-1 ring-blue-200 dark:bg-blue-950/30 dark:ring-blue-900/50">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.corsFriendly}</div>
                <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">Browser compatible</div>
              </div>
              <div className="rounded-2xl bg-violet-50 p-5 text-center ring-1 ring-violet-200 dark:bg-violet-950/30 dark:ring-violet-900/50">
                <div className="text-3xl font-bold text-violet-600 dark:text-violet-400">{favorites.length}</div>
                <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">Your favorites</div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky top-4 z-30 mt-8">
          <div className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg shadow-slate-200/50 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 dark:shadow-black/20">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="relative flex-1">
                  <svg className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search APIs, providers, use cases... (Ctrl+K)"
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-900 placeholder-slate-500 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder-slate-400"
                    type="text"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
                    className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="all">All categories</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.emoji} {cat.id}
                      </option>
                    ))}
                  </select>

                  <select
                    value={authFilter}
                    onChange={(e) => setAuthFilter(e.target.value as AuthFilter)}
                    className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="all">All auth types</option>
                    <option value="NONE">✓ No Auth</option>
                    <option value="Key">🔑 API Key</option>
                    <option value="OAuth">🔐 OAuth</option>
                    <option value="LOGIN_REQUIRED">👤 Login</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                    className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="id">Sort by ID</option>
                    <option value="name">Sort by name</option>
                    <option value="category">Sort by category</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-3 dark:border-slate-800">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    type="button"
                    className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-300 transition hover:bg-slate-50 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800"
                    title="Toggle view (Press V)"
                  >
                    {viewMode === 'grid' ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="8" y1="6" x2="21" y2="6" />
                          <line x1="8" y1="12" x2="21" y2="12" />
                          <line x1="8" y1="18" x2="21" y2="18" />
                          <line x1="3" y1="6" x2="3.01" y2="6" />
                          <line x1="3" y1="12" x2="3.01" y2="12" />
                          <line x1="3" y1="18" x2="3.01" y2="18" />
                        </svg>
                        List
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="7" height="7" />
                          <rect x="14" y="3" width="7" height="7" />
                          <rect x="14" y="14" width="7" height="7" />
                          <rect x="3" y="14" width="7" height="7" />
                        </svg>
                        Grid
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    disabled={favorites.length === 0}
                    type="button"
                    className={classNames(
                      "inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium ring-1 ring-inset transition",
                      showFavoritesOnly
                        ? "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900/60"
                        : "text-slate-700 ring-slate-300 hover:bg-slate-50 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800",
                      favorites.length === 0 && "cursor-not-allowed opacity-50"
                    )}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={showFavoritesOnly ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    Favorites {favorites.length > 0 && `(${favorites.length})`}
                  </button>

                  <div className="flex gap-1">
                    <button
                      onClick={() => exportAsJSON(filtered)}
                      type="button"
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-300 transition hover:bg-slate-50 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800"
                      title="Export filtered APIs as JSON"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      JSON
                    </button>
                    <button
                      onClick={() => exportAsCSV(filtered)}
                      type="button"
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-300 transition hover:bg-slate-50 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800"
                      title="Export filtered APIs as CSV"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      CSV
                    </button>
                  </div>

                  {hasActiveFilters && (
                    <button
                      onClick={resetFilters}
                      type="button"
                      className="inline-flex h-9 items-center rounded-lg bg-slate-900 px-3 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                    >
                      Reset filters
                    </button>
                  )}
                </div>

                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Showing <span className="font-semibold text-slate-900 dark:text-white">{paginatedData.length}</span> of{" "}
                  <span className="font-semibold">{filtered.length}</span> APIs
                  {filtered.length !== stats.total && (
                    <span className="text-slate-500"> (filtered from {stats.total})</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => {
              const active = categoryFilter === category.id;
              const count = stats.byCategory[category.id] || 0;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setCategoryFilter(active ? "all" : category.id)}
                  className={classNames(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ring-1 ring-inset transition",
                    active
                      ? "bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:ring-violet-900/50"
                      : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800 dark:hover:bg-slate-800"
                  )}
                >
                  <span>{category.emoji}</span>
                  <span>{category.id}</span>
                  <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] dark:bg-slate-700">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedData.map((api) => {
              const auth = formatAuth(api.auth);
              const tier = formatFreeTier(api.freeTier);
              const isFavorite = favorites.includes(api.id);
              const browserDemo = canRunBrowserDemo(api);

              return (
                <article
                  key={api.id}
                  className="group relative flex h-full flex-col rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-black/20"
                >
                  <button
                    onClick={() => toggleFavorite(api.id)}
                    type="button"
                    className={classNames(
                      "absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full transition",
                      isFavorite
                        ? "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400"
                        : "bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:bg-slate-800 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                    )}
                    aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>

                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-2xl dark:bg-slate-800">
                      {getCategoryEmoji(api.category)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="pr-8 text-base font-semibold leading-tight text-slate-900 dark:text-white">{api.name}</h3>
                        <div className="shrink-0 text-xs font-medium text-slate-400">#{api.id}</div>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <span className="truncate">{api.provider}</span>
                        <span>•</span>
                        <span className="truncate">{api.category}</span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{api.description}</p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    <Badge color={auth.color}>
                      <span className="mr-1">{auth.icon}</span>
                      {auth.label}
                    </Badge>
                    <Badge color={tier.color}>{tier.label}</Badge>
                    <Badge color="slate">{api.limits}</Badge>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <Badge color={browserDemo ? "blue" : api.cors === "No" ? "rose" : "amber"}>
                      {browserDemo ? "Live demo ready" : api.cors === "No" ? "Backend only" : "Docs / cURL"}
                    </Badge>
                    <Badge color={api.cors === "Yes" ? "emerald" : api.cors === "Partial" ? "amber" : "rose"}>CORS {api.cors}</Badge>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {api.useCases.slice(0, 3).map((useCase) => (
                      <span key={useCase} className="rounded-md bg-slate-100 px-2 py-1 text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        {useCase}
                      </span>
                    ))}
                    {api.useCases.length > 3 && (
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        +{api.useCases.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto pt-5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelected(api)}
                        type="button"
                        className="flex-1 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                      >
                        View details
                      </button>
                      <a
                        href={api.website}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-[42px] w-[42px] items-center justify-center rounded-xl border border-slate-300 text-slate-600 transition hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                        aria-label={`Visit ${api.name} website`}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 space-y-2">
            {paginatedData.map((api) => {
              const auth = formatAuth(api.auth);
              const isFavorite = favorites.includes(api.id);
              
              return (
                <div
                  key={api.id}
                  className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/50"
                >
                  <button
                    onClick={() => toggleFavorite(api.id)}
                    type="button"
                    className={classNames("shrink-0 text-slate-400 hover:text-rose-500", isFavorite && "text-rose-500")}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                  
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xl dark:bg-slate-800">
                    {getCategoryEmoji(api.category)}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{api.name}</h3>
                      <span className="text-xs text-slate-500">#{api.id}</span>
                      <Badge color={auth.color}>{auth.label}</Badge>
                      <Badge color="slate">{api.limits}</Badge>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-slate-600 dark:text-slate-400">{api.description}</p>
                  </div>
                  
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      onClick={() => setSelected(api)}
                      type="button"
                      className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                    >
                      View
                    </button>
                    <a
                      href={api.website}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-slate-300 p-1.5 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={loadMore}
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-medium text-slate-900 ring-1 ring-inset ring-slate-300 transition hover:bg-slate-50 dark:bg-slate-900 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-800"
            >
              Load more APIs
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs dark:bg-slate-800">
                {filtered.length - paginatedData.length} remaining
              </span>
            </button>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="mt-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">No APIs found</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Try changing the search, auth filter, category, or favorites toggle.</p>
            <button onClick={resetFilters} type="button" className="mt-4 text-sm font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400">
              Clear all filters
            </button>
          </div>
        )}

        <div className="mt-20 rounded-[2rem] border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
                Verified data
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li>• Auth type and requirements</li>
                <li>• Free tier & rate limits</li>
                <li>• Official docs links</li>
                <li>• CORS compatibility</li>
                <li>• Browser-safe demos</li>
              </ul>
            </div>
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                Best practices
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li>• Cache responses (30 min)</li>
                <li>• Never expose API keys</li>
                <li>• Use backend wrappers</li>
                <li>• Handle errors gracefully</li>
                <li>• Respect rate limits</li>
              </ul>
            </div>
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
                Keyboard shortcuts
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li>• <kbd className="rounded bg-slate-200 px-1.5 py-0.5 text-xs dark:bg-slate-700">Ctrl+K</kbd> Search</li>
                <li>• <kbd className="rounded bg-slate-200 px-1.5 py-0.5 text-xs dark:bg-slate-700">T</kbd> Toggle theme</li>
                <li>• <kbd className="rounded bg-slate-200 px-1.5 py-0.5 text-xs dark:bg-slate-700">V</kbd> Grid/List view</li>
                <li>• <kbd className="rounded bg-slate-200 px-1.5 py-0.5 text-xs dark:bg-slate-700">S</kbd> Toggle stats</li>
                <li>• <kbd className="rounded bg-slate-200 px-1.5 py-0.5 text-xs dark:bg-slate-700">1-7</kbd> Filter category</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-slate-200 pt-8 dark:border-slate-800">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white font-bold">
                P
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">PrivMITLab</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Open Source API Encyclopedia</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/PrivMITLab"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-300 transition hover:bg-slate-50 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                @PrivMITLab
              </a>
              <a
                href="https://github.com/PrivMITLab/free-api-encyclopedia"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                Star on GitHub
              </a>
            </div>
          </div>
          
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
            <span>Created with ❤️ by PrivMITLab</span>
            <span>•</span>
            <span>Research Date: March 2026</span>
            <span>•</span>
            <span>{stats.total}+ APIs catalogued</span>
            <span>•</span>
            <a href="https://github.com/PrivMITLab/free-api-encyclopedia/blob/main/LICENSE" target="_blank" rel="noreferrer" className="hover:text-violet-600 dark:hover:text-violet-400">MIT License</a>
          </div>
        </footer>
      </main>

      <Modal api={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

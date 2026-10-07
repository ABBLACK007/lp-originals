const isDev = process.env.NODE_ENV !== "production";

// Content Security Policy. Everything (fonts, images, scripts) is served from this site, so the policy
// only allows 'self'. 'unsafe-inline' for scripts is required by Next's static pages (nonces would force
// every page to render per request); 'unsafe-eval' and websockets are dev-only (hot reload).
// When Paystack is added: script-src/frame-src/connect-src need https://js.paystack.co https://checkout.paystack.com https://api.paystack.co
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // don't advertise the framework/version
  // Admin photo uploads go through a server action (the admin shrinks photos first; Vercel caps bodies at ~4.5MB).
  experimental: { serverActions: { bodySizeLimit: "4.5mb" } },
  images: {
    // Optimised images: the site's own files, plus photos uploaded from /admin to this project's Vercel Blob
    // store. No other remote host can be proxied (SSRF/DoS); one quality and WebP only keep the cache small.
    remotePatterns: [{ protocol: "https", hostname: "pfv4isj8xyzwi9ga.public.blob.vercel-storage.com", pathname: "/uploads/**" }],
    qualities: [75],
    formats: ["image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  // Old product URLs that are already live or shared.
  async redirects() {
    return [{ source: "/shop/closed-toe-clog", destination: "/shop/closed-toe-clog-mocha", permanent: true }];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};
export default nextConfig;

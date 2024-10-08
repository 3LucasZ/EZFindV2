/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Enable React strict mode for improved error handling
  swcMinify: true, // Enable SWC minification for improved performance
  output: "standalone", // Create a standalone (no npm packages) app for docker deployment
  basePath: "", //To deploy a Next.js application under a sub-path of a domain. When linking w/ pages using next/link or next/router basePath is automatically applied.
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development", // Remove console.log in production
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "**",
      },
    ],
  },
};

// Configuration object tells the next-pwa plugin
const withPWA = require("next-pwa")({
  dest: "public", // Destination directory for the PWA files
  // disable: process.env.NODE_ENV === "development", // Disable PWA in development mode
  disable: true, //it breaks the website deployment cache, so just disable it lol
  register: true, // Register the PWA service worker
  skipWaiting: true, // Skip waiting for service worker activation
});

// Export the combined configuration for Next.js with PWA support
module.exports = withPWA(nextConfig);

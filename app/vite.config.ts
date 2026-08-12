import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const cspNonce = "flowdoc-local-vite";

const contentSecurityPolicy = [
  "default-src 'self'",
  "img-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  `script-src 'self' 'nonce-${cspNonce}'`,
  "connect-src 'self'",
].join("; ");

export default defineConfig({
  appType: "mpa",
  html: {
    cspNonce,
  },
  root: "app",
  publicDir: "../generated",
  plugins: [react()],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  server: {
    host: "127.0.0.1",
    headers: {
      "Content-Security-Policy": contentSecurityPolicy,
    },
  },
  preview: {
    host: "127.0.0.1",
  },
});

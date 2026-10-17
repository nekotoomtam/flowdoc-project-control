import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, type Connect, type Plugin } from "vite";

const cspNonce = "flowdoc-local-vite";
const configDir = dirname(fileURLToPath(import.meta.url));
const diagnosticsPath = resolve(configDir, "../generated/project-diagnostics.json");
const emptyDiagnosticsPayload = `${JSON.stringify({ schemaVersion: 1, diagnostics: [] })}\n`;

const contentSecurityPolicy = [
  "default-src 'self'",
  "img-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  `script-src 'self' 'nonce-${cspNonce}'`,
  "connect-src 'self'",
].join("; ");

function projectDiagnosticsFallback(): Plugin {
  return {
    name: "flowdoc-project-diagnostics-fallback",
    configureServer(server) {
      server.middlewares.use(serveEmptyDiagnosticsWhenAbsent);
    },
    configurePreviewServer(server) {
      server.middlewares.use(serveEmptyDiagnosticsWhenAbsent);
    },
  };
}

const serveEmptyDiagnosticsWhenAbsent: Connect.NextHandleFunction = (request, response, next) => {
  const pathname = new URL(request.url ?? "/", "http://127.0.0.1").pathname;
  if (pathname !== "/project-diagnostics.json" || existsSync(diagnosticsPath)) {
    next();
    return;
  }

  response.statusCode = 200;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(emptyDiagnosticsPayload);
};

export default defineConfig({
  appType: "mpa",
  html: {
    cspNonce,
  },
  root: "app",
  publicDir: "../generated",
  plugins: [projectDiagnosticsFallback(), react()],
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

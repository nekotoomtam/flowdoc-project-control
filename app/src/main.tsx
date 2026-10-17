import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.js";
import "./styles/base.css";

const rootElement = document.getElementById("root");

if (rootElement === null) {
  throw new Error("The project control app root is missing.");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

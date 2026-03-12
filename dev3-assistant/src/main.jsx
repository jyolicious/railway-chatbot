import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { CascadeProvider } from "./context/CascadeContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CascadeProvider>
      <App />
    </CascadeProvider>
  </StrictMode>
);
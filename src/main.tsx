import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Toast } from "./package/components/Toast.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toast message="Hello, world!" />
  </StrictMode>,
);

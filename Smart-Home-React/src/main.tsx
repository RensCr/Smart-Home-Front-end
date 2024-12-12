import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { WebSocketProvider } from "./Websocket/websocketcontext.jsx"; // Update the import statement

createRoot(document.getElementById("root")!).render(
  <WebSocketProvider>
    <App />
  </WebSocketProvider>
);

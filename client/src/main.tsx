import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { levels } from "./constants/levelData";
import { documents } from "./constants/documentData";

// Add game data to window for static builds
if (typeof window !== 'undefined' && !window.__GAME_DATA__) {
  window.__GAME_DATA__ = {
    levels,
    documents,
    settings: {
      sound: true,
      music: true,
    },
    isStatic: true,
    created: new Date().toISOString(),
  };
}

createRoot(document.getElementById("root")!).render(
  <App />
);

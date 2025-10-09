import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AppProvider } from "./context/AppContext.jsx";
import "./index.css"; // Tailwind directives

// Disable StrictMode in dev to stop double-mount (which triggers the update-depth loops)
// You can switch this back on later once the effects causing extra setState are cleaned up.
ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <AppProvider>
    <App />
  </AppProvider>
  // </React.StrictMode>
);
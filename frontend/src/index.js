import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AppProvider } from "./content/AppContext";
import { Auth0Provider } from "@auth0/auth0-react";

// ✅ Load values from environment variables
const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
const audience = process.env.REACT_APP_AUTH0_AUDIENCE;

// ✅ FIXED: Use explicit hardcoded values instead of window.location.origin
// This is the key fix - Auth0 needs EXACT URLs it knows about
const redirectUri = (() => {
  // Local development
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    return "http://localhost:3000/callback";
  }

  // Vercel production
  if (window.location.hostname.includes("vercel.app")) {
    return `https://${window.location.hostname}/callback`;
  }

  // Fallback (shouldn't happen)
  return "http://localhost:3000/callback";
})();

console.log("Auth0 Configuration:", {
  domain,
  clientId,
  audience,
  redirectUri,
  environment: process.env.NODE_ENV,
  hostname: window.location.hostname,
  origin: window.location.origin,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri, // ✅ NOW INCLUDES /callback
        audience: audience,
      }}
      cacheLocation="localstorage"
    >
      <AppProvider>
        <App />
      </AppProvider>
    </Auth0Provider>
  </React.StrictMode>
);

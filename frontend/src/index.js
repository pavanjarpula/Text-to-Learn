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

// ✅ Construct proper redirect URI with /callback
const redirectUri =
  process.env.NODE_ENV === "production"
    ? `${window.location.origin}/callback` // Production: https://your-vercel-url.vercel.app/callback
    : "http://localhost:3000/callback"; // Development: http://localhost:3000/callback

console.log("Auth0 Configuration:", {
  domain,
  clientId,
  audience,
  redirectUri,
  environment: process.env.NODE_ENV,
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
    >
      <AppProvider>
        <App />
      </AppProvider>
    </Auth0Provider>
  </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./components/AuthContext";
import App from "./App.tsx";
import './index.css'
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <React.StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>
);
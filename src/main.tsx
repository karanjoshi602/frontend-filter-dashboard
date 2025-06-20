import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { FilterProvider } from "./context/FilterContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <FilterProvider>
      <App />
    </FilterProvider>
  </React.StrictMode>
);

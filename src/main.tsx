import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store";
import "bootstrap/dist/css/bootstrap.css";

createRoot(document.getElementById("root")!).render(
  <React.Fragment>
    {" "}
    <Provider store={store}>
      <App />
    </Provider>
  </React.Fragment>,
);

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import ReactFCCTest from "react-fcctest";

ReactDOM.render(
  <React.StrictMode>
    <App />
    <ReactFCCTest />
  </React.StrictMode>,
  document.getElementById("root")
);

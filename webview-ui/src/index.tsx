import React from "react";
import ReactDOM from "react-dom";
import "./App.css";

import VisualizeRule from "./pages/visualize-rule";
import VisualizeBus from "./pages/visualize-bus";

import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import { ExtentionContextProvider } from "./hooks/ExtensionProvider";


ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ExtentionContextProvider>
        <Routes>
          <Route path="/view-rule" element={<VisualizeRule />}></Route>
          <Route path="/view-bus" element={<VisualizeBus />}></Route>
        </Routes>
      </ExtentionContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

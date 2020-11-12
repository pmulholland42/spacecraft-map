import React from "react";
import { Provider } from "react-redux";
import { OptionsPanel } from "./components/OptionsPanel";
import { store } from "./redux/store";
import "./App.css";
import { InfoPanel } from "./components/InfoPanel";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <OptionsPanel />
        <InfoPanel />
      </div>
    </Provider>
  );
}

export default App;

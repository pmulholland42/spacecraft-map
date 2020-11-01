import React from "react";
import "./App.css";
import { Provider } from "react-redux";
import { OptionsPanel } from "./components/OptionsPanel";
import { store } from "./redux/store";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <OptionsPanel />
      </div>
    </Provider>
  );
}

export default App;

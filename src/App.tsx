import React from "react";
import { Provider } from "react-redux";
import { OptionsPanel } from "./components/OptionsPanel";
import { store } from "./redux/store";
import "./App.css";

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

import React from "react";
import { Provider } from "react-redux";
import { OptionsPanel } from "./components/OptionsPanel";
import { store } from "./redux/store";
import "./App.css";
import { InfoPanel } from "./components/InfoPanel";
import { TimeDisplay } from "./components/TimeDisplay";
import { TimeControlBar } from "./components/TimeControlBar";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <OptionsPanel />
        <InfoPanel />
        <TimeDisplay />
        <TimeControlBar />
      </div>
    </Provider>
  );
}

export default App;

import React from "react";
import { Provider } from "react-redux";
import { OptionsPanel } from "./components/widgets/OptionsPanel";
import { store } from "./redux/store";
import "./App.css";
import { InfoPanel } from "./components/widgets/InfoPanel";
import { TimeDisplay } from "./components/map/TimeDisplay";
import { TimeControlBar } from "./components/widgets/TimeControlBar";
import { Map } from "./components/map/Map";

function App() {
  return (
    <Provider store={store}>
      <div style={{ width: "100%", height: "100%" }}>
        <OptionsPanel />
        <InfoPanel />
        <TimeDisplay />
        <TimeControlBar />
        <Map />
      </div>
    </Provider>
  );
}

export default App;

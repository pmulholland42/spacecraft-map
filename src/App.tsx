import React from "react";
import { Provider } from "react-redux";
import { OptionsPanel } from "./components/ui/OptionsPanel";
import { store } from "./redux/store";
import "./App.css";
import { InfoPanel } from "./components/ui/InfoPanel";
import { TimeDisplay } from "./components/ui/TimeDisplay";
import { TimeControlBar } from "./components/ui/TimeControlBar";
import { Map } from "./components/map/Map";

function App() {
  return (
    <Provider store={store}>
      <div style={{ width: "100%", height: "100%" }}>
        <OptionsPanel initialPosition={{ x: 80, y: 100 }} />
        <InfoPanel initialPosition={{ x: 80, y: 250 }} />
        <TimeDisplay />
        <TimeControlBar initialPosition={{ x: 800, y: 995 }} />
        <Map />
      </div>
    </Provider>
  );
}

export default App;

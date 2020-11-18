import React from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import "./App.css";
import { TimeDisplay } from "./components/ui/TimeDisplay";
import { TimeControlBar } from "./components/ui/TimeControlBar";
import { Map } from "./components/map/Map";
import { LeftPanel } from "./components/ui/LeftPanel";
import { SearchBar } from "./components/ui/SearchBar";

function App() {
  return (
    <Provider store={store}>
      <div style={{ width: "100%", height: "100%" }}>
        <SearchBar />
        <TimeDisplay />
        <TimeControlBar initialPosition={{ x: 800, y: 995 }} />
        <Map />
      </div>
    </Provider>
  );
}

export default App;

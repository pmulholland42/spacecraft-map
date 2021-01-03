import React, { Suspense } from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import "./App.scss";
import { TimeControlBar } from "./components/ui/TimeControlBar";
import { Map } from "./components/map/Map";
import { SearchBar } from "./components/ui/SearchBar";
import { OptionsPane } from "./components/ui/OptionsPane";
import { DetailsPane } from "./components/ui/DetailsPane";
import { ZoomButtons } from "./components/ui/ZoomButtons";
import { DebugPanel } from "./components/ui/DebugPanel";

function App() {
  return (
    <Suspense fallback="loading i18n...">
      <Provider store={store}>
        <div style={{ width: "100%", height: "100%" }}>
          <OptionsPane />
          <DetailsPane />
          <SearchBar />
          <TimeControlBar />
          <Map />
          <ZoomButtons />
          <DebugPanel initialPosition={{ x: 1000, y: 200 }} />
        </div>
      </Provider>
    </Suspense>
  );
}

export default App;

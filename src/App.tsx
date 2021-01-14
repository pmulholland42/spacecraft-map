import "./App.scss";
import React, { Suspense } from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { TimeControlBar } from "./components/ui/time-control/TimeControlBar";
import { Map } from "./components/map/Map";
import { SearchBar } from "./components/ui/search-bar/SearchBar";
import { OptionsPane } from "./components/ui/options-pane/OptionsPane";
import { DetailsPane } from "./components/ui/details-pane/DetailsPane";
import { ZoomButtons } from "./components/ui/zoom-buttons/ZoomButtons";
import { DebugPanel } from "./components/ui/debug-panel/DebugPanel";
import { TourButton } from "./components/ui/tours/TourButton";
import { TourModal } from "./components/ui/tours/TourModal";

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
          <TourButton />
          <TourModal />
        </div>
      </Provider>
    </Suspense>
  );
}

export default App;

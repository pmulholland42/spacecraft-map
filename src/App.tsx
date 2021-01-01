import React, { Suspense, useState } from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import "./App.scss";
import { TimeControlBar } from "./components/ui/TimeControlBar";
import { Map } from "./components/map/Map";
import { SearchBar } from "./components/ui/SearchBar";
import { OptionsPane } from "./components/ui/OptionsPane";
import { DetailsPane } from "./components/ui/DetailsPane";
import { ZoomButtons } from "./components/ui/ZoomButtons";

function App() {
  const [optionsPaneOpen, setOptionsPaneOpen] = useState(false);

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
        </div>
      </Provider>
    </Suspense>
  );
}

export default App;

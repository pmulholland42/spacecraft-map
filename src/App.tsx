import React, { Suspense, useState } from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import "./App.css";
import { TimeDisplay } from "./components/ui/TimeDisplay";
import { TimeControlBar } from "./components/ui/TimeControlBar";
import { Map } from "./components/map/Map";
import { SearchBar } from "./components/ui/SearchBar";
import { OptionsPane } from "./components/ui/OptionsPane";

function App() {
  const [optionsPaneOpen, setOptionsPaneOpen] = useState(false);

  return (
    <Suspense fallback="loading i18n...">
      <Provider store={store}>
        <div style={{ width: "100%", height: "100%" }}>
          <OptionsPane isOpen={optionsPaneOpen} closeOptionsPane={() => setOptionsPaneOpen(false)} />
          <SearchBar openOptionsPane={() => setOptionsPaneOpen(true)} />
          <TimeDisplay />
          <TimeControlBar />
          <Map />
        </div>
      </Provider>
    </Suspense>
  );
}

export default App;

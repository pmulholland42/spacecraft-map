import React, { Suspense, useState } from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import "./App.css";
import { TimeDisplay } from "./components/ui/TimeDisplay";
import { TimeControlBar } from "./components/ui/TimeControlBar";
import { Map } from "./components/map/Map";
import { SearchBar } from "./components/ui/SearchBar";
import { OptionsPane } from "./components/ui/OptionsPane";
import { ResultsPane, ResultsPaneMode } from "./components/ui/ResultsPane";

function App() {
  const [optionsPaneOpen, setOptionsPaneOpen] = useState(false);
  const [resultsPaneOpen, setResultsPaneOpen] = useState(false);
  const [resultsPaneMode, setResultsPaneMode] = useState<ResultsPaneMode>("results");
  const [searchText, setSearchText] = useState("");

  return (
    <Suspense fallback="loading i18n...">
      <Provider store={store}>
        <div style={{ width: "100%", height: "100%" }}>
          <OptionsPane isOpen={optionsPaneOpen} closeOptionsPane={() => setOptionsPaneOpen(false)} />
          <ResultsPane
            isOpen={resultsPaneOpen}
            searchText={searchText}
            mode={resultsPaneMode}
            setMode={setResultsPaneMode}
          />
          <SearchBar
            onSearch={(text) => {
              setSearchText(text);
              setResultsPaneOpen(true);
              setResultsPaneMode("results");
            }}
            onClose={() => setResultsPaneOpen(false)}
            onSelect={() => {
              setResultsPaneOpen(true);
              setResultsPaneMode("details");
            }}
            onMenuClick={() => setOptionsPaneOpen(true)}
            resultsPaneOpen={resultsPaneOpen}
          />
          <TimeDisplay />
          <TimeControlBar />
          <Map />
        </div>
      </Provider>
    </Suspense>
  );
}

export default App;

import "./ResultsPane.scss";
import React from "react";
import { animated, useTransition } from "react-spring";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../redux/store";
import { setSelectedObject } from "../../redux/actionCreators";
import { SearchResults } from "./SearchResults";
import { ObjectDetails } from "./ObjectDetails";

export type ResultsPaneMode = "results" | "details";

interface ResultsPaneProps {
  /** Is this pane open? */
  isOpen: boolean;
  /** The mode (results list or object details) */
  mode: ResultsPaneMode;
  /** Sets the mode */
  setMode: (mode: ResultsPaneMode) => void;
  /** The search query */
  searchText: string;
}

const mapStateToProps = (state: RootState) => ({
  selectedObject: state.objectInfo.selectedObject,
});

const mapDispatchToProps = {
  setSelectedObject,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = ResultsPaneProps & PropsFromRedux;

export const ResultsPane = connector(
  ({ isOpen, mode, searchText, selectedObject, setSelectedObject }: Props) => {
    const transitions = useTransition(isOpen, null, {
      from: { opacity: 0 },
      enter: { opacity: 1 },
      leave: { opacity: 0 },
    });

    return (
      <div>
        {transitions.map(
          ({ item, key, props }) =>
            item && (
              <animated.div key={key} className="results-pane" style={props}>
                {mode === "results" ? (
                  <SearchResults searchText={searchText} />
                ) : (
                  selectedObject !== null && <ObjectDetails object={selectedObject} />
                )}
              </animated.div>
            )
        )}
      </div>
    );
  }
);

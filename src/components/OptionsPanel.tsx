import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { useDraggable } from "../hooks/useDraggable";
import {
  setShowOrbits,
  setShowLabels,
  setShowBackgroundStars,
  setShowDebugInfo,
} from "../redux/actionCreators";
import { RootState } from "../redux/store";

const mapStateToProps = (state: RootState) => ({
  showOrbits: state.options.showOrbits,
  showLabels: state.options.showLabels,
  showBackgroundStars: state.options.showBackgroundStars,
  showDebugInfo: state.options.showDebugInfo,
});

const mapDispatchToProps = {
  setShowOrbits,
  setShowLabels,
  setShowBackgroundStars,
  setShowDebugInfo,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const OptionsPanel = connector((props: PropsFromRedux) => {
  const [panelRef] = useDraggable();

  const toggleOrbits = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setShowOrbits(event.target.checked);
  };
  const toggleLabels = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setShowLabels(event.target.checked);
  };
  const toggleBackgroundStars = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    props.setShowBackgroundStars(event.target.checked);
  };
  const toggleDebugInfo = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setShowDebugInfo(event.target.checked);
  };

  return (
    <div className="panel" ref={panelRef}>
      <div className="grippy" />
      <h3 className="panel-header">Options</h3>
      <br />
      <input
        type="checkbox"
        onChange={toggleOrbits}
        checked={props.showOrbits}
      />
      Show orbits
      <br />
      <input
        type="checkbox"
        onChange={toggleLabels}
        checked={props.showLabels}
      />
      Show labels
      <br />
      <input
        type="checkbox"
        onChange={toggleBackgroundStars}
        checked={props.showBackgroundStars}
      />
      Show background stars
      <br />
      <input
        type="checkbox"
        onChange={toggleDebugInfo}
        checked={props.showDebugInfo}
      />
      Show debug info
      <br />
    </div>
  );
});

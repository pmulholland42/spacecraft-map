import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { useDraggable } from "../../hooks/useDraggable";
import { Coordinate } from "../../interfaces";
import {
  setShowOrbits,
  setShowLabels,
  setShowBackgroundStars,
  setShowDebugInfo,
} from "../../redux/actionCreators";
import { RootState } from "../../redux/store";

interface OptionsPanelProps {
  initialPosition: Coordinate;
}

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

type Props = PropsFromRedux & OptionsPanelProps;

export const OptionsPanel = connector(
  ({
    initialPosition,
    showOrbits,
    showLabels,
    showBackgroundStars,
    showDebugInfo,
    setShowOrbits,
    setShowLabels,
    setShowBackgroundStars,
    setShowDebugInfo,
  }: Props) => {
    const [panelRef] = useDraggable(initialPosition);

    const toggleOrbits = (event: React.ChangeEvent<HTMLInputElement>) => {
      setShowOrbits(event.target.checked);
    };
    const toggleLabels = (event: React.ChangeEvent<HTMLInputElement>) => {
      setShowLabels(event.target.checked);
    };
    const toggleBackgroundStars = (event: React.ChangeEvent<HTMLInputElement>) => {
      setShowBackgroundStars(event.target.checked);
    };
    const toggleDebugInfo = (event: React.ChangeEvent<HTMLInputElement>) => {
      setShowDebugInfo(event.target.checked);
    };

    return (
      <div className="panel" ref={panelRef}>
        <div className="grippy" />
        <h3 className="panel-header">Options</h3>
        <br />
        <input type="checkbox" onChange={toggleOrbits} checked={showOrbits} />
        Show orbits
        <br />
        <input type="checkbox" onChange={toggleLabels} checked={showLabels} />
        Show labels
        <br />
        <input type="checkbox" onChange={toggleBackgroundStars} checked={showBackgroundStars} />
        Show background stars
        <br />
        <input type="checkbox" onChange={toggleDebugInfo} checked={showDebugInfo} />
        Show debug info
        <br />
      </div>
    );
  }
);

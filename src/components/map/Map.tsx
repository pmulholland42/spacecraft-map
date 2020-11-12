import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../redux/store";

const mapStateToProps = (state: RootState) => ({
  showOrbits: state.options.showOrbits,
  showLabels: state.options.showLabels,
  showBackgroundStars: state.options.showBackgroundStars,
  showDebugInfo: state.options.showDebugInfo,
  keepCentered: state.objectInfo.keepCentered,
  displayTime: state.time.displayTime,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const Map = connector(
  ({
    showOrbits,
    showLabels,
    showBackgroundStars,
    showDebugInfo,
    keepCentered,
    displayTime,
  }: PropsFromRedux) => {
    return <div className="ellipse"></div>;
  }
);

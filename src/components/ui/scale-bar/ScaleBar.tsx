import "./ScaleBar.scss";
import { RootState } from "../../../redux/store";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { toScreenDistance, toSpaceDistance } from "../../../utilities";

/** Possible distances for the scale bar to show, in km */
const distances = [
  100,
  200,
  500,
  1000,
  2000,
  5000,
  10000,
  20000,
  50000,
  100000,
  250000,
  500000,
  1000000,
  2000000,
  5000000,
  10000000,
  20000000,
  50000000,
  100000000,
  200000000,
  500000000,
  1000000000,
  2000000000,
];

const maxScaleBarWidth = 200;

const mapStateToProps = (state: RootState) => ({
  zoom: state.map.zoom,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const ScaleBar = connector(({ zoom }: PropsFromRedux) => {
  let distance = 0;
  let maxSpaceDistance = toSpaceDistance(maxScaleBarWidth, zoom);

  for (let i = 0; i < distances.length; i++) {
    distance = distances[i];
    if (distance > maxSpaceDistance) {
      distance = distances[i - 1];
      break;
    }
  }

  return (
    <div className="scale-bar-container">
      <div className="scale-bar-label">{distance.toLocaleString()} km</div>
      <div className="scale-bar" style={{ width: toScreenDistance(distance, zoom) }}></div>
    </div>
  );
});

import "./TextBubble.scss";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { Coordinate } from "../../../interfaces";
import { RootState } from "../../../redux/store";
import { toScreenCoords } from "../../../utilities";

interface TextBubbleProps {
  /** Coordinates in space where the text bubble should point at (km) */
  location: Coordinate;
  /** Text to display */
  text: string;
}

const mapStateToProps = (state: RootState) => ({
  screenCenter: state.map.screenCenter,
  zoom: state.map.zoom,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = TextBubbleProps & PropsFromRedux;

export const TextBubble = connector(({ location, text, screenCenter, zoom }: Props) => {
  const screenCoords = toScreenCoords(location, zoom, screenCenter);

  return (
    <div className="text-bubble" style={{ top: screenCoords.y, left: screenCoords.x }}>
      {text}
    </div>
  );
});

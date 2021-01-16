import "./TextBubble.scss";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { AstronomicalObject } from "../../../interfaces";
import { RootState } from "../../../redux/store";
import { getObjectCoordinates, toScreenCoords, toScreenDistance } from "../../../utilities";

interface TextBubbleProps {
  /** The object to put the text bubble over */
  object: AstronomicalObject;
  /** Text to display */
  text: string;
}

const mapStateToProps = (state: RootState) => ({
  screenCenter: state.map.screenCenter,
  zoom: state.map.zoom,
  displayTime: state.time.displayTime,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = TextBubbleProps & PropsFromRedux;

export const TextBubble = connector(({ object, text, screenCenter, zoom, displayTime }: Props) => {
  const objectCoords = getObjectCoordinates(object, displayTime);
  const screenCoords = toScreenCoords(objectCoords, zoom, screenCenter);
  const yOffset = toScreenDistance(object.diameter / 2, zoom) + 5;

  return (
    <div className="text-bubble" style={{ top: screenCoords.y - yOffset, left: screenCoords.x }}>
      {text}
    </div>
  );
});

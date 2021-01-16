import "./TextBubble.scss";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { AstronomicalObject } from "../../../interfaces";
import { RootState } from "../../../redux/store";
import { getObjectCoordinates, toScreenCoords, toScreenDistance } from "../../../utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

interface TextBubbleProps {
  /** The object to put the text bubble over */
  object: AstronomicalObject;
  /** Text to display */
  text: string;
  /** Text to show as a clickable prompt. If undefined, no prompt will be shown. */
  promptText?: string;
  /** Function to be called when the prompt is clicked (optional) */
  onPromptClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const mapStateToProps = (state: RootState) => ({
  screenCenter: state.map.screenCenter,
  zoom: state.map.zoom,
  displayTime: state.time.displayTime,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = TextBubbleProps & PropsFromRedux;

export const TextBubble = connector(
  ({ object, text, promptText, onPromptClick, screenCenter, zoom, displayTime }: Props) => {
    const objectCoords = getObjectCoordinates(object, displayTime);
    const screenCoords = toScreenCoords(objectCoords, zoom, screenCenter);
    const yOffset = toScreenDistance(object.diameter / 2, zoom) + 5;

    return (
      <div className="text-bubble" style={{ top: screenCoords.y - yOffset, left: screenCoords.x }}>
        {text}
        {promptText !== undefined && (
          <button className="prompt-button" onClick={onPromptClick}>
            {promptText}
            <div className="prompt-button-icon">
              <FontAwesomeIcon icon={faArrowRight} size={"sm"} color={"black"} />
            </div>
          </button>
        )}
      </div>
    );
  }
);

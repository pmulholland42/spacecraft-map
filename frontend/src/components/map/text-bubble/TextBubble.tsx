import "./TextBubble.scss";
import React, { CSSProperties } from "react";
import { connect, ConnectedProps } from "react-redux";
import { Coordinate } from "../../../interfaces";
import { RootState } from "../../../redux/store";
import { toScreenCoords } from "../../../utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

interface TextBubbleProps {
  /** The space coords (km) to center the text bubble on. If undefined, text bubble will be shown in the top right */
  coords?: Coordinate;
  /** Text to display */
  text: string;
  /** Text to show as a clickable prompt. If undefined, no prompt will be shown. */
  promptText?: string;
  /** Function to be called when the prompt is clicked (optional) */
  onPromptClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  yOffset?: number;
  relativeCenter?: Coordinate;
}

const mapStateToProps = (state: RootState) => ({
  screenCenter: state.map.screenCenter,
  zoom: state.map.zoom,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = TextBubbleProps & PropsFromRedux;

export const TextBubble = connector(
  ({ coords, text, promptText, onPromptClick, screenCenter, zoom, yOffset, relativeCenter }: Props) => {
    let style: CSSProperties | undefined = undefined;
    if (coords !== undefined) {
      const screenCoords = toScreenCoords(coords, zoom, relativeCenter ?? screenCenter);
      style = { top: screenCoords.y - (yOffset ?? 0), left: screenCoords.x };
    }

    return (
      <div className={coords === undefined ? "no-object-text-bubble" : "object-text-bubble"} style={style}>
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

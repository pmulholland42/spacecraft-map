import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { useDraggable } from "../../hooks/useDraggable";
import { RootState } from "../../redux/store";
import { setDisplayTime } from "../../redux/actionCreators";
import useInterval from "use-interval";
import { oneDay } from "../../constants";
import { Coordinate } from "../../interfaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause, faFastForward, faFastBackward, faClock } from "@fortawesome/free-solid-svg-icons";
import "./TimeControlBar.css";

export interface TimeControlBarProps {
  initialPosition: Coordinate;
}

const mapStateToProps = (state: RootState) => ({
  displayTime: state.time.displayTime,
});

const mapDispatchToProps = {
  setDisplayTime,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = TimeControlBarProps & PropsFromRedux;

export const TimeControlBar = connector(({ initialPosition, displayTime, setDisplayTime }: Props) => {
  const [panelRef] = useDraggable(initialPosition);
  const [timeSpeed, setTimeSpeed] = useState(0);

  useInterval(() => {
    let newTime = new Date(displayTime.getTime() + timeSpeed);
    setDisplayTime(newTime);
  }, 100);

  const resetTime = () => {
    pauseTime();
    setDisplayTime(new Date());
  };

  const reverseTime = () => {
    setTimeSpeed(Math.min(-oneDay, timeSpeed - oneDay));
  };

  const pauseTime = () => {
    setTimeSpeed(0);
  };

  const fastForwardTime = () => {
    setTimeSpeed(Math.max(oneDay, timeSpeed + oneDay));
  };

  // TODO: replace this with a slider of some sort, or at least use icons instead of text for the buttons
  return (
    <div className="panel" ref={panelRef}>
      <button type="button" onClick={resetTime} className="time-control-button">
        <FontAwesomeIcon icon={faClock} size={"lg"} />
      </button>
      <button type="button" onClick={reverseTime} className="time-control-button">
        <FontAwesomeIcon icon={faFastBackward} size={"lg"} />
      </button>
      <button type="button" onClick={pauseTime} className="time-control-button">
        <FontAwesomeIcon icon={faPause} size={"lg"} />
      </button>
      <button type="button" onClick={fastForwardTime} className="time-control-button">
        <FontAwesomeIcon icon={faFastForward} size={"lg"} />
      </button>
    </div>
  );
});

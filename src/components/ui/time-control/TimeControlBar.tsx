import "./TimeControlBar.scss";
import "react-datepicker/dist/react-datepicker.css";
import { oneSecond, timeSteps } from "../../../constants";
import { RootState } from "../../../redux/store";
import {
  setDisplayTime,
  incrementTimeStepIndex,
  decrementTimeStepIndex,
  pauseTime,
} from "../../../redux/actionCreators";
import React, { useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import useInterval from "use-interval";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause, faFastForward, faFastBackward, faClock } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import { getPausedTimeStepIndex } from "../../../utilities";

const interval = 100;

const mapStateToProps = (state: RootState) => ({
  displayTime: state.time.displayTime,
  timeStepIndex: state.time.timeStepIndex,
});

const mapDispatchToProps = {
  setDisplayTime,
  incrementTimeStepIndex,
  decrementTimeStepIndex,
  pauseTime,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const TimeControlBar = connector(
  ({
    displayTime,
    setDisplayTime,
    timeStepIndex,
    incrementTimeStepIndex,
    decrementTimeStepIndex,
    pauseTime,
  }: PropsFromRedux) => {
    const pausedTimeStepIndex = getPausedTimeStepIndex(timeSteps);
    const [timeStep, setTimeStep] = useState(0);
    const [showTimeStepBubble, setShowTimeStepBubble] = useState(false);

    useEffect(() => {
      setTimeStep(timeSteps[timeStepIndex].value);
    }, [timeStepIndex, setTimeStep]);

    useEffect(() => {
      // When the user clicks the fast forward or backward button, the time step bubble is briefly displayed
      setShowTimeStepBubble(true);
      const timeout = setTimeout(() => setShowTimeStepBubble(false), 1000);

      return () => {
        clearTimeout(timeout);
      };
    }, [timeStepIndex]);

    const { t } = useTranslation();

    useInterval(() => {
      const newTime = new Date(displayTime.getTime() + timeStep * (interval / oneSecond));
      setDisplayTime(newTime);
    }, interval);

    const resetTime = () => {
      pauseTime();
      setDisplayTime(new Date());
    };

    const fastBackwardDisabled = timeStepIndex === 0;
    const fastForwardDisabled = timeStepIndex === timeSteps.length - 1;
    const pauseDisabled = timeStepIndex === pausedTimeStepIndex;

    return (
      <div className="time-control-container">
        {showTimeStepBubble && <div className="time-step-bubble">{t(timeSteps[timeStepIndex].label)}</div>}

        <div className="time-control-bar">
          <button type="button" onClick={resetTime} className="time-control-button">
            <FontAwesomeIcon icon={faClock} size={"lg"} color={"white"} />
          </button>

          <button
            type="button"
            onClick={decrementTimeStepIndex}
            className="time-control-button"
            disabled={fastBackwardDisabled}
          >
            <FontAwesomeIcon
              icon={faFastBackward}
              size={"lg"}
              color={fastBackwardDisabled ? "grey" : "white"}
            />
          </button>

          <div className="time-picker">
            <DatePicker
              selected={displayTime}
              onChange={setDisplayTime}
              showTimeInput
              dateFormat="M/dd/yyyy h:mm a"
            />
          </div>

          <button
            type="button"
            onClick={incrementTimeStepIndex}
            className="time-control-button"
            disabled={fastForwardDisabled}
          >
            <FontAwesomeIcon
              icon={faFastForward}
              size={"lg"}
              color={fastForwardDisabled ? "grey" : "white"}
            />
          </button>

          <button type="button" onClick={pauseTime} className="time-control-button" disabled={pauseDisabled}>
            <FontAwesomeIcon icon={faPause} size={"lg"} color={pauseDisabled ? "grey" : "white"} />
          </button>
        </div>
      </div>
    );
  }
);

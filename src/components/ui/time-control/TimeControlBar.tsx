import "./TimeControlBar.scss";
import "react-datepicker/dist/react-datepicker.css";
import { oneSecond, oneDay, oneYear } from "../../../constants";
import { RootState } from "../../../redux/store";
import { setDisplayTime } from "../../../redux/actionCreators";
import React, { useEffect, useRef, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import useInterval from "use-interval";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause, faFastForward, faFastBackward, faClock } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";

interface TimeStep {
  /** Display label for the time step */
  label: string;
  /** The number of milliseconds to step per second */
  value: number;
}

const timeSteps: TimeStep[] = [
  { label: "timeSteps.negativeTenYears", value: -oneYear * 10 },
  { label: "timeSteps.negativeOneYear", value: -oneYear },
  { label: "timeSteps.negativeThirtyDays", value: -oneDay * 30 },
  { label: "timeSteps.negativeOneDay", value: -oneDay },
  { label: "timeSteps.paused", value: 0 },
  { label: "timeSteps.oneDay", value: oneDay },
  { label: "timeSteps.thirtyDays", value: oneDay * 30 },
  { label: "timeSteps.oneYear", value: oneYear },
  { label: "timeSteps.tenYears", value: oneYear * 10 },
];

/**
 * Get the index of the time step with value 0
 */
const getPausedTimeStepIndex = () => {
  let index = timeSteps.findIndex((step) => step.value === 0);
  if (index === -1) {
    index = 0;
  }
  return index;
};

const interval = 100;

const mapStateToProps = (state: RootState) => ({
  displayTime: state.time.displayTime,
});

const mapDispatchToProps = {
  setDisplayTime,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const TimeControlBar = connector(({ displayTime, setDisplayTime }: PropsFromRedux) => {
  const pausedTimeStepIndex = getPausedTimeStepIndex();
  const [timeStepIndex, setTimeStepIndex] = useState(pausedTimeStepIndex);
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
    setTimeStepIndex(getPausedTimeStepIndex());
    setDisplayTime(new Date());
  };

  const decrementTimeStep = () => {
    setTimeStepIndex((index) => Math.max(index - 1, 0));
  };

  const incrementTimeStep = () => {
    setTimeStepIndex((index) => Math.min(index + 1, timeSteps.length - 1));
  };

  const pauseTime = () => {
    setTimeStepIndex(getPausedTimeStepIndex());
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
          onClick={decrementTimeStep}
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
          onClick={incrementTimeStep}
          className="time-control-button"
          disabled={fastForwardDisabled}
        >
          <FontAwesomeIcon icon={faFastForward} size={"lg"} color={fastForwardDisabled ? "grey" : "white"} />
        </button>

        <button type="button" onClick={pauseTime} className="time-control-button" disabled={pauseDisabled}>
          <FontAwesomeIcon icon={faPause} size={"lg"} color={pauseDisabled ? "grey" : "white"} />
        </button>
      </div>
    </div>
  );
});

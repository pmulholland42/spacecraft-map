import "./TimeControlBar.scss";
import { oneSecond, oneDay, oneYear } from "../../constants";
import { RootState } from "../../redux/store";
import { setDisplayTime } from "../../redux/actionCreators";
import React, { useEffect, useRef, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import useInterval from "use-interval";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause, faFastForward, faFastBackward, faClock } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

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
  const [timeStepIndex, setTimeStepIndex] = useState(getPausedTimeStepIndex());
  const [timeStep, setTimeStep] = useState(0);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setTimeStep(timeSteps[timeStepIndex].value);
  }, [timeStepIndex, setTimeStep]);

  useEffect(() => {
    function stopDraggingSlider() {
      setIsDraggingSlider(false);
    }
    window.addEventListener("mouseup", stopDraggingSlider);
    window.addEventListener("blur", stopDraggingSlider);

    return () => {
      window.removeEventListener("mouseup", stopDraggingSlider);
      window.removeEventListener("blur", stopDraggingSlider);
    };
  }, [setIsDraggingSlider]);

  const { t } = useTranslation();

  useInterval(() => {
    let newTime = new Date(displayTime.getTime() + timeStep * (interval / oneSecond));
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

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTimeStepIndex(parseInt(event.target.value));
  };

  const onInputMouseDown = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    setIsDraggingSlider(true);
  };

  let valueBubbleBottom: number | undefined;
  let valueBubbleLeft: number | undefined;

  if (inputRef.current !== null) {
    const inputRect = inputRef.current.getBoundingClientRect();

    valueBubbleBottom = window.innerHeight - inputRect.y;
    // TODO: style the input slider and use the real width of the thumb in this calculation
    valueBubbleLeft =
      inputRef.current.offsetLeft + (inputRect.width + 15) * (timeStepIndex / timeSteps.length);
  }

  return (
    <div className="time-control-bar">
      <button type="button" onClick={resetTime} className="time-control-button">
        <FontAwesomeIcon icon={faClock} size={"lg"} color={"white"} />
      </button>
      <button type="button" onClick={decrementTimeStep} className="time-control-button">
        <FontAwesomeIcon icon={faFastBackward} size={"lg"} color={"white"} />
      </button>

      <input
        className="input-slider"
        type="range"
        min={0}
        max={timeSteps.length - 1}
        step={1}
        value={timeStepIndex}
        onChange={onInputChange}
        onMouseDown={onInputMouseDown}
        ref={inputRef}
        style={{
          // This css only works in js for some reason... need to investigate later
          background: "black"
        }}
      />

      {isDraggingSlider && (
        <div className="time-value-bubble" style={{ bottom: valueBubbleBottom, left: valueBubbleLeft }}>
          {t(timeSteps[timeStepIndex].label)}
        </div>
      )}

      <button type="button" onClick={incrementTimeStep} className="time-control-button">
        <FontAwesomeIcon icon={faFastForward} size={"lg"} color={"white"} />
      </button>

      <button type="button" onClick={pauseTime} className="time-control-button">
        <FontAwesomeIcon icon={faPause} size={"lg"} color={"white"} />
      </button>
    </div>
  );
});

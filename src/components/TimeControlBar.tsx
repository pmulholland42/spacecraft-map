import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { useDraggable } from "../hooks/useDraggable";
import { RootState } from "../redux/store";
import { setDisplayTime } from "../redux/actionCreators";
import useInterval from "use-interval";
import "./InfoPanel.css";

const oneDay = 86400000;

const mapStateToProps = (state: RootState) => ({
  displayTime: state.time.displayTime,
});

const mapDispatchToProps = {
  setDisplayTime,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const TimeControlBar = connector(
  ({ displayTime, setDisplayTime }: PropsFromRedux) => {
    const [panelRef] = useDraggable();
    const [timeSpeed, setTimeSpeed] = useState(0);

    useInterval(() => {
      let newTime = new Date(displayTime.getTime() + timeSpeed);
      setDisplayTime(newTime);
    }, 200);

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
        <button type="button" onClick={resetTime}>
          Current Time
        </button>
        <button type="button" onClick={reverseTime}>
          Reverse
        </button>
        <button type="button" onClick={pauseTime}>
          Pause
        </button>
        <button type="button" onClick={fastForwardTime}>
          Fast forward
        </button>
      </div>
    );
  }
);

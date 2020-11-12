import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../redux/store";
import "./TimeDisplay.css";

const mapStateToProps = (state: RootState) => ({
  displayTime: state.time.displayTime,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const dateOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

const locale = "en-US";

export const TimeDisplay = connector((props: PropsFromRedux) => {
  return (
    <div className="time-display">
      {props.displayTime.toLocaleDateString(locale, dateOptions)}
    </div>
  );
});

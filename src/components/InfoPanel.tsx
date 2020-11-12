import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { useDraggable } from "../hooks/useDraggable";
import { RootState } from "../redux/store";
import { setKeepCentered } from "../redux/actionCreators";
import "./InfoPanel.css";

const mapStateToProps = (state: RootState) => ({
  keepCentered: state.objectInfo.keepCentered,
});

const mapDispatchToProps = {
  setKeepCentered,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const InfoPanel = connector((props: PropsFromRedux) => {
  const [panelRef] = useDraggable();

  const toggleKeepCentered = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setKeepCentered(event.target.checked);
  };

  return (
    <div className="panel" ref={panelRef}>
      <div className="grippy"></div>
      <h3 className="panel-header">No planet selected</h3>
      <br />
      <input
        type="checkbox"
        onChange={toggleKeepCentered}
        checked={props.keepCentered}
      />
      Keep centered
      <br />
      <br />
      <a
        href="https://en.wikipedia.org/wiki/Mercury_(planet)"
        target="_blank"
        rel="noreferrer"
      >
        Wikipedia
      </a>
      <p className="planet-info"></p>
    </div>
  );
});

import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { useDraggable } from "../../../hooks/useDraggable";
import { RootState } from "../../../redux/store";
import { setKeepCentered } from "../../../redux/actionCreators";
import "./InfoPanel.scss";
import { Coordinate } from "../../../interfaces";

interface InfoPanelProps {
  initialPosition: Coordinate;
}

const mapStateToProps = (state: RootState) => ({
  keepCentered: state.objectInfo.keepCentered,
});

const mapDispatchToProps = {
  setKeepCentered,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = InfoPanelProps & PropsFromRedux;

export const InfoPanel = connector(({ initialPosition, keepCentered, setKeepCentered }: Props) => {
  const [panelRef] = useDraggable(initialPosition);

  const toggleKeepCentered = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeepCentered(event.target.checked);
  };

  return (
    <div className="panel" ref={panelRef}>
      <div className="grippy"></div>
      <h3 className="panel-header">No planet selected</h3>
      <br />
      <input type="checkbox" onChange={toggleKeepCentered} checked={keepCentered} />
      Keep centered
      <br />
      <br />
      <a href="https://en.wikipedia.org/wiki/Mercury_(planet)" target="_blank" rel="noreferrer">
        Wikipedia
      </a>
      <p className="planet-info"></p>
    </div>
  );
});

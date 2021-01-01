import "./ZoomButtons.scss";
import React from "react";
import { setZoom } from "../../redux/actionCreators";
import { connect, ConnectedProps } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import { RootState } from "../../redux/store";

const mapStateToProps = (state: RootState) => ({
  zoom: state.map.zoom,
});

const mapDispatchToProps = {
  setZoom,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const ZoomButtons = connector(({ zoom, setZoom }: PropsFromRedux) => {
  const zoomIn = () => {
    setZoom(zoom * 1.2);
  };

  const zoomOut = () => {
    setZoom(zoom * 0.8);
  };

  const fitToSolarSystem = () => {
    setZoom(0.6);
  };

  return (
    <div className="button-column">
      <button type="button" onClick={zoomIn} className="zoom-button">
        <FontAwesomeIcon icon={faPlus} size={"lg"} color={"black"} />
      </button>
      <button type="button" onClick={zoomOut} className="zoom-button">
        <FontAwesomeIcon icon={faMinus} size={"lg"} color={"black"} />
      </button>
      <button type="button" onClick={fitToSolarSystem} className="zoom-button">
        <FontAwesomeIcon icon={faCircle} size={"lg"} color={"black"} />
      </button>
    </div>
  );
});

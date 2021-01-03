import "./ZoomButtons.scss";
import React from "react";
import { setZoom } from "../../redux/actionCreators";
import { connect, ConnectedProps } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import { RootState } from "../../redux/store";
import { animateZoom, animatePan } from "../../utilities/animations";

const mapStateToProps = (state: RootState) => ({
  zoom: state.map.zoom,
  keepCentered: state.objectInfo.keepCentered,
});

const mapDispatchToProps = {
  setZoom,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const ZoomButtons = connector(({ zoom, keepCentered }: PropsFromRedux) => {
  const zoomIn = () => {
    animateZoom(zoom * 1.5, 500);
  };

  const zoomOut = () => {
    animateZoom(zoom / 1.5, 500);
  };

  const fitToSolarSystem = async () => {
    await animateZoom(0.6, 1000);
    if (!keepCentered) {
      await animatePan({ x: 0, y: 0 }, 1000);
    }
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

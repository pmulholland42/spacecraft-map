import "./ZoomButtons.scss";
import React from "react";
import { setZoom } from "../../../redux/actionCreators";
import { connect, ConnectedProps } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import { RootState } from "../../../redux/store";
import { animateZoom, animatePan } from "../../../utilities/animations";
import { maxZoomLevel, minZoomLevel } from "../../../constants";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const zoomIn = () => {
    animateZoom(Math.min(zoom + 1, maxZoomLevel), 500);
  };

  const zoomOut = () => {
    animateZoom(Math.max(zoom - 1, minZoomLevel), 500);
  };

  const fitToSolarSystem = async () => {
    await animateZoom(minZoomLevel, 1000);
    if (!keepCentered) {
      await animatePan({ x: 0, y: 0 }, 1000);
    }
  };

  return (
    <div className="button-column">
      <button type="button" onClick={zoomIn} className="zoom-button" title={t("zoomIn")}>
        <FontAwesomeIcon icon={faPlus} size={"lg"} color={"black"} />
      </button>
      <button type="button" onClick={zoomOut} className="zoom-button" title={t("zoomOut")}>
        <FontAwesomeIcon icon={faMinus} size={"lg"} color={"black"} />
      </button>
      <button type="button" onClick={fitToSolarSystem} className="zoom-button" title={t("fitToSolarSystem")}>
        <FontAwesomeIcon icon={faCircle} size={"lg"} color={"black"} />
      </button>
    </div>
  );
});

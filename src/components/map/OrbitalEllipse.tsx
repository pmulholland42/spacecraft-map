import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { kmPerAU, maxWidthDistance } from "../../constants";
import { RootState } from "../../redux/store";
import { toRadians } from "../../utilities";

interface OrbitalEllipseProps {
  parentX: number;
  parentY: number;
  distanceFromCenterToFocus: number;
  longitudeOfPeriapsis: number;
  semiMajorAxis: number;
  semiMinorAxis: number;
}

const mapStateToProps = (state: RootState) => ({
  screenCenter: state.map.screenCenter,
  zoom: state.map.zoom,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = OrbitalEllipseProps & PropsFromRedux;

export const OrbitalEllipse = connector(
  ({
    parentX,
    parentY,
    distanceFromCenterToFocus,
    longitudeOfPeriapsis,
    semiMajorAxis,
    semiMinorAxis,
    screenCenter,
    zoom,
  }: Props) => {
    const kmPerPixel = maxWidthDistance / window.innerWidth; // Kilometers per pixel when zoomed out all the way

    const scaleFactor = zoom / kmPerPixel;
    const x =
      (parentX -
        screenCenter.x -
        distanceFromCenterToFocus * kmPerAU * Math.cos(toRadians(longitudeOfPeriapsis))) *
        scaleFactor +
      window.screen.width / 2;
    const y =
      (parentY -
        screenCenter.y +
        distanceFromCenterToFocus * kmPerAU * Math.sin(toRadians(longitudeOfPeriapsis))) *
        scaleFactor +
      window.screen.height / 2;
    const radiusX = semiMajorAxis * scaleFactor * kmPerAU;
    const radiusY = semiMinorAxis * scaleFactor * kmPerAU;
    const rotation = -longitudeOfPeriapsis;

    return (
      <div
        style={{
          borderWidth: 1,
          border: "1px solid white",
          width: radiusX,
          height: radiusY,
          top: y,
          left: x,
          rotate: rotation + "deg",
          borderRadius: "50%",
          position: "absolute",
        }}
      ></div>
    );
  }
);

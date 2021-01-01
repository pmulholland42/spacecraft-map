import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { Coordinate } from "../../interfaces";
import { RootState } from "../../redux/store";
import { auToKm, toScreenCoords, toScreenDistance } from "../../utilities";

interface OrbitalEllipseProps {
  /** The name of the object */
  name?: string;
  /** The coordinates of the orbit's parent in space (km) */
  parentCoords: Coordinate;
  /** The distance from the center of the orbit to its focal point (AU) */
  distanceFromCenterToFocus: number;
  /** The longitude of periapsis (degrees) */
  longitudeOfPeriapsis: number;
  /** The semi-major axis of the orbit (AU) */
  semiMajorAxis: number;
  /** The semi-minor axis of the orbit (AU) */
  semiMinorAxis: number;
}

const mapStateToProps = (state: RootState) => ({
  screenCenter: state.map.screenCenter,
  zoom: state.map.zoom,
  showOrbits: state.options.showOrbits,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = OrbitalEllipseProps & PropsFromRedux;

export const OrbitalEllipse = connector(
  ({
    name,
    parentCoords,
    distanceFromCenterToFocus,
    longitudeOfPeriapsis,
    semiMajorAxis,
    semiMinorAxis,
    screenCenter,
    zoom,
  }: Props) => {
    const x = parentCoords.x - auToKm(semiMajorAxis - distanceFromCenterToFocus);
    const y = parentCoords.y - auToKm(semiMinorAxis);
    const screenCoords = toScreenCoords({ x, y }, zoom, screenCenter);
    const radiusX = toScreenDistance(auToKm(semiMajorAxis), zoom);
    const radiusY = toScreenDistance(auToKm(semiMinorAxis), zoom);
    const rotation = 180 - longitudeOfPeriapsis;

    const horizontalOffset = toScreenDistance(auToKm(semiMajorAxis - distanceFromCenterToFocus), zoom);
    const verticalOffset = toScreenDistance(auToKm(semiMinorAxis), zoom);

    if (radiusX > window.innerWidth * 2 || radiusX < 1) {
      return (
        <div
          id={`${name}-orbit`}
          style={{
            display: "none",
          }}
        ></div>
      );
    }
    return (
      <div
        id={`${name}-orbit`}
        style={{
          borderWidth: 1,
          border: "1px solid #404040",
          width: radiusX * 2,
          height: radiusY * 2,
          top: screenCoords.y,
          left: screenCoords.x,
          borderRadius: "50%",
          position: "absolute",
          transform: `rotate(${rotation}deg)`,
          transformOrigin: `${horizontalOffset}px ${verticalOffset}px`,
        }}
      ></div>
    );
  }
);

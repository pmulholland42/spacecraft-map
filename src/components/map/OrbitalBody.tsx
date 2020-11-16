import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { minPlanetSize } from "../../constants";
import { AstronomicalObject, Coordinate } from "../../interfaces";
import { RootState } from "../../redux/store";
import { toScreenCoords, toScreenDistance } from "../../utilities";

interface OrbitalBodyProps {
  /** The object */
  object: AstronomicalObject;
  /** The coordinates of the object in space (km) */
  coords: Coordinate;
}

const mapStateToProps = (state: RootState) => ({
  screenCenter: state.map.screenCenter,
  zoom: state.map.zoom,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = OrbitalBodyProps & PropsFromRedux;

export const OrbitalBody = connector(({ object, coords, screenCenter, zoom }: Props) => {
  const screenCoords = toScreenCoords(coords, zoom, screenCenter);
  const diameter = toScreenDistance(object.diameter, zoom);

  return diameter > minPlanetSize ? (
    <img
      id={`${object.id}`}
      src={`images/${object.image}`}
      alt={object.id}
      style={{
        height: `${diameter}px`,
        width: `${diameter}px`,
        position: "absolute",
        top: screenCoords.y,
        left: screenCoords.x,
        translate: "-50% -50%",
        pointerEvents: "none",
      }}
    />
  ) : (
    <div
      id={`${object.id}`}
      style={{
        width: minPlanetSize,
        height: minPlanetSize,
        position: "absolute",
        top: screenCoords.y,
        left: screenCoords.x,
        translate: "-50% -50%",
        backgroundColor: object.color,
      }}
    />
  );
});

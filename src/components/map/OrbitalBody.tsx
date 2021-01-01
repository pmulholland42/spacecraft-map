import "./OrbitalBody.scss";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { minPlanetSize } from "../../constants";
import { AstronomicalObject, Coordinate } from "../../interfaces";
import { RootState } from "../../redux/store";
import { setSelectedObject, setDetailsPaneOpen } from "../../redux/actionCreators";
import { toScreenCoords, toScreenDistance } from "../../utilities";
import { Label } from "./Label";

interface OrbitalBodyProps {
  /** The object */
  object: AstronomicalObject;
  /** The coordinates of the object in space (km) */
  coords: Coordinate;
}

const mapStateToProps = (state: RootState) => ({
  screenCenter: state.map.screenCenter,
  zoom: state.map.zoom,
  showLabels: state.options.showLabels,
});

const mapDispatchToProps = {
  setSelectedObject,
  setDetailsPaneOpen,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = OrbitalBodyProps & PropsFromRedux;

export const OrbitalBody = connector(
  ({ object, coords, screenCenter, zoom, setSelectedObject, setDetailsPaneOpen, showLabels }: Props) => {
    const screenCoords = toScreenCoords(coords, zoom, screenCenter);
    const diameter = toScreenDistance(object.diameter, zoom);

    // Right now there are only two css classes, planet and moon.
    // We only need to differentiate between "big" and "small" things
    // so that the bigger one can have a higher z-index and be shown in front when zoomed out.
    // In the future, more specific styles for stars, dwarfs, etc. could be added if needed.
    let className: string;
    if (object.type === "planet" || object.type === "star") {
      className = "planet-container";
    } else {
      className = "moon-container";
    }

    let showLabel = false;
    if (showLabels) {
      if (object.type === "moon") {
        showLabel = diameter > 0.1;
      } else if (object.type === "planet" || object.type === "dwarf") {
        const innerPlanets = ["mercury", "venus", "earth", "mars"];
        if (innerPlanets.includes(object.id)) {
          showLabel = zoom > 3;
        } else {
          showLabel = true;
        }
      } else if (object.type === "star") {
        showLabel = zoom > 7;
      }
    }

    const onClick = () => {
      setSelectedObject(object);
      setDetailsPaneOpen(true);
    };

    return (
      <div
        className={className}
        style={{
          top: screenCoords.y,
          left: screenCoords.x,
        }}
        onClick={onClick}
      >
        {diameter > minPlanetSize ? (
          <img
            id={`${object.id}`}
            src={`images/${object.image}`}
            alt=""
            style={{
              height: `${diameter}px`,
              width: `${diameter}px`,
            }}
            className="orbital-body"
          />
        ) : (
          <div
            id={`${object.id}`}
            style={{
              width: minPlanetSize,
              height: minPlanetSize,

              backgroundColor: object.color,
            }}
            onClick={onClick}
            className="orbital-body"
          />
        )}
        {showLabel && <Label objectId={object.id} />}
      </div>
    );
  }
);

import "./OrbitalSpacecraft.scss";
import React from "react";
import { Coordinate, Spacecraft } from "../../../interfaces";
import { RootState } from "../../../redux/store";
import { setDetailsPaneOpen, setSelectedObject } from "../../../redux/actionCreators";
import { connect, ConnectedProps } from "react-redux";
import { animatePan, getImagePath, toScreenCoords } from "../../../utilities";
import { Label } from "../label/Label";

interface OrbitalSpacecraftProps {
  spacecraft: Spacecraft;
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

type Props = OrbitalSpacecraftProps & PropsFromRedux;

export const OrbitalSpacecraft = connector(
  ({ spacecraft, coords, screenCenter, zoom, setSelectedObject, setDetailsPaneOpen, showLabels }: Props) => {
    const screenCoords = toScreenCoords(coords, zoom, screenCenter);
    const showLabel = showLabels && zoom > 10;
    const onClick = () => {
      //setSelectedObject(object);
      animatePan(coords);
      setDetailsPaneOpen(true);
    };

    return (
      <div
        className={"orbital-spacecraft-container"}
        style={{
          top: screenCoords.y,
          left: screenCoords.x,
        }}
        id={`${spacecraft.id}-container`}
      >
        <img
          id={`${spacecraft.id}`}
          src={getImagePath(spacecraft.sprite)}
          alt=""
          className="orbital-spacecraft"
          onClick={onClick}
        />
        {showLabel && <Label objectId={spacecraft.id} onClick={onClick} />}
      </div>
    );
  }
);

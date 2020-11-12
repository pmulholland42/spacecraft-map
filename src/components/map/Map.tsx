import React, { useRef, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../redux/store";
import { setZoom, setScreenCenter } from "../../redux/actionCreators";
import { OrbitalEllipse } from "./OrbitalEllipse";
import { toSpaceCoords } from "../../utilities";
import { Coordinate } from "../../interfaces/Coordinate";
import { maxWidthDistance } from "../../constants";

const mapStateToProps = (state: RootState) => ({
  showOrbits: state.options.showOrbits,
  showLabels: state.options.showLabels,
  showBackgroundStars: state.options.showBackgroundStars,
  showDebugInfo: state.options.showDebugInfo,
  keepCentered: state.objectInfo.keepCentered,
  displayTime: state.time.displayTime,
  zoom: state.map.zoom,
  screenCenter: state.map.screenCenter,
});

const mapDispatchToProps = {
  setZoom,
  setScreenCenter,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

/**
 * The map takes up the entire screen, and is responsible for rendering all orbits, planets, etc.
 * It also handles zooming and panning.
 */
export const Map = connector(
  ({
    showOrbits,
    showLabels,
    showBackgroundStars,
    showDebugInfo,
    keepCentered,
    displayTime,
    zoom,
    screenCenter,
    setZoom,
    setScreenCenter,
  }: PropsFromRedux) => {
    const [isDragging, setIsDragging] = useState(false);
    const prevMousePosition = useRef<Coordinate | null>(null);

    const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
      const mouseCoords: Coordinate = { x: event.clientX, y: event.clientY };

      const initialCoords = toSpaceCoords(mouseCoords, zoom, screenCenter);

      let newZoom: number;
      // Scrolling up - zoom in
      if (event.deltaY < 0) {
        newZoom = zoom * 1.1;
      }
      // Scrolling down - zoom out
      else {
        newZoom = zoom * 0.9;
      }
      setZoom(newZoom);

      const finalCoords = toSpaceCoords(mouseCoords, newZoom, screenCenter);

      if (!keepCentered) {
        // Adjust the screen center so that the coord under the cursor stays the same
        // This is what makes it so you don't just zoom straight in and out, but instead it moves with the mouse
        let newScreenCenter = {
          x: screenCenter.x + initialCoords.x - finalCoords.x,
          y: screenCenter.y + initialCoords.y - finalCoords.y,
        };

        setScreenCenter(newScreenCenter);
      }
    };

    const onMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setIsDragging(true);
      prevMousePosition.current = { x: event.clientX, y: event.clientY };
    };

    const onMouseUp = () => {
      setIsDragging(false);
      prevMousePosition.current = null;
    };

    const onMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (isDragging && !keepCentered && prevMousePosition.current !== null) {
        // Pan around the map
        const deltaX = prevMousePosition.current.x - event.clientX;
        const deltaY = prevMousePosition.current.y - event.clientY;

        const kmPerPixel = maxWidthDistance / window.innerWidth;

        const x = screenCenter.x + (deltaX * kmPerPixel) / zoom;
        const y = screenCenter.y + (deltaY * kmPerPixel) / zoom;

        setScreenCenter({ x, y });

        prevMousePosition.current = { x: event.clientX, y: event.clientY };
      }
    };

    return (
      <div
        style={{ width: "100%", height: "100%" }}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      >
        <OrbitalEllipse
          parentX={0}
          parentY={0}
          distanceFromCenterToFocus={0.07960333203897962}
          longitudeOfPeriapsis={77.4911417038919}
          semiMajorAxis={0.38709843}
          semiMinorAxis={0.37882516288752105}
        />
      </div>
    );
  }
);

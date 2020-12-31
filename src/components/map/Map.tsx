import React, { useEffect, useRef, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../redux/store";
import { setZoom, setScreenCenter } from "../../redux/actionCreators";
import { OrbitalEllipse } from "./OrbitalEllipse";
import { getOrbitalPosition, getObjectCoordinates, toSpaceCoords, toSpaceDistance } from "../../utilities";
import { Coordinate } from "../../interfaces";
import solarSystem from "../../data/solarSystem";
import { OrbitalBody } from "./OrbitalBody";
import { usePrevious } from "../../hooks/usePrevious";

const mapStateToProps = (state: RootState) => ({
  showOrbits: state.options.showOrbits,
  showLabels: state.options.showLabels,
  showBackgroundStars: state.options.showBackgroundStars,
  showDebugInfo: state.options.showDebugInfo,
  keepCentered: state.objectInfo.keepCentered,
  selectedObject: state.objectInfo.selectedObject,
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
    selectedObject,
    displayTime,
    zoom,
    screenCenter,
    setZoom,
    setScreenCenter,
  }: PropsFromRedux) => {
    const [isDragging, setIsDragging] = useState(false);
    const prevMousePositionRef = useRef<Coordinate | null>(null);
    const prevSelectedObject = usePrevious(selectedObject);

    useEffect(() => {
      // Center the screen on the selected object
      if (selectedObject !== null && (selectedObject !== prevSelectedObject || keepCentered)) {
        const coords = getObjectCoordinates(selectedObject, displayTime);
        setScreenCenter(coords);
      }
    }, [selectedObject, prevSelectedObject, setScreenCenter, displayTime, keepCentered]);

    /**
     * Updates the zoom and screen center in response to a mouse event
     * @param newZoom The desired zoom level
     * @param mouseCoords The screen coords of the mouse event (double click or scroll wheel)
     */
    const zoomTo = (newZoom: number, mouseCoords: Coordinate) => {
      if (!keepCentered) {
        const initialCoords = toSpaceCoords(mouseCoords, zoom, screenCenter);
        const finalCoords = toSpaceCoords(mouseCoords, newZoom, screenCenter);
        // Adjust the screen center so that the coord under the cursor stays the same
        // This is what makes it so you don't just zoom straight in and out, but instead it moves with the mouse
        let newScreenCenter = {
          x: screenCenter.x + initialCoords.x - finalCoords.x,
          y: screenCenter.y + initialCoords.y - finalCoords.y,
        };

        setScreenCenter(newScreenCenter);
      }
      setZoom(newZoom);
    };

    const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
      const mouseCoords: Coordinate = { x: event.clientX, y: event.clientY };

      let newZoom: number;
      // Scrolling up - zoom in
      if (event.deltaY < 0) {
        newZoom = zoom * 1.1;
      }
      // Scrolling down - zoom out
      else {
        newZoom = zoom * 0.9;
      }
      zoomTo(newZoom, mouseCoords);
    };

    const onDoubleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const newZoom = zoom * 1.2;
      const mouseCoords: Coordinate = { x: event.clientX, y: event.clientY };

      zoomTo(newZoom, mouseCoords);
    };

    const onMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setIsDragging(true);
      prevMousePositionRef.current = { x: event.clientX, y: event.clientY };
    };

    const onMouseUp = () => {
      setIsDragging(false);
      prevMousePositionRef.current = null;
    };

    const onMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (isDragging && !keepCentered && prevMousePositionRef.current !== null) {
        // Pan around the map
        const deltaX = toSpaceDistance(prevMousePositionRef.current.x - event.clientX, zoom);
        const deltaY = toSpaceDistance(prevMousePositionRef.current.y - event.clientY, zoom);

        const x = screenCenter.x + deltaX;
        const y = screenCenter.y + deltaY;

        setScreenCenter({ x, y });

        prevMousePositionRef.current = { x: event.clientX, y: event.clientY };
      }
    };

    let orbits: JSX.Element[] = [];
    let objects: JSX.Element[] = [];

    solarSystem.forEach((object) => {
      const position = getOrbitalPosition(object.orbit, displayTime);
      const parentCoords = getObjectCoordinates(object.parent, displayTime);
      const objectCoords = getObjectCoordinates(object, displayTime);

      orbits.push(
        <OrbitalEllipse
          key={`${object.id}-orbit`}
          name={object.id}
          parentCoords={parentCoords}
          distanceFromCenterToFocus={position.distanceFromCenterToFocus}
          longitudeOfPeriapsis={position.longitudeOfPeriapsis}
          semiMajorAxis={position.semiMajorAxis}
          semiMinorAxis={position.semiMinorAxis}
        />
      );

      objects.push(<OrbitalBody key={object.id} object={object} coords={objectCoords} />);
    });

    return (
      <div
        style={{ width: "100%", height: "100%" }}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onDoubleClick={onDoubleClick}
      >
        {showOrbits && orbits}
        {objects}
      </div>
    );
  }
);

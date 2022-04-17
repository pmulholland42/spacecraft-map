import React, { useEffect, useRef, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../redux/store";
import { setZoom, setScreenCenter } from "../../redux/actionCreators";
import { OrbitalEllipse } from "./orbital-ellipse/OrbitalEllipse";
import {
  getOrbitalPosition,
  getObjectCoordinates,
  toSpaceCoords,
  toSpaceDistance,
  toScreenDistance,
  getSpacecraftCoords,
} from "../../utilities";
import { Coordinate, OrbitalPosition } from "../../interfaces";
import solarSystem, { pluto, sun } from "../../data/solarSystem";
import { OrbitalBody } from "./orbital-body/OrbitalBody";
import { usePrevious } from "../../hooks/usePrevious";
import { maxZoomLevel, minZoomLevel } from "../../constants";
import { TextBubble } from "./text-bubble/TextBubble";
import { getOrbitalData } from "../../utilities/api";
import { add } from "date-fns";

const mapStateToProps = (state: RootState) => ({
  showOrbits: state.options.showOrbits,
  keepCentered: state.objectInfo.keepCentered,
  selectedObject: state.objectInfo.selectedObject,
  displayTime: state.time.displayTime,
  zoom: state.map.zoom,
  screenCenter: state.map.screenCenter,
  textBubbles: state.ui.textBubbles,
});

const mapDispatchToProps = {
  setZoom,
  setScreenCenter,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

let startDate = new Date();

/**
 * The map takes up the entire screen, and is responsible for rendering all orbits, planets, etc.
 * It also handles zooming and panning.
 */
export const Map = connector(
  ({
    showOrbits,
    keepCentered,
    selectedObject,
    displayTime,
    zoom,
    screenCenter,
    textBubbles,
    setZoom,
    setScreenCenter,
  }: PropsFromRedux) => {
    const [isDragging, setIsDragging] = useState(false);
    const [jwst, setJWST] = useState<OrbitalPosition[]>([]);
    const prevMousePositionRef = useRef<Coordinate | null>(null);
    const prevSelectedObject = usePrevious(selectedObject);

    useEffect(() => {
      let stopDate = add(startDate, { days: 30 });

      getOrbitalData(-170, "500@10", startDate, stopDate, "1d").then((data) => setJWST(data));
    }, []);

    useEffect(() => {
      // Keep the selected object centered
      if (keepCentered && selectedObject !== null && selectedObject === prevSelectedObject) {
        const coords = getObjectCoordinates(selectedObject, displayTime);
        setScreenCenter(coords);
      }
    }, [selectedObject, keepCentered, displayTime, setScreenCenter, prevSelectedObject]);

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
        newZoom = Math.min(zoom + 0.25, maxZoomLevel);
      }
      // Scrolling down - zoom out
      else {
        newZoom = Math.max(zoom - 0.25, minZoomLevel);
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

    if (jwst.length > 0) {
      const coords = getSpacecraftCoords(jwst[0], startDate);
      objects.push(<OrbitalBody key={"jwst"} object={pluto} coords={coords} />);
    }

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
        {textBubbles.map((textBubble) => {
          let coords: Coordinate | undefined = undefined;
          if (textBubble.coords !== undefined) {
            coords = textBubble.coords;
          } else if (textBubble.object !== undefined) {
            coords = getObjectCoordinates(textBubble.object, displayTime);
          }
          let yOffset = textBubble.yOffset ?? 5;
          if (textBubble.object !== undefined) {
            yOffset += toScreenDistance(textBubble.object.diameter / 2, zoom);
          }
          return (
            <TextBubble
              coords={coords}
              text={textBubble.text}
              promptText={textBubble.promptText}
              onPromptClick={textBubble.onPromptClick}
              key={textBubble.id}
              yOffset={yOffset}
              relativeCenter={textBubble.relativeCenter}
            />
          );
        })}
      </div>
    );
  }
);

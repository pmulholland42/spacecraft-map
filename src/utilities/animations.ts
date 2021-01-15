import { store } from "../redux/store";
import { setZoom, setScreenCenter } from "../redux/actionCreators";
import { Coordinate } from "../interfaces";
import { getDistance } from "./calculations";

const animationFrameTime = 70;

let zoomInterval = -1;
let cancelZoom: ((reason: any) => void) | null = null;

let panInterval = -1;
let cancelPan: ((reason: any) => void) | null = null;

/**
 * Smoothly zoom in or out
 * @param targetZoom The desired zoom level
 * @param duration Animation duration in ms. Default 500 ms.
 */
export const animateZoom = (targetZoom: number, duration: number = 750): Promise<void> => {
  const initialZoom = store.getState().map.zoom;
  const deltaZoom = targetZoom - initialZoom;
  if (deltaZoom === 0) {
    return Promise.resolve();
  }

  const tStep = animationFrameTime / duration;
  let t = 0;

  clearInterval(zoomInterval);
  cancelZoom?.("Zoom interrupted by another zoom");

  return new Promise<void>((resolve, reject) => {
    cancelZoom = reject;
    zoomInterval = window.setInterval(() => {
      t = Math.min(t + tStep, 1);
      const percentage = easeOutSine(t);

      const nextZoom = initialZoom + deltaZoom * percentage;
      store.dispatch(setZoom(nextZoom));
      if (t === 1) {
        clearInterval(zoomInterval);
        resolve();
      }
    }, animationFrameTime);
  }).catch((reason) => {
    console.log(reason);
  });
};

/**
 * Smoothly pan around the map
 * @param targetZoom The desired screen center, in space coords (km)
 * @param duration Animation duration in ms. Default 500 ms.
 */
export const animatePan = (targetScreenCenter: Coordinate, duration: number = 750): Promise<void> => {
  const initialScreenCenter = store.getState().map.screenCenter;
  const deltaX = targetScreenCenter.x - initialScreenCenter.x;
  const deltaY = targetScreenCenter.y - initialScreenCenter.y;

  if (deltaX === 0 && deltaY === 0) {
    return Promise.resolve();
  }

  const tStep = animationFrameTime / duration;
  let t = 0;

  clearInterval(panInterval);
  cancelPan?.("Pan interrupted by another pan");

  return new Promise((resolve) => {
    panInterval = window.setInterval(() => {
      t = Math.min(t + tStep, 1);
      const percentage = easeInOutCubic(t);

      const x = initialScreenCenter.x + deltaX * percentage;
      const y = initialScreenCenter.y + deltaY * percentage;
      store.dispatch(setScreenCenter({ x, y }));

      if (t === 1) {
        clearInterval(panInterval);
        resolve();
      }
    }, animationFrameTime);
  });
};

/**
 * Zooms out, pans over, then zooms in
 * @param targetCoords
 */
export const animateZoomAndPan = async (targetScreenCenter: Coordinate, targetZoom: number) => {
  const currentZoom = store.getState().map.zoom;
  const currentScreenCenter = store.getState().map.screenCenter;
  const distanceToPan = getDistance(currentScreenCenter, targetScreenCenter);
  const zoomedOut = 80000 / Math.sqrt(distanceToPan);
  await animateZoom(Math.min(zoomedOut, currentZoom), 2000);
  await animatePan(targetScreenCenter, 2000);
  await animateZoom(targetZoom, 2000);
};

const easeOutSine = (t: number): number => Math.sin((t * Math.PI) / 2);
const easeInOutCubic = (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
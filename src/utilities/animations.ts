import { store } from "../redux/store";
import { setZoom, setScreenCenter } from "../redux/actionCreators";
import { Coordinate } from "../interfaces";
import { getDistance, getMidpoint } from "./calculations";

const animationFrameTime = 50;

let animationInterval = -1;
let cancelAnimation: (() => void) | null = null;

/**
 * Smoothly zoom in or out
 * @param targetZoom The desired zoom level
 * @param duration Animation duration in ms. Default 500 ms.
 * @returns a Promise that resolves true if the animation successfully completed, false if it was canceled
 */
export const animateZoom = (
  targetZoom: number,
  duration: number = 750,
  easing: EasingFunction = easeOutSine
): Promise<boolean> => {
  const initialZoom = store.getState().map.zoom;
  const deltaZoom = targetZoom - initialZoom;
  if (deltaZoom === 0) {
    return Promise.resolve(true);
  }

  const tStep = animationFrameTime / duration;
  let t = 0;

  clearInterval(animationInterval);
  cancelAnimation?.();

  return new Promise<boolean>((resolve) => {
    cancelAnimation = () => resolve(false);
    animationInterval = window.setInterval(() => {
      t = Math.min(t + tStep, 1);
      const percentage = easing(t);

      const nextZoom = initialZoom + deltaZoom * percentage;
      store.dispatch(setZoom(nextZoom));
      if (t === 1) {
        clearInterval(animationInterval);
        resolve(true);
      }
    }, animationFrameTime);
  });
};

/**
 * Smoothly pan around the map
 * @param targetZoom The desired screen center, in space coords (km)
 * @param duration Animation duration in ms. Default 500 ms.
 */
export const animatePan = (
  targetScreenCenter: Coordinate,
  duration: number = 750,
  easing: EasingFunction = easeInOutCubic
): Promise<boolean> => {
  const initialScreenCenter = store.getState().map.screenCenter;
  const deltaX = targetScreenCenter.x - initialScreenCenter.x;
  const deltaY = targetScreenCenter.y - initialScreenCenter.y;

  if (deltaX === 0 && deltaY === 0) {
    return Promise.resolve(true);
  }

  const tStep = animationFrameTime / duration;
  let t = 0;

  clearInterval(animationInterval);
  cancelAnimation?.();

  return new Promise((resolve) => {
    cancelAnimation = () => resolve(false);
    animationInterval = window.setInterval(() => {
      t = Math.min(t + tStep, 1);
      const percentage = easing(t);

      const x = initialScreenCenter.x + deltaX * percentage;
      const y = initialScreenCenter.y + deltaY * percentage;
      store.dispatch(setScreenCenter({ x, y }));

      if (t === 1) {
        clearInterval(animationInterval);
        resolve(true);
      }
    }, animationFrameTime);
  });
};

/**
 * Zooms out, pans over, then zooms in
 * @param targetScreenCenter
 * @param targetZoom
 */
export const animateZoomThenPan = async (targetScreenCenter: Coordinate, targetZoom: number) => {
  const currentZoom = store.getState().map.zoom;
  const currentScreenCenter = store.getState().map.screenCenter;
  const distanceToPan = getDistance(currentScreenCenter, targetScreenCenter);
  const zoomedOut = 80000 / Math.sqrt(distanceToPan);
  await animateZoom(Math.min(zoomedOut, currentZoom), 2000);
  await animatePan(targetScreenCenter, 2000);
  await animateZoom(targetZoom, 2000);
};

/**
 * Zooms out and back in all while panning
 * @param targetScreenCenter
 * @param targetZoom
 * @returns a promise that resolves to true if the animation completed, false if it was interrupted/canceled
 */
export const animateZoomAndPan = async (
  targetScreenCenter: Coordinate,
  targetZoom: number
): Promise<boolean> => {
  const initialZoom = store.getState().map.zoom;
  const initialScreenCenter = store.getState().map.screenCenter;

  if (
    targetScreenCenter.x === initialScreenCenter.x &&
    targetScreenCenter.y === initialScreenCenter.y &&
    targetZoom === initialZoom
  ) {
    return Promise.resolve(true);
  }

  const distanceToPan = getDistance(initialScreenCenter, targetScreenCenter);

  /** The midpoint in space between our initial screen center and the one to which we're panning */
  const midpoint = getMidpoint(initialScreenCenter, targetScreenCenter);

  // The further distance we need to pan, the more the map should zoom out as we go
  // If the total distance to pan is small enough, we don't need to zoom out at all
  /** The zoom level to which we want to zoom out before zooming back in */
  const zoomedOutZoomLevel = Math.min(80000 / Math.sqrt(distanceToPan), initialZoom);

  const deltaZoomOut = zoomedOutZoomLevel - initialZoom;

  const deltaX = midpoint.x - initialScreenCenter.x;
  const deltaY = midpoint.y - initialScreenCenter.y;

  let tStep = animationFrameTime / 1500;
  let t = 0;

  clearInterval(animationInterval);
  cancelAnimation?.();

  const zoomedOut = await new Promise<boolean>((resolve) => {
    animationInterval = window.setInterval(() => {
      cancelAnimation = () => resolve(false);
      t = Math.min(t + tStep, 1);
      const panPercentage = easeInCubic(t);
      const zoomPercentage = easeInQuad(easeOutExpo(t));

      const x = initialScreenCenter.x + deltaX * panPercentage;
      const y = initialScreenCenter.y + deltaY * panPercentage;

      const nextZoom = initialZoom + deltaZoomOut * zoomPercentage;
      store.dispatch(setZoom(nextZoom));
      store.dispatch(setScreenCenter({ x, y }));

      if (t === 1) {
        clearInterval(animationInterval);
        resolve(true);
      }
    }, animationFrameTime);
  });

  if (zoomedOut) {
    tStep = animationFrameTime / 3000;
    t = 0;
    const deltaZoomIn = targetZoom - zoomedOutZoomLevel;
    return new Promise<boolean>((resolve) => {
      animationInterval = window.setInterval(() => {
        cancelAnimation = () => resolve(false);
        t = Math.min(t + tStep, 1);
        const panPercentage = easeOutCubic(t);
        const zoomPercentage = easeOutQuad(easeInExpo(t));

        const x = midpoint.x + deltaX * panPercentage;
        const y = midpoint.y + deltaY * panPercentage;

        const nextZoom = zoomedOutZoomLevel + deltaZoomIn * zoomPercentage;
        store.dispatch(setZoom(nextZoom));
        store.dispatch(setScreenCenter({ x, y }));

        if (t === 1) {
          clearInterval(animationInterval);
          resolve(true);
        }
      }, animationFrameTime);
    });
  } else {
    return Promise.resolve(false);
  }
};

export type EasingFunction = (t: number) => number;

const easeOutSine: EasingFunction = (t) => Math.sin((t * Math.PI) / 2);
const easeInOutCubic: EasingFunction = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeInOutQuad: EasingFunction = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
function easeInExpo(x: number): number {
  return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
}
function easeOutExpo(x: number): number {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}
function easeInSine(x: number): number {
  return 1 - Math.cos((x * Math.PI) / 2);
}
function easeInOutQuint(x: number): number {
  return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
}
function easeInOutQuart(x: number): number {
  return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
}
function easeInCirc(x: number): number {
  return 1 - Math.sqrt(1 - Math.pow(x, 2));
}
function easeOutCirc(x: number): number {
  return Math.sqrt(1 - Math.pow(x - 1, 2));
}
function easeInCubic(x: number): number {
  return x * x * x;
}
function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}
function easeOutQuad(x: number): number {
  return 1 - (1 - x) * (1 - x);
}
function easeOutQuart(x: number): number {
  return 1 - Math.pow(1 - x, 4);
}
function easeInQuad(x: number): number {
  return x * x;
}

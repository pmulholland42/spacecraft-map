import { store } from "../redux/store";
import { setZoom, setScreenCenter } from "../redux/actionCreators";
import { Coordinate } from "../interfaces";
import { getDistance } from "./calculations";

let cancelAnimation: (() => void) | null = null;

/**
 * Smoothly zoom in or out
 * @param targetZoom The desired zoom level
 * @param duration Animation duration in ms. Default 500 ms.
 * @returns a promise that resolves to true if the zoom completed, false if it was interrupted
 */
export const animateZoom = (targetZoom: number, duration: number = 750): Promise<boolean> => {
  if (store.getState().options.removeAnimations) {
    store.dispatch(setZoom(targetZoom));
    return Promise.resolve(true);
  }

  const initialZoom = store.getState().map.zoom;
  const deltaZoom = targetZoom - initialZoom;
  if (deltaZoom === 0) {
    return Promise.resolve(true);
  }

  cancelAnimation?.();
  return new Promise<boolean>((resolve) => {
    cancelAnimation = () => resolve(false);
    let start = -1;
    const animate = (timestamp: number) => {
      if (start === -1) {
        start = timestamp;
      }
      const elapsed = timestamp - start;

      const percentage = easeOutSine(Math.min(elapsed / duration, 1));
      const nextZoom = initialZoom + deltaZoom * percentage;
      store.dispatch(setZoom(nextZoom));

      if (elapsed < duration) {
        window.requestAnimationFrame(animate);
      } else {
        // Stop the animation
        resolve(true);
      }
    };
    window.requestAnimationFrame(animate);
  });
};

/**
 * Smoothly pan around the map
 * @param targetZoom The desired screen center, in space coords (km)
 * @param duration Animation duration in ms. Default 500 ms.
 * @returns a promise that resolves to true if the pan completed, false if it was interrupted
 */
export const animatePan = (targetScreenCenter: Coordinate, duration: number = 750): Promise<boolean> => {
  if (store.getState().options.removeAnimations) {
    store.dispatch(setScreenCenter(targetScreenCenter));
    return Promise.resolve(true);
  }

  const initialScreenCenter = store.getState().map.screenCenter;
  const deltaX = targetScreenCenter.x - initialScreenCenter.x;
  const deltaY = targetScreenCenter.y - initialScreenCenter.y;

  if (deltaX === 0 && deltaY === 0) {
    return Promise.resolve(true);
  }

  cancelAnimation?.();

  return new Promise<boolean>((resolve) => {
    cancelAnimation = () => resolve(false);
    let start = -1;
    const animate = (timestamp: number) => {
      if (start === -1) {
        start = timestamp;
      }
      const elapsed = timestamp - start;

      const percentage = easeInOutCubic(Math.min(elapsed / duration, 1));
      const x = initialScreenCenter.x + deltaX * percentage;
      const y = initialScreenCenter.y + deltaY * percentage;
      store.dispatch(setScreenCenter({ x, y }));

      if (elapsed < duration) {
        window.requestAnimationFrame(animate);
      } else {
        // Stop the animation
        resolve(true);
      }
    };
    window.requestAnimationFrame(animate);
  });
};

/**
 * Zooms out, pans over, then zooms in
 * @param targetCoords
 */
export const animateZoomAndPan = async (targetScreenCenter: Coordinate, targetZoom: number) => {
  if (store.getState().options.removeAnimations) {
    store.dispatch(setZoom(targetZoom));
    store.dispatch(setScreenCenter(targetScreenCenter));
    return Promise.resolve(true);
  }

  const currentZoom = store.getState().map.zoom;
  const currentScreenCenter = store.getState().map.screenCenter;
  const distanceToPan = getDistance(currentScreenCenter, targetScreenCenter);
  const zoomedOut = 80000 / Math.sqrt(distanceToPan);
  await animateZoom(Math.min(zoomedOut, currentZoom, targetZoom), 2000);
  await animatePan(targetScreenCenter, 1500);
  await animateZoom(targetZoom, 2000);
};

const easeOutSine = (t: number): number => Math.sin((t * Math.PI) / 2);
const easeInOutCubic = (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

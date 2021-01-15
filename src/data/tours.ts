import { Tour } from "../interfaces";
import { store } from "../redux/store";
import { pauseTime, setDisplayTime } from "../redux/actionCreators";
import { animateZoomAndPan, getObjectCoordinates } from "../utilities";
import { earth, jupiter, mars, mercury, neptune, pluto, saturn, uranus, venus } from "./solarSystem";
import { defaultPlanetZoom } from "../constants";

export const tours: Tour[] = [
  {
    name: "Meet the Planets",
    description: "palantsds",
    startTour: async () => {
      const now = new Date();
      store.dispatch(setDisplayTime(now));
      store.dispatch(pauseTime());

      await animateZoomAndPan(getObjectCoordinates(mercury, now), defaultPlanetZoom);
      await animateZoomAndPan(getObjectCoordinates(venus, now), defaultPlanetZoom);
      await animateZoomAndPan(getObjectCoordinates(earth, now), defaultPlanetZoom);
      await animateZoomAndPan(getObjectCoordinates(mars, now), defaultPlanetZoom);
      await animateZoomAndPan(getObjectCoordinates(jupiter, now), defaultPlanetZoom);
      await animateZoomAndPan(getObjectCoordinates(saturn, now), defaultPlanetZoom);
      await animateZoomAndPan(getObjectCoordinates(uranus, now), defaultPlanetZoom);
      await animateZoomAndPan(getObjectCoordinates(neptune, now), defaultPlanetZoom);
      await animateZoomAndPan(getObjectCoordinates(pluto, now), defaultPlanetZoom);
    },
  },
  {
    name: "Retrograde Motion of Mars",
    description: "mars",
    startTour: () => {
      console.log("dsdhsjhd");
    },
  },
];

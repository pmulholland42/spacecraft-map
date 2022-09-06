import { AstronomicalObject } from "./AstronomicalObject";
import { HorizonsTimeStep } from "./HorizonsTimeStep";
import { Photo } from "./Photo";

export interface Spacecraft {
  /** Unique identifier for the spacecraft (i.e. its name) */
  id: string;
  /** Used by NASA Horizons API to identity this spacecraft */
  horizonsId: string;
  /** The object this spacecraft orbits */
  parent: AstronomicalObject;
  /** The path of the sprite to be displayed on the map */
  sprite: string;
  /** URL of the Wikipedia page for this object */
  wikiURL: string;
  /** The photo to be displayed on the details pane */
  photo?: Photo;
  /** Time step for horizons API - things with faster orbits need smaller time step */
  timeStep: HorizonsTimeStep;
}

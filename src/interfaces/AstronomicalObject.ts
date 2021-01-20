import { ObjectType } from "./ObjectType";
import { OrbitDefinition } from "./OrbitDefinition";

/** A star, planet, moon, asteroid, etc. */
export interface AstronomicalObject {
  /** Unique identifier for the object (i.e. its name) */
  id: string;
  /** The object that this object orbits */
  parent?: AstronomicalObject;
  /** The type of object, eg. star, planet, or moon */
  type: ObjectType;
  /** The path of the sprite to be displayed on the map */
  sprite: string;
  /** The path of the photo to be displayed on the details pane */
  photo: string;
  /** The color to display when the planet is small enough that it's just a dot */
  color: string;
  /** The diameter of the object (km) */
  diameter: number;
  /** The orbit of the object */
  orbit: OrbitDefinition;
}

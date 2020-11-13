import { OrbitDefinition } from "./OrbitDefinition";

/** A star, planet, moon, asteroid, etc. */
export interface AstronomicalObject {
  /** The name of the object */
  name: string;
  /** The object that this object orbits */
  parent?: AstronomicalObject;
  /** The type of object, eg. star, planet, or moon */
  type: "star" | "planet" | "moon" | "dwarf";
  /** The path for the image to be rendered for this object */
  image: string;
  /** The diameter of the object (km) */
  diameter: number;
  /** The orbit of the object */
  orbit: OrbitDefinition;
}

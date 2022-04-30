import { Spacecraft } from "../interfaces/Spacecraft";
import { sun } from "./solarSystem";

export const jwst: Spacecraft = {
  id: "jwst",
  horizonsId: "-170",
  parent: sun,
  wikiURL: "https://en.wikipedia.org/wiki/James_Webb_Space_Telescope",
  sprite: "sprites/pluto.png", // TODO: make sprite
};

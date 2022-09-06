import { Spacecraft } from "../interfaces/Spacecraft";
import { earth, jupiter, sun } from "./solarSystem";

export const jwst: Spacecraft = {
  id: "jwst",
  horizonsId: "-170",
  parent: sun,
  wikiURL: "https://en.wikipedia.org/wiki/James_Webb_Space_Telescope",
  sprite: "sprites/pluto.png", // TODO: make sprite
  timeStep: "1d",
};

export const juno: Spacecraft = {
  id: "juno",
  horizonsId: "-61",
  parent: jupiter,
  wikiURL: "",
  sprite: "sprites/pluto.png",
  timeStep: "1d",
};

export const earthH: Spacecraft = {
  id: "earthH",
  horizonsId: "399",
  parent: sun,
  wikiURL: "",
  sprite: "sprites/earth.png",
  timeStep: "1d",
};

export const iss: Spacecraft = {
  id: "iss",
  horizonsId: "-125544",
  parent: earth,
  wikiURL: "",
  sprite: "sprites/pluto.png",
  timeStep: "10min",
};

export const spacecraftList = [iss, jwst, juno];

export const getSpacecraftById = (id: string) => {
  return spacecraftList.find((s) => s.id === id);
};

import { expect, test } from "vitest";
import { earth, mars } from "../data/solarSystem";
import { getOrbitalPosition } from "./calculations";

test("reuses orbital positions for equivalent inputs while panning, but updates when time changes", () => {
  const time = new Date("2026-09-07T12:00:00Z");
  const position = getOrbitalPosition(earth.orbit, time);
  getOrbitalPosition(mars.orbit, time);

  const equivalentOrbit = { ...earth.orbit, epoch: new Date(earth.orbit.epoch) };
  expect(getOrbitalPosition(equivalentOrbit, new Date(time))).toBe(position);

  const nextPosition = getOrbitalPosition(earth.orbit, new Date("2026-09-08T12:00:00Z"));
  expect(nextPosition).not.toBe(position);
  expect(nextPosition.meanLongitude).not.toBe(position.meanLongitude);
  expect(Number.isFinite(nextPosition.trueAnomaly)).toBe(true);
});

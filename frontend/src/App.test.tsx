import { StrictMode } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createInstance } from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { afterEach, beforeAll, beforeEach, expect, test, vi } from "vitest";
import App from "./App";
import translation from "../public/locales/en/translation.json";
import { store } from "./redux/store";
import {
  pauseTime,
  setCreditsModalOpen,
  setDetailsPaneOpen,
  setDisplayTime,
  setOptionsPaneOpen,
  setRemoveAnimations,
  setSelectedObject,
  setShowOrbits,
  setTourModalOpen,
  setZoom,
} from "./redux/actionCreators";

const i18n = createInstance();

beforeAll(async () => {
  await i18n.use(initReactI18next).init({
    lng: "en",
    resources: { en: { translation } },
    interpolation: { escapeValue: false },
  });
});

beforeEach(() => {
  store.dispatch(pauseTime());
  store.dispatch(setDisplayTime(new Date(2026, 8, 7, 12)));
  store.dispatch(setRemoveAnimations(true));
  store.dispatch(setShowOrbits(true));
  store.dispatch(setOptionsPaneOpen(false));
  store.dispatch(setDetailsPaneOpen(false));
  store.dispatch(setTourModalOpen(false));
  store.dispatch(setCreditsModalOpen(false));
  store.dispatch(setSelectedObject(null));
  store.dispatch(setZoom(7));

  // Exercise the frontend's real API parser and spacecraft rendering without a running backend.
  const positions = ["2020-01-01T00:00:00Z", "2030-01-01T00:00:00Z"].map((time) => ({
    fields: {
      time,
      eccentricity: 0.01,
      inclination: 0,
      longitude_of_ascending_node: 0,
      longitude_of_periapsis: 0,
      mean_longitude: 90,
      semimajor_axis: 1,
    },
  }));
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response(JSON.stringify(positions), {
      headers: { "Content-Type": "application/json" },
    }))
  );
});

afterEach(() => vi.unstubAllGlobals());

const renderApp = () =>
  render(
    <StrictMode>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </StrictMode>
  );

test("renders the map, loads spacecraft, and searches for a planet", async () => {
  const user = userEvent.setup();
  renderApp();
  expect(screen.getByPlaceholderText("Search the solar system")).toBeInTheDocument();
  await waitFor(() => expect(document.getElementById("iss")).toBeInTheDocument());
  await user.type(screen.getByPlaceholderText("Search the solar system"), "earth{Enter}");
  expect(await screen.findByText("Orbital stats")).toBeInTheDocument();
  expect(store.getState().objectInfo.selectedObject?.id).toBe("earth");
  expect(document.querySelector(".details-pane")).toBeInTheDocument();
});

test("opens and closes options, toggles orbits, and zooms", async () => {
  const user = userEvent.setup();
  renderApp();
  await user.click(screen.getByTitle("Options"));
  const toggle = await screen.findByLabelText("Show orbits");
  expect(toggle).toBeChecked();
  await user.click(toggle);
  expect(toggle).not.toBeChecked();
  expect(store.getState().options.showOrbits).toBe(false);
  await user.click(screen.getByTitle("Close options pane"));
  await waitFor(() => expect(screen.queryByLabelText("Show orbits")).not.toBeInTheDocument());
  await user.click(screen.getByTitle("Zoom in"));
  expect(store.getState().map.zoom).toBe(8);
  await user.click(screen.getByTitle("Zoom out"));
  expect(store.getState().map.zoom).toBe(7);
});

test("opens tours and the credits accordion", async () => {
  const user = userEvent.setup();
  renderApp();
  await user.click(screen.getByTitle("Take a tour!"));
  expect(await screen.findByText("Meet the Planets")).toBeInTheDocument();
  await user.click(screen.getByTitle("Close modal"));
  await waitFor(() => expect(screen.queryByText("Meet the Planets")).not.toBeInTheDocument());
  await user.click(screen.getByTitle("Credits"));
  await user.click(await screen.findByText("How to use"));
  expect(screen.getByText(translation.usageInstructions)).toBeVisible();
  await user.click(screen.getByTitle("Close modal"));
  await waitFor(() => expect(screen.queryByText("How to use")).not.toBeInTheDocument());
});

test("keeps a valid date when cleared and supports choosing a date and pausing time", async () => {
  const user = userEvent.setup();
  renderApp();
  const dateInput = screen.getByDisplayValue("9/07/2026 12:00 PM");
  const originalTime = store.getState().time.displayTime.getTime();
  fireEvent.change(dateInput, { target: { value: "" } });
  expect(store.getState().time.displayTime.getTime()).toBe(originalTime);
  fireEvent.change(dateInput, { target: { value: "9/08/2026 1:30 PM" } });
  expect(store.getState().time.displayTime).toEqual(new Date(2026, 8, 8, 13, 30));
  await user.click(screen.getByTitle("Fast forward time"));
  expect(screen.getByTitle("Pause time")).toBeEnabled();
  await user.click(screen.getByTitle("Pause time"));
  expect(screen.getByTitle("Pause time")).toBeDisabled();
});

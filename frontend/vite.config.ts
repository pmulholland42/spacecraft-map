import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  base: "/solarsystemmap/",
  server: { port: 3000 },
  build: {
    outDir: "build",
    target: "es2022",
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
    clearMocks: true,
    restoreMocks: true,
  },
});

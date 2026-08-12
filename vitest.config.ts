import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    projects: [
      {
        extends: true,
        test: {
          name: "node",
          exclude: [...configDefaults.exclude, "app/src/**/*.test.tsx"],
        },
      },
      {
        extends: true,
        test: {
          name: "app-jsdom",
          include: ["app/src/**/*.test.tsx"],
          environment: "jsdom",
          setupFiles: ["app/src/test/setup.ts"],
        },
      },
    ],
  },
});

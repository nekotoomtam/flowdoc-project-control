import { configDefaults, defineConfig } from "vitest/config";

const worktreeExclude = "**/.worktrees/**";

export default defineConfig({
  test: {
    environment: "node",
    projects: [
      {
        extends: true,
        test: {
          name: "node",
          exclude: [
            ...configDefaults.exclude,
            worktreeExclude,
            "app/src/**/*.test.tsx",
            "tests/e2e/**",
          ],
        },
      },
      {
        extends: true,
        test: {
          name: "app-jsdom",
          include: ["app/src/**/*.test.tsx"],
          exclude: [...configDefaults.exclude, worktreeExclude],
          environment: "jsdom",
          setupFiles: ["app/src/test/setup.ts"],
        },
      },
    ],
  },
});

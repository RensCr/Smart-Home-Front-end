import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "9acs6s",

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },

  e2e: {
    setupNodeEvents() {
      // implement node event listeners here
    },
  },
});

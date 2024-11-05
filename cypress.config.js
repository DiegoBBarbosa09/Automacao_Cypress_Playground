const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://cypress-playground.s3.eu-central-1.amazonaws.com/index.html',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

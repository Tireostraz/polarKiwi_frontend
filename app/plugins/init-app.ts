export default defineNuxtPlugin({
  name: "init-app",
  dependsOn: ["fetch"],
  parallel: true,
  async setup(app) {
    await initApp();
  },
});

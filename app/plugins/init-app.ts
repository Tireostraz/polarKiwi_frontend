export default defineNuxtPlugin({
  name: "init-app",
  dependsOn: ["fetch"],
  parallel: true,
  async setup(app) {
    const { $api } = useNuxtApp();
    const authStore = useAuthStore();

    if (import.meta.browser) {
      $api.auth
        .me()
        .then((response) => {
          if (response.name) {
            authStore.setUser(response);
            authStore.isAuthenticated = true;
          }
        })
        .catch((e) => {
          authStore.setUser(null);
          // todo: alert about auth fail
        });

      app.hook("app:suspense:resolve", () => {
        authStore.setIsHydrated();
      });
    } else {
      authStore.setUser(null);
    }
  },
});

export default defineNuxtPlugin({
  name: "init-app",
  dependsOn: ["fetch"],
  parallel: true,
  async setup(app) {
    const { $api } = useNuxtApp();
    const authStore = useAuthStore();

    if (import.meta.server) {
      authStore.isAuthenticated = false;
    }

    if (import.meta.browser) {
      $api.auth
        .me()
        .then((response) => {
          if (response) {
            authStore.setUser(response);
            console.log("respinse ok");
            /* authStore.isAuthenticated = true; */
          }
        })
        .catch((e) => {
          authStore.setUser(null);
          /* authStore.isAuthenticated = false; */
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

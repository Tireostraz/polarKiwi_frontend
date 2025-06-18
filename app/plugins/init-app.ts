export default defineNuxtPlugin({
  name: "init-app",
  dependsOn: ["fetch"],
  parallel: true,
  async setup(app) {
    const { $api } = useNuxtApp();
    const authStore = useAuthStore();

    if (import.meta.browser) {
      $api.auth
        .check()
        .then((response) => {
          if (response) {
            authStore.setUser(response);
          }
        })
        .catch((e) => {
          authStore.setUser(null);
          let guestId = localStorage.getItem("guestId");
          if (!guestId) {
            guestId = crypto.randomUUID();
            localStorage.setItem("guestId", guestId);
          }
          authStore.setGuestId(guestId);
        });

      app.hook("app:mounted", () => {
        app.hook("app:suspense:resolve", () => {
          authStore.setIsHydrated();
        }); //TODO проверить, что-то не работает гидротация.
      });
    } else {
      authStore.setUser(null);
    }
  },
});

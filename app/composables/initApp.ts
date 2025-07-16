export const initApp = async () => {
  const { $api } = useNuxtApp();
  const authStore = useAuthStore();
  const projectStore = useProjectsStore();

  if (import.meta.browser) {
    try {
      const response = await $api.auth.check();
      if (response) {
        authStore.setUser(response);
      }
    } catch (e) {
      authStore.setUser(null);
      let guestId = localStorage.getItem("guestId");
      if (!guestId) {
        guestId = crypto.randomUUID();
        localStorage.setItem("guestId", guestId);
      }
      authStore.setGuestId(guestId);
    }

    const app = useNuxtApp();

    app.hook("app:suspense:resolve", () => {
      authStore.setIsHydrated();
    });

    //Load all users or guestUsers project id's
    await projectStore.getProjectsIds();
  } else {
    authStore.setUser(null);
  }
};

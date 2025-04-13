import { createAuthRepository } from "~/repository/auth";

export default defineNuxtPlugin({
  name: "fetch",
  parallel: true,
  async setup(nuxtApp) {
    const config = useRuntimeConfig();
    const appFetch = $fetch.create({
      baseURL: config.public.apiBaseUrl,
      onRequest({ options }) {
        options.headers.append("Accept", "application/json");
      },
      async onResponseError({ response }) {
        if (response.status === 401) {
          nuxtApp.runWithContext(() => navigateTo("/auth/login"));
        }
      },
    });
    const api = {
      auth: createAuthRepository(appFetch),
    };
    return {
      provide: {
        appFetch,
        api,
      },
    };
  },
});

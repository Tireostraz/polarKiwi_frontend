import { createAuthRepository } from "~/repository/auth";
import { createProductRepository } from "~/repository/products";

export default defineNuxtPlugin({
  name: "fetch",
  parallel: true,
  async setup(nuxtApp) {
    const config = useRuntimeConfig();

    const appFetch = $fetch.create({
      baseURL: config.public.apiBaseUrl,
      onRequest({ options }) {
        options.headers.append("Accept", "application/json");
        options.credentials = "include";
      },
      /* async onResponseError({ response }) {
        if (response.status === 401) {
          nuxtApp.runWithContext(() => navigateTo("/auth/login"));
        }
      }, */
    });
    const api = {
      auth: createAuthRepository(appFetch),
      products: createProductRepository(appFetch),
    };
    return {
      provide: {
        appFetch,
        api,
      },
    };
  },
});

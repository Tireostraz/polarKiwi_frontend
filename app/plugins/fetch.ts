import { createAuthRepository } from "~/repository/auth";
import { createLayoutsRepository } from "~/repository/layouts";
import { createProductRepository } from "~/repository/products";
import { createUploaderRepository } from "~/repository/uploader";
import type { FetchOptions, $Fetch } from "ofetch";

/** Добавляем свой флаг в стандартные опции */
interface RetryOptions extends FetchOptions {
  _retried?: boolean;
}

export default defineNuxtPlugin({
  name: "fetch",
  parallel: true,
  async setup(nuxtApp) {
    const config = useRuntimeConfig();

    const tryRefresh = async (): Promise<boolean> => {
      try {
        await $fetch("/auth/refresh", {
          baseURL: config.public.apiBaseUrl,
          method: "POST",
          credentials: "include",
        });
        return true;
      } catch {
        return false;
      }
    };

    const appFetch = $fetch.create({
      baseURL: config.public.apiBaseUrl,
      onRequest({ options }) {
        options.headers.append("Accept", "application/json");
        options.credentials = "include";
      },
    });
    const api = {
      auth: createAuthRepository(appFetch),
      products: createProductRepository(appFetch),
      layouts: createLayoutsRepository(appFetch),
      uploader: createUploaderRepository(appFetch),
    };
    return {
      provide: {
        appFetch,
        api,
      },
    };
  },
});

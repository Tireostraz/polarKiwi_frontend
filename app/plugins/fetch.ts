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

    let refreshing: Promise<void> | null = null;

    const tryRefresh = async () => {
      refreshing ??= $fetch("/auth/refresh", {
        baseURL: config.public.apiBaseUrl,
        method: "POST",
        credentials: "include",
      }).finally(() => {
        refreshing = null;
      });

      return refreshing;
    };

    const appFetch = $fetch.create({
      baseURL: config.public.apiBaseUrl,
      onRequest({ options }) {
        options.headers = new Headers(options.headers);
        options.headers.append("Accept", "application/json");
        options.credentials = "include";
      },

      async onResponseError({ request, response, options }) {
        const opts = options as RetryOptions;

        // 1. первая 401 – пробуем refresh
        if (response.status === 401 && !opts._retried) {
          try {
            await tryRefresh();

            // помечаем, чтобы второй раз не крутиться бесконечно
            opts._retried = true;

            // ВОЗВРАЩАЕМ результат повторного запроса
            return await appFetch(request, opts);
          } catch {
            // refresh тоже упал – логаут и редирект
            await appFetch("/auth/logout", { method: "GET" as const });
            nuxtApp.runWithContext(() => navigateTo("/auth/login"));
            throw response; // пробрасываем наружу
          }
        }

        // 2. все прочие ошибки просто летят дальше
        throw response;
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

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
        options.headers = new Headers(options.headers);
        options.headers.append("Accept", "application/json");
        options.credentials = "include";
      },

      async onResponseError({ request, response, options }): Promise<any> {
        const opts = options as RetryOptions;

        // 1. Попробовать обновить токен, если ещё не пробовали
        if (response.status === 401 && !opts._retried) {
          const refreshed = await tryRefresh();

          if (refreshed) {
            // повторяем исходный запрос
            opts._retried = true;
            return await appFetch(request, opts);
          }

          // refresh тоже упал — выходим из учётки
          await appFetch("/auth/logout", { method: "GET" });
          nuxtApp.runWithContext(() => navigateTo("/auth/login"));
        }

        // 2. Все остальные 401 (или другая ошибка) — просто пробрасываем дальше
        throw response; // важно: чтобы Promise отклонился
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

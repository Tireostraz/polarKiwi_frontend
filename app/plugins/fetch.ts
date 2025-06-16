import { createAuthRepository } from "~/repository/auth";
import { createLayoutsRepository } from "~/repository/layouts";
import { createProductRepository } from "~/repository/products";
import { createUploaderRepository } from "~/repository/uploader";
import { createProjectRepository } from "~/repository/projects";

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

    const tryRefreshToken = async () => {
      try {
        await $fetch(`${config.public.apiBaseUrl}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });
        return true;
      } catch (e) {
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

      async onResponseError({ request, response, options }) {
        if (request.toString().includes("/auth/refresh")) {
          throw response;
        }
        if (response.status === 401) {
          const refreshed = await tryRefreshToken();

          if (refreshed) {
            return await $fetch(request, options); // TODO исправить тип options
          } else {
            // рефреш не прошел
            /* const router = useRouter();
            router.push("/auth/login"); */
            throw new Error("Ошибка обновления токена. Переход на логин");
          }
        }
        // в случае другой ошибки пробрасываем ответ
        throw response;
      },
    });
    const api = {
      auth: createAuthRepository(appFetch),
      products: createProductRepository(appFetch),
      layouts: createLayoutsRepository(appFetch),
      uploader: createUploaderRepository(appFetch),
      projects: createProjectRepository(appFetch),
    };
    return {
      provide: {
        appFetch,
        api,
      },
    };
  },
});

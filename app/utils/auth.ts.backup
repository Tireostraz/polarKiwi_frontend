import { useRuntimeConfig, useCookie } from "nuxt/app";

export async function refreshAccessToken() {
  const {
    public: { apiBase },
  } = useRuntimeConfig();
  const accessToken = useCookie<string | null>("accessToken", {
    default: () => null,
  });

  try {
    const response = await $fetch<{ accessToken: string }>(
      `${apiBase}/auth/refresh`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    accessToken.value = response.accessToken;
  } catch (error) {
    console.error("Не удалось обновить accessToken", error);
    accessToken.value = null;
  }
}

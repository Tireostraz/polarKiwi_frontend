import { useCookie } from "nuxt/app";

export async function fetchWithAuth(url: string, options: any = {}) {
  const accessToken = useCookie<string | null>("accessToken");

  if (!options.headers) options.headers = {};
  options.headers["Content-Type"] = "application/json";
  options.credentials = "include"; // Важно: отправляем cookie

  try {
    const response = await $fetch(url, options);
    return response;
  } catch (error: any) {
    if (error.response?.status === 401) {
      // Если получили 401, пробуем обновить токен
      try {
        await $fetch("/auth/refresh", {
          method: "POST",
          credentials: "include",
        });
        return await $fetch(url, options); // Повторяем запрос
      } catch (refreshError) {
        console.error("Не удалось обновить токен", refreshError);
      }
    }
    throw error; // Если рефреш не удался, выбрасываем ошибку
  }
}

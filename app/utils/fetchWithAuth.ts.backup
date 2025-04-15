//import { useCookie, useRuntimeConfig } from "nuxt/app";
let refreshAttempted = false;

export async function fetchWithAuth(url: string, options: any = {}) {
  const apiBase = useRuntimeConfig().public.apiBase;
  const accessToken = useCookie<string | null>("accessToken");

  const headers = {
    "Content-Type": "application/json",
    ...(accessToken.value
      ? { Authorization: `Bearer ${accessToken.value}` }
      : {}),
  };

  const response = await fetch(`${apiBase}${url}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status === 401 && !refreshAttempted) {
    refreshAttempted = true;
    console.warn("Access token expired, trying to refresh...");

    const newAccessToken = await refreshTokens();

    if (!newAccessToken) {
      console.error("Refresh token is invalid. Logging out...");
      useCookie("accessToken").value = null;
      return response; // Возвращаем оригинальный ответ, чтобы фронт знал, что токен не обновился
    }

    return fetchWithAuth(url, options);
  }

  return response.json();
}

export async function refreshTokens() {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase;
  try {
    const response = await fetch(`${apiBase}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to refresh tokens");

    const data = await response.json();
    useCookie("accessToken").value = data.accessToken;
    return data.accessToken;
  } catch (error) {
    console.error("Refresh token error:", error);
    useCookie("accessToken").value = null;
    useCookie("refreshToken").value = null;
    return null;
  }
}

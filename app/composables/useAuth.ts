import { useState, useCookie } from "#imports";

const refreshToken = async () => {
  try {
    const { data } = await $fetch("/auth/refresh", {
      method: "POST",
      credentials: "include", // Для отправки httpOnly cookie
    });

    setToken(data.accessToken);
    return data.accessToken;
  } catch (error) {
    logout();
    throw error;
  }
};

// Интерцептор для $fetch
export default defineNuxtPlugin(() => {
  const { token, refreshToken } = useAuth();

  const $api = $fetch.create({
    onRequest({ options }) {
      if (token.value) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token.value}`,
        };
      }
    },
    onResponseError: async ({ response }) => {
      if (response.status === 401 && !response._retry) {
        response._retry = true;
        const newToken = await refreshToken();
        response.config.headers.Authorization = `Bearer ${newToken}`;
        return $fetch(response.config);
      }
      throw error;
    },
  });

  return { provide: { api: $api } };
});

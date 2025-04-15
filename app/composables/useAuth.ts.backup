//import { useState, useCookie, useRuntimeConfig } from "nuxt/app";
//import { fetchWithAuth, refreshTokens } from "~/utils/fetchWithAuth";

export const useAuth = () => {
  const user = useState<{ id: number; email: string } | null>(
    "authUser",
    () => null
  );

  const {
    public: { apiBase },
  } = useRuntimeConfig();

  const accessToken = useCookie("accessToken", { default: () => null });

  async function register(name: string, email: string, password: string) {
    try {
      const response = await $fetch<{ accessToken: string }>(
        `${apiBase}/auth/register`,
        {
          method: "POST",
          body: JSON.stringify({ name, email, password }),
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      accessToken.value = response.accessToken;
    } catch (error: any) {
      console.error("Registration failed:", error);
      throw error;
    }
  }

  async function login(email: string, password: string) {
    try {
      const response = await $fetch<{ accessToken: string }>(
        `${apiBase}/auth/login`,
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      accessToken.value = response.accessToken;
      await fetchUser();
    } catch (error: any) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  async function fetchUser() {
    try {
      const response = await fetchWithAuth("/auth/me");
      user.value = response;
    } catch (error) {
      user.value = null;
    }
  }

  async function logout() {
    try {
      await fetchWithAuth("/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      user.value = null;
      useCookie("accessToken").value = null;
      useCookie("refreshToken").value = null;
    }
  }

  async function checkAuth() {
    const refreshToken = useCookie("refreshToken").value;

    // Если refreshToken отсутствует, просто сбрасываем пользователя и выходим
    if (!refreshToken) {
      user.value = null;
      return;
    }

    try {
      await fetchUser();
    } catch (error) {
      console.warn(
        "Ошибка при получении пользователя, пробуем обновить токены..."
      );

      const newAccessToken = await refreshTokens();

      if (newAccessToken) {
        await fetchUser();
      } else {
        user.value = null;
      }
    }
  }

  return { user, login, register, fetchUser, logout, checkAuth };
};

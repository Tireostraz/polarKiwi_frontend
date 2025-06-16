import { defineStore } from "pinia";
import type { User, LoginStore, RegisterStore } from "~/repository/auth";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const isHydrated = ref(false);

  const guestId = ref<string | null>(null);
  const setGuestId = (id: string) => {
    guestId.value = id;
  };

  const ssrFriendlyUser = computed(() => (isHydrated ? user.value : null));
  const isAuthenticated = computed(() => !!user.value);

  let readyResolver: ((value: User | null) => void) | null = null;

  const isReady = new Promise<User | null>(
    (resolve) => (readyResolver = resolve)
  );

  const login = async (body: LoginStore) => {
    const { $api, $toast } = useNuxtApp();
    try {
      const res = await $api.auth.login(body);
      user.value = res.user;
      $toast.authSuccess();
    } catch (error: any) {
      $toast.authError(error?.response?._data?.message || "Ошибка авторизации");
      throw error;
    }
  };

  const register = async (body: RegisterStore) => {
    const { $api, $toast } = useNuxtApp();
    try {
      await $api.auth.register(body);
      $toast.authSuccess();
    } catch (error: any) {
      $toast.authError(error?.response?._data?.message || "Ошибка регистрации");
      throw error;
    }
  };

  const logout = async () => {
    const { $api } = useNuxtApp();
    await $api.auth.logout();
    user.value = null;
  };

  const setUser = (currentUser: User | null) => {
    user.value = currentUser;
  };

  function setIsHydrated() {
    isHydrated.value = true;
  }

  return {
    user,
    ssrFriendlyUser,
    setUser,
    setIsHydrated,
    isReady,
    guestId,
    setGuestId,
    isAuthenticated,
    login,
    register,
    logout,
  };
});

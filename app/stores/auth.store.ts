import { defineStore } from "pinia";
import type { User, LoginStore, RegisterStore } from "~/repository/auth";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const ssrFriendlyUser = computed(() => (isHydrated ? user.value : null));

  const isAuthenticated = useState<boolean>(
    "auth.isAuthenticated",
    () => false
  );

  let readyResolver: ((value: User | null) => void) | null = null;

  const isReady = new Promise<User | null>(
    (resolve) => (readyResolver = resolve)
  );
  const isHydrated = ref(false);

  const login = async (body: LoginStore) => {
    const { $api, $toast } = useNuxtApp();
    try {
      await $api.auth.login(body);
      isAuthenticated.value = true;
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
      isAuthenticated.value = true;
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
    isAuthenticated.value = false;
  };

  const setUser = (currentUser: User | null) => {
    user.value = currentUser;
    isAuthenticated.value = !!currentUser;
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
    isAuthenticated,
    login,
    register,
    logout,
  };
});

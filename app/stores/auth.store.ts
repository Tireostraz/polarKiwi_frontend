import { defineStore } from "pinia";
import type { User, LoginStore, RegisterStore } from "~/repository/auth";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const ssrFriendlyUser = computed(() => (isHydrated ? user.value : null));

  const isAuthenticated = useState<boolean>(
    "auth.isAuthenticated",
    () => false
  );
  /* const ssrFriendlyIsAuthenticated = computed(() =>
    isHydrated ? isAuthenticated.value : false
  ); */

  let readyResolver: ((value: User | null) => void) | null = null;

  const isReady = new Promise<User | null>(
    (resolve) => (readyResolver = resolve)
  );
  const isHydrated = ref(false);

  const login = async (body: LoginStore) => {
    const { $api } = useNuxtApp();
    const res = await $api.auth.login(body);
    isAuthenticated.value = true;
  };

  const register = async (body: RegisterStore) => {
    const { $api } = useNuxtApp();
    const res = await $api.auth.register(body);
    isAuthenticated.value = true;
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

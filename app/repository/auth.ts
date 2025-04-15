export interface LoginStore {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterStore {
  name: string;
  email: string;
  password: string;
}

export interface RegisterStoreResponse {
  accessToken: string;
}

export interface LoginStoreResponse {
  accessToken: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
}

export function createAuthRepository(appFetch: typeof $fetch) {
  return {
    login(body: LoginStore) {
      return appFetch<LoginStoreResponse>("/auth/login", {
        method: "POST",
        body,
      });
    },
    register(body: RegisterStore) {
      return appFetch<RegisterStoreResponse>("/auth/register", {
        method: "POST",
        body,
      });
    },
    me() {
      return appFetch<User>("/auth/me", {
        method: "GET",
      });
    },
    logout() {
      return appFetch("/auth/logout", {
        method: "GET",
      });
    },
  };
}

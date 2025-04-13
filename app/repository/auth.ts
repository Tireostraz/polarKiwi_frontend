export interface LoginStore {
  email: string;
  password: string;
}

export interface LoginStoreResponse {
  accessToken: string;
}

export interface User {
  email: string;
  password: string;
}

export function createAuthRepository(appFetch: typeof $fetch) {
  return {
    login(body: LoginStore) {
      return appFetch<LoginStoreResponse>("/auth/login", {
        method: "POST",
        body,
      });
    },
  };
}

export const useAuth = () => {
  return useState("auth", () => ({
    user: null as null | { id: number; email: string },
  }));
};

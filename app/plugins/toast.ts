export default defineNuxtPlugin(() => {
  const toast = useToast();

  const customToast = {
    base: toast,
    cartAdded: (productName: string) =>
      toast.add({
        title: `Товар "${productName}" добавлен в корзину`,
        color: "success",
      }),
    cartRemoved: (productName: string) =>
      toast.add({
        title: `Товар "${productName}" удален из корзины`,
        color: "info",
      }),
    authSuccess: () =>
      toast.add({ title: "Авторизация прошла успешно", color: "success" }),
    authError: (message = "Ошибка авторизации") =>
      toast.add({ title: message, color: "warning" }),
    projectAdded: (projectName: string) =>
      toast.add({
        title: `Проект "${projectName}" добавлен`,
        color: "success",
      }),
    // Можно добавить остальные типы сообщений аналогично
  };

  return {
    provide: {
      toast: customToast,
    },
  };
});

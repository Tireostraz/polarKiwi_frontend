import Toast, {
  POSITION,
  useToast,
  type PluginOptions,
} from "vue-toastification";
import type { ToastInterface } from "vue-toastification";
import type { ToastID } from "vue-toastification/dist/types/types";
import "vue-toastification/dist/index.css";

interface AppToast {
  base: ToastInterface;
  cartAdded: (productName: string) => ToastID;
  cartRemoved: (productName: string) => ToastID;
  authSuccess: () => ToastID;
  authError: (message?: string) => ToastID;
}

export default defineNuxtPlugin((nuxtApp) => {
  const options: PluginOptions = {
    position: POSITION.BOTTOM_RIGHT,
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false,
  };

  nuxtApp.vueApp.use(Toast, options);

  const toastBase = useToast();

  const toast: AppToast = {
    base: toastBase,
    cartAdded: (productName: string) =>
      toastBase.success(`Товар "${productName}" добавлен в корзину`),
    cartRemoved: (productName: string) =>
      toastBase.info(`Товар "${productName}" удален из корзины`),
    authSuccess: () => toastBase.success("Авторизация прошла успешно"),
    authError: (message = "Ошибка авторизации") => toastBase.error(message),
  };

  return {
    provide: {
      toast,
    },
  };
});

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";
import type { LoginStore } from "~/repository/auth";

definePageMeta({ layout: false });

const config = useRuntimeConfig();
const auth = useAuthStore();
const router = useRouter();

const isLogin = reactive({ value: true });
const show = ref(false);

function switchMode() {
  isLogin.value = !isLogin.value;
}

// Схемы валидации через Zod
const loginSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(5, "Минимум 5 символов"),
  rememberMe: z.boolean().default(false),
});
type LoginData = z.infer<typeof loginSchema>;

const registerSchema = z
  .object({
    name: z.string().min(2, "Минимум 2 символа"),
    email: z.string().email("Введите корректный email"),
    password: z.string().min(6, "Минимум 6 символов"),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    path: ["confirm"],
    message: "Пароли должны совпадать",
  });
type RegisterData = z.infer<typeof registerSchema>;

// Form state
const loginState = reactive<Partial<LoginData>>({});
const registerState = reactive<Partial<RegisterData>>({});

async function handleLogin(e: FormSubmitEvent<LoginData>) {
  try {
    await auth.login(e.data);
    router.push({ path: "/" });
  } catch (e) {
    console.error(e, "Ошибка входа");
  }
}

async function handleRegistration(e: FormSubmitEvent<RegisterData>) {
  try {
    await auth.register(e.data);
    switchMode();
  } catch (e) {
    console.error(e, "Ошибка регистрации");
  }
}

const googleLogin = () => {
  window.location.href = `${config.public.apiBaseUrl}/auth/google`;
};

function handleSubmit(e: FormSubmitEvent<any>) {
  if (isLogin.value) {
    handleLogin(e);
  } else {
    handleRegistration(e);
  }
}
</script>
<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4"
  >
    <div class="max-w-md w-full space-y-6 bg-white p-8 rounded shadow">
      <div class="w-full flex justify-center">
        <NuxtImg
          src="/logo.svg"
          width="60"
          sizes="100vw sm:60px md:80px"
          densities="x1 x2"
          :modifiers="{ fit: 'contain' }"
          class="max-w-full h-auto mx-auto"
        />
      </div>
      <h2 class="text-center text-3xl font-extrabold">
        {{ isLogin.value ? "Вход" : "Регистрация" }}
      </h2>

      <UButton
        color="neutral"
        variant="outline"
        class="flex justify-center gap-2 w-full mb-3"
        @click="googleLogin"
      >
        <Icon name="mdi:google" size="20" />
        <span>Войти через Google</span>
      </UButton>

      <UButton
        color="neutral"
        variant="outline"
        class="flex w-full justify-center gap-2"
      >
        <Icon name="mdi:vk" size="20" />
        <span>Войти через VK</span>
      </UButton>

      <div class="w-full flex items-center my-4">
        <hr class="flex-grow border-gray-300" />
        <span class="px-2 text-gray-500">или по email</span>
        <hr class="flex-grow border-gray-300" />
      </div>

      <UForm
        :state="isLogin.value ? loginState : registerState"
        :schema="isLogin.value ? loginSchema : registerSchema"
        class="space-y-4"
        @submit="handleSubmit"
      >
        <template v-if="!isLogin.value">
          <UFormField name="name" label="Имя" required>
            <UInput
              class="w-full"
              v-model="registerState.name"
              placeholder="Иван"
            />
          </UFormField>
        </template>

        <UFormField name="email" label="Email" required>
          <UInput
            class="w-full"
            v-model="(isLogin.value ? loginState : registerState).email"
            type="email"
            placeholder="you@example.com"
          />
        </UFormField>

        <UFormField name="password" label="Пароль" required>
          <UInput
            class="w-full"
            v-model="(isLogin.value ? loginState : registerState).password"
            placeholder="••••••••"
            :type="show ? 'text' : 'password'"
            :ui="{ trailing: 'pe-1' }"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="show ? 'Hide password' : 'Show password'"
                :aria-pressed="show"
                aria-controls="password"
                @click="show = !show"
              />
            </template>
          </UInput>
        </UFormField>

        <template v-if="isLogin.value">
          <UCheckbox v-model="loginState.rememberMe" label="Запомнить меня" />
        </template>

        <template v-if="!isLogin.value">
          <UFormField name="confirm" label="Подтвердите пароль" required>
            <UInput
              class="w-full"
              v-model="registerState.confirm"
              type="password"
              placeholder="••••••••"
            />
          </UFormField>
        </template>

        <UButton type="submit" block size="lg">
          {{ isLogin.value ? "Войти" : "Зарегистрироваться" }}
        </UButton>

        <div class="text-center">
          <button
            type="button"
            class="text-sm text-primary hover:underline"
            @click="switchMode"
          >
            {{
              isLogin.value
                ? "Нет аккаунта? Регистрация"
                : "Уже есть аккаунт? Войти"
            }}
          </button>
        </div>
      </UForm>
    </div>
  </div>
</template>

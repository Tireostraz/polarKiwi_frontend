<script setup lang="ts">
const router = useRouter();
const config = useRuntimeConfig();

const googleLoginHandle = () => {
  const width = 500;
  const height = 600;
  const left = window.screen.width / 2 - width / 2;
  const top = window.screen.height / 2 - height / 2;

  window.open(
    `${config.public.apiBaseUrl}/auth/google`,
    "Google Login",
    `width=${width},height=${height},top=${top},left=${left}`
  );
};

const messageHandler = (event: MessageEvent) => {
  const allowedOrigins = ["http://127.0.0.1:3000", "https://polaroidkiwi.ru"];

  if (!allowedOrigins.includes(event.origin)) return;

  // Проверяем type из объекта data
  if (event.data?.type === "google-auth-success") {
    window.location.href = "/"; // или router.push('/')
  }
  console.log("Message received:", event.data, "from origin:", event.origin);
};

onMounted(() => {
  window.addEventListener("message", messageHandler);
});

onUnmounted(() => {
  window.removeEventListener("message", messageHandler);
});
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-2xl font-bold">Войти</h2>
    <UButton @click="googleLoginHandle" size="lg">Войти через Google</UButton>
  </div>
</template>

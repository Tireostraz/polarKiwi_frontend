<script setup lang="ts">
const router = useRouter();

onMounted(() => {
  const url = new URL(window.location.href);
  const accessToken = url.searchParams.get("accessToken");
  const refreshToken = url.searchParams.get("refreshToken");

  if (accessToken && refreshToken) {
    // Сохраняем токены (например, в localStorage или через store)
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    // (опционально) auth.setTokens(accessToken, refreshToken)

    // Закрываем popup и сообщаем родителю
    if (window.opener) {
      window.opener.postMessage("google-auth-success", "*");
      window.close();
    } else {
      // если не в popup, просто редиректим
      router.push("/");
    }
  } else {
    // Ошибка, токены не получены
    router.push("/login");
  }
});
</script>

<template>
  <div class="p-4 text-center">
    <p>Авторизация через Google... Пожалуйста, подождите.</p>
  </div>
</template>

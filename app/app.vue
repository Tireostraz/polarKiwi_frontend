<script setup>
import { onMounted } from "vue";
import { useAuth } from "@/composables/useAuth";

const auth = useAuth();

onMounted(() => {
  auth.checkAuth();
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
    <NuxtRouteAnnouncer />
  </NuxtLayout>
</template>

<style>
main {
  margin: 1rem;
}
</style>

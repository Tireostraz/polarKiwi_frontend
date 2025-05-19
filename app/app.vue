<script setup></script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
      <NuxtRouteAnnouncer />
      <Toasts />
    </NuxtLayout>
  </UApp>
</template>

<style>
body {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
main {
  margin: 1rem;
}
</style>

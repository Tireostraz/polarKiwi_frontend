<script setup lang="ts"></script>

<template>
  <div class="layout-container">
    <h2 class="layout-header">Проект:</h2>
    <slot />
  </div>
</template>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}
.layout-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.layout-header {
  margin: 0;
  padding: 16px;
  background: white;
  z-index: 10;
}
</style>

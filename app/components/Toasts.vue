<script setup lang="ts">
import { useToast } from "vue-toastification";

const toast = useToast();

// Экспортируем toast для использования в компонентах
defineExpose({ toast });
</script>

<template>
  <!-- Компонент будет рендериться автоматически -->
</template>

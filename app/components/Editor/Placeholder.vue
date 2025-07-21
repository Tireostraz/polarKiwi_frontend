<script setup lang="ts">
import type { Page, PageDefinition } from "~/repository/definitions";

defineProps<{
  page: Page;
  pageDifinition: PageDefinition;
}>();
</script>
<template>
  <div>
    <div class="w-[200px] h-[200px] bg-amber-600"></div>
    <div class="w-[200px] h-[200px] bg-green-400"></div>
  </div>
</template>

<script setup lang="ts">
/* — stores — */
const auth = useAuthStore();
const cartStore = useCartStore();
const projectStore = useProjectsStore();

/* — локальное состояние — */
const mobileOpen = ref(false);
const modalOpen = ref(false);

function toggleMobile() {
  mobileOpen.value = !mobileOpen.value;
}
function toggleModal() {
  modalOpen.value = !modalOpen.value;
}
function logout() {
  auth.logout();
}
</script>

<template>
  <!-- базовый контейнер -->
  <UContainer as="header" class="py-2">
    <!-- flex-обёртка -->
    <div class="flex items-center justify-between gap-4">
      <!-- logo / home -->
      <NuxtLink to="/" aria-label="Домой" class="shrink-0">
        <NuxtImg src="/logo.svg" width="40" height="40" class="w-8 md:w-10" />
      </NuxtLink>

      <!-- центр — «Polar Kiwi» -->
      <NuxtLink to="/" class="flex-1 text-center select-none">
        <NuxtImg
          src="/PolarKiwi.svg"
          class="mx-auto w-28 md:w-36 lg:w-44"
          alt="Polar Kiwi"
          width="176"
          height="40"
        />
      </NuxtLink>

      <!-- десктопные действия -->
      <div class="hidden md:flex items-center gap-6 shrink-0">
        <!-- Проекты -->
        <NuxtLink to="/projects" class="relative flex flex-col items-center">
          <UAvatar src="/projects.svg" size="md" />
          <span class="text-xs mt-1">Проекты</span>
          <UBadge
            v-if="projectStore.totalProjects"
            color="primary"
            variant="solid"
            class="absolute -top-1 -right-1 text-[10px]"
          >
            {{ projectStore.totalProjects }}
          </UBadge>
        </NuxtLink>

        <!-- Корзина -->
        <NuxtLink to="/cart" class="relative flex flex-col items-center">
          <UAvatar src="/cart.svg" size="md" />
          <span class="text-xs mt-1">Корзина</span>
          <UBadge
            v-if="cartStore.totalItems"
            color="primary"
            variant="solid"
            class="absolute -top-1 -right-1 text-[10px]"
          >
            {{ cartStore.totalItems }}
          </UBadge>
        </NuxtLink>

        <!-- Аккаунт / Выход -->
        <template v-if="auth.isAuthenticated">
          <UButton icon="i-lucide-log-out" variant="ghost" @click="logout">
            Выйти
          </UButton>
        </template>
        <template v-else>
          <UButton icon="i-lucide-user" variant="ghost" @click="toggleModal">
            Аккаунт
          </UButton>
        </template>
      </div>

      <!-- бургер для < md -->
      <UButton
        class="md:hidden"
        variant="ghost"
        icon="i-lucide-menu"
        aria-label="Меню"
        @click="toggleMobile"
      />
    </div>

    <!-- mobile-drawer -->
    <USlideover v-model="mobileOpen" side="right" overlay>
      <div class="p-6 flex flex-col gap-4">
        <NuxtLink to="/projects" @click="toggleMobile">
          <UButton icon="i-lucide-layers" block>
            Проекты
            <UBadge v-if="projectStore.totalProjects" size="xs" class="ml-auto">
              {{ projectStore.totalProjects }}
            </UBadge>
          </UButton>
        </NuxtLink>

        <NuxtLink to="/cart" @click="toggleMobile">
          <UButton icon="i-lucide-shopping-cart" block>
            Корзина
            <UBadge v-if="cartStore.totalItems" size="xs" class="ml-auto">
              {{ cartStore.totalItems }}
            </UBadge>
          </UButton>
        </NuxtLink>

        <div>
          <UButton
            v-if="auth.isAuthenticated"
            icon="i-lucide-log-out"
            block
            @click="
              () => {
                logout();
                toggleMobile();
              }
            "
          >
            Выйти
          </UButton>
          <UButton
            v-else
            icon="i-lucide-user"
            block
            @click="
              () => {
                toggleModal();
                toggleMobile();
              }
            "
          >
            Аккаунт
          </UButton>
        </div>
      </div>
    </USlideover>

    <!-- модальное окно авторизации -->
    <AuthModal :is-open="modalOpen" @close="toggleModal" />
  </UContainer>
</template>

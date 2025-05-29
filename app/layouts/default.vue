<script setup lang="ts">
const auth = useAuthStore();
const cartStore = useCartStore();
const projectStore = useProjectsStore();

const isMenuOpen = ref(false);
const modalOpen = ref(false);
const route = useRoute();
const isCollapsed = computed(() => route.path !== "/");

const items = ["/slider/1.webp", "/slider/2.webp", "/slider/3.jpg"];

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

function toggleModal() {
  modalOpen.value = !modalOpen.value;
}

function handleLogout() {
  auth.logout();
  console.log("Logout");
}
</script>

<template>
  <header class="header">
    <nav class="nav">
      <div class="logo-container">
        <nuxt-link to="/">
          <NuxtImg
            class="logo-img"
            src="/logo.svg"
            width="40"
            height="40"
            sizes="sm:30px md:40px"
          />
        </nuxt-link>
      </div>

      <div class="center-logo">
        <NuxtImg
          class="polar-kiwi-logo"
          src="/PolarKiwi.svg"
          sizes="sm:80px md:90px lg:120px"
        />
      </div>

      <div class="nav-controls">
        <!-- Десктопное меню -->
        <div class="desktop-menu">
          <nuxt-link class="nav-link" to="/projects">
            <img src="/projects.svg" width="24" height="24" />
            <div class="nav-text">Проекты</div>
            <ClientOnly>
              <div
                v-if="projectStore.totalProjects > 0"
                class="nav-cart_counter"
              >
                {{ projectStore.totalProjects }}
              </div>
            </ClientOnly>
          </nuxt-link>
          <nuxt-link class="nav-link" to="/cart">
            <img src="/cart.svg" width="24" height="24" />
            <ClientOnly>
              <div v-if="cartStore.totalItems > 0" class="nav-cart_counter">
                {{ cartStore.totalItems }}
              </div>
            </ClientOnly>
            <div class="nav-text">Корзина</div>
          </nuxt-link>
          <ClientOnly>
            <button v-if="auth.isAuthenticated" @click="handleLogout">
              <img src="/account.svg" width="24" height="24" />
              <div class="nav-text">Выйти</div>
            </button>
            <button v-else @click="toggleModal">
              <img src="/account.svg" width="24" height="24" />
              <div class="nav-text">Аккаунт</div>
            </button>
          </ClientOnly>
        </div>

        <!-- Мобильное меню -->
        <button class="burger-menu" @click="toggleMenu">
          <img src="/menu.svg" width="24" height="24" alt="Меню" />
        </button>
      </div>

      <!-- Выпадающее меню -->
      <div v-if="isMenuOpen" class="mobile-menu">
        <nuxt-link class="mobile-link" to="/projects" @click="toggleMenu">
          <img src="/projects.svg" width="20" height="20" />
          <span>Проекты</span>
        </nuxt-link>
        <nuxt-link class="mobile-link" to="/cart" @click="toggleMenu">
          <img src="/cart.svg" width="20" height="20" />
          <span
            >Корзина
            <span v-if="cartStore.totalItems > 0" class="mobile-cart-counter">{{
              cartStore.totalItems
            }}</span></span
          >
        </nuxt-link>
        <button class="mobile-link" @click="toggleModal">
          <img src="/account.svg" width="20" height="20" />
          <div class="nav-text">Аккаунт</div>
        </button>
      </div>
    </nav>
    <hr />
  </header>

  <main>
    <div class="container">
      <div class="pb-5">
        <UCarousel
          v-slot="{ item }"
          loop
          dots
          :autoplay="{ delay: 5000 }"
          :items="items"
          class="w-full"
        >
          <NuxtImg
            :src="item"
            class="w-full object-cover rounded-2xl h-full"
            :class="
              isCollapsed
                ? 'h-40 max-h-40'
                : 'h-[70vh] max-h-[480px] min-h-[200px]'
            "
          />
        </UCarousel>
      </div>
      <TabNavigation />
      <slot />
    </div>
    <AuthModal :isOpen="modalOpen" @close="toggleModal"></AuthModal>
  </main>

  <AppFooter />
</template>

<style scoped>
.header {
  padding: 0 1rem;
  position: relative;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  position: relative;
  padding: 0.5rem 0;
}

.logo-container {
  flex: 1;
  display: flex;
  justify-content: flex-start;
}

.center-logo {
  flex: 1;
  display: flex;
  justify-content: center;
}

.nav-controls {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  text-decoration: none;
}

.desktop-menu button {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  border: none;
  background: none;
  cursor: pointer;
}

.desktop-menu {
  display: flex;
  gap: 1rem;
}

.nav-link {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  min-width: 50px;
  text-align: center;
  cursor: pointer;
}

.desktop-menu button,
.desktop-menu .nav-link {
  font: 1rem "Arial";
  font-size: 1rem;
  color: black;
  text-decoration: none;
}

.nav-text {
  font-size: 12px;
  margin-top: 4px;
}

.nav-cart_counter {
  font-size: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 16px;
  height: 16px;
  color: white;
  background: rgb(0, 0, 0);
  position: absolute;
  border-radius: 50%;
  top: 0;
  right: 0;
}

/* Бургер-меню (скрыто по умолчанию) */
.burger-menu {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}

/* Мобильное меню (скрыто по умолчанию) */
.mobile-menu {
  display: none;
  flex-direction: column;
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  width: 200px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 100;
  border-radius: 8px;
  padding: 1rem;
  gap: 1rem;
}

.mobile-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  color: #333;
  text-decoration: none;
  border-radius: 4px;
}

.mobile-link:hover {
  background: #f5f5f5;
}

.mobile-cart-counter {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 18px;
  height: 18px;
  font-size: 10px;
  color: white;
  background: black;
  border-radius: 50%;
  margin-left: 8px;
}

/* Адаптивность */
@media (max-width: 768px) {
  .desktop-menu {
    display: none; /* Скрываем обычное меню */
  }

  .burger-menu {
    display: block; /* Показываем бургер */
  }

  .mobile-menu {
    display: flex; /* Показываем мобильное меню когда открыто */
  }

  .nav {
    flex-wrap: wrap;
  }

  .logo-container {
    order: 1;
    flex: 0 0 auto;
  }

  .center-logo {
    order: 3;
    flex: 1 0 100%;
    justify-content: center;
    margin-top: 0.5rem;
  }

  .nav-controls {
    order: 2;
    flex: 0 0 auto;
  }

  .polar-kiwi-logo {
    max-width: 120px;
  }
}

@media (max-width: 480px) {
  .mobile-menu {
    width: 180px;
  }

  .polar-kiwi-logo {
    max-width: 100px;
  }
}

main {
  display: flex;
  justify-items: center;
  align-items: center;
  flex-direction: column;
}
.container {
  width: 100%;
  max-width: 1280px;
}
</style>

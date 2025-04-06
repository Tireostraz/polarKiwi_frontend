<script setup lang="ts"></script>

<template>
  <head> </head>
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
      <NuxtImg
        class="logo-img"
        src="/PolarKiwi.svg"
        sizes="sm:80px md:90px lg:120px"
      >
      </NuxtImg>
      <div class="nav-controls">
        <nuxt-link class="nav-link" to="projects">
          <img src="/projects.svg" width="24" height="24" />
          <div class="nav-text">Проекты</div>
        </nuxt-link>
        <nuxt-link class="nav-link" to="cart">
          <img src="/cart.svg" width="24" height="24" />
          <div class="nav-cart_counter">22</div>
          <div class="nav-text">Корзина</div>
        </nuxt-link>
        <nuxt-link class="nav-link" to="account">
          <img src="/account.svg" width="24" height="24" />
          <div class="nav-text">Аккаунт</div>
        </nuxt-link>
      </div>
    </nav>
    <hr />
  </header>
  <main>
    <div class="container">
      <slot> </slot>
    </div>
  </main>
  <footer></footer>
</template>

<style scoped>
/* Десктоп */
body {
  font-size: 20px;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
@media (max-width: 1024px) {
  body {
    font-size: 18px;
  }
}

@media (max-width: 768px) {
  body {
    font-size: 16px;
  }
}

@media (max-width: 640px) {
  body {
    font-size: 14px;
  }
}

.header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 1rem;
}
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1280px;
  position: relative;
}

.nav-controls {
  display: flex;
  justify-content: right;
}
.logo-container {
  display: flex;
  align-items: center;
}

.logo-container nuxt-link {
  display: block;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo-img {
  display: block;
}

.nav-link {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 50px;
  width: 50px;
  margin: 0 0 0 1rem;
}

.nav-text {
  font-size: 12px;
}

a {
  color: rgb(113, 113, 113);
  text-decoration: none;
}
.nav-cart_counter {
  font-size: 12px;
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

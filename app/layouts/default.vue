<script setup lang="ts"></script>

<template>
  <head> </head>
  <header class="header">
    <nav class="nav">
      <div class="logo-container">
        <nuxt-link to="/">
          <img src="/logo.svg" class="logo-img" />
        </nuxt-link>
      </div>
      <div>
        <nuxt-link to="products">
          <img src="/cart.svg" width="24" height="24" />
        </nuxt-link>
      </div>
    </nav>
    <hr />
  </header>
  <main>
    <slot></slot>
  </main>
  <footer></footer>
</template>

<style scoped>
.header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
}
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1280px;
  padding: 1rem 2rem;
  position: relative;
}
.logo-container {
  display: flex;
  align-items: center;
}
.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo-img {
  width: 24px;
  height: 24px;
}
</style>

<script setup lang="ts"></script>
<template>
  <div class="carousel">
    <div class="carousel-2">
      <div class="arrow-module left">Left</div>
      <NuxtImg class="carousel-image" src="kiwi.webp" />
      <div class="arrow-module right">Right</div>
    </div>
  </div>
</template>

<style scoped>
.carousel {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.carousel-2 {
  width: 100%;
  height: 480px;
}

.arrow-module {
  transform: translate(0, -50%);
  height: 30px;
  width: 30px;
}
.right {
  position: absolute;
  right: 0;
  top: 50%;
}

.left {
  position: absolute;
  left: 0;
  top: 50%;
}
.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>

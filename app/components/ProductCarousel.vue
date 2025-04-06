<script setup lang="ts">
const images = ref([
  "/carousel/kiwi.webp",
  "/carousel/annie.webp",
  "/carousel/kiwi.webp",
]);
const currentIndex = ref(0);
let transitionName = ref("slide-next");

function slideNext() {
  transitionName.value = "slide-next";
  if (currentIndex.value + 1 === images.value.length) {
    currentIndex.value = 0;
  } else {
    currentIndex.value++;
  }
}

function slidePrev() {
  transitionName.value = "slide-prev";
  currentIndex.value + 1 === images.value.length
    ? (currentIndex.value = 0)
    : currentIndex.value++;
}
</script>
<template>
  <div class="carousel">
    <div class="carousel-container">
      <div @click="slidePrev" class="arrow left">&lt;</div>
      <Transition :name="transitionName" mode="out-in">
        <NuxtImg
          :key="currentIndex"
          :src="images[currentIndex]"
          class="carousel-image"
        />
      </Transition>
      <div @click="slideNext" class="arrow right">&gt;</div>
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
.carousel-container {
  width: 100%;
  height: 480px;
}
.arrow {
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translate(0, -50%);
  height: 30px;
  width: 30px;
  border-radius: 50%;
  opacity: 50%;
  background: white;
  user-select: none;
  cursor: pointer;
}
.right {
  position: absolute;
  right: 0;
  top: 50%;
  margin-right: 1rem;
}
.left {
  position: absolute;
  left: 0;
  top: 50%;
  margin-left: 1rem;
}
.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Анимация */

.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: all 0.3s ease;
}

.slide-next-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-next-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-prev-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-prev-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>

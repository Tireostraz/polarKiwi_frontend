<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";

const props = defineProps<{
  isCollapsed: boolean;
}>();
const isCollapsing = ref(false);

watch(
  () => props.isCollapsed,
  (newVal) => {
    if (newVal) {
      // При уменьшении
      isCollapsing.value = true;
    } else {
      // При возвращении к нормальному размеру
      setTimeout(() => {
        isCollapsing.value = false;
      }, 10);
    }
  },
  { immediate: true }
);

const swiperOptions = {
  modules: [Navigation, Pagination, Autoplay],
  navigation: {
    nextEl: ".next-button",
    prevEl: ".prev-button",
  },
  pagination: { clickable: false },
  loop: true,
  autoplay: { delay: 5000, disableOnInteraction: false },
  preloadImages: false,
  breakpoints: {
    320: {
      // Mobile
      slidesPerView: 1,
      spaceBetween: 10,
      navigation: {
        enabled: false, // Отключаем стрелки на мобильных
      },
    },
    768: {
      // Tablet
      slidesPerView: 1,
      spaceBetween: 20,
      navigation: {
        enabled: true,
      },
    },
    1024: {
      // Desktop
      slidesPerView: 1,
      spaceBetween: 30,
    },
  },
};

const images: string[] = [
  "/slider/kiwi.webp",
  "/slider/annie.webp",
  "/slider/kiwi.webp",
];
const swiperInstance = ref<any>(null);
const activeIndex = ref(0); // Добавляем реактивный индекс

const onSwiperInit = (swiper: any) => {
  swiperInstance.value = swiper;

  swiper.on("slideChange", () => {
    // Обновляем активный индекс при любом изменении слайда
    activeIndex.value = swiper.realIndex; // Используем realIndex для работы с loop

    const nextIndex = (swiper.realIndex + 1) % images.length;
    const prevIndex = (swiper.realIndex - 1 + images.length) % images.length;
    new Image().src = images[nextIndex] as string;
    new Image().src = images[prevIndex] as string;
  });
};

const goToSlide = (index: number) => {
  if (swiperInstance.value) {
    swiperInstance.value.slideToLoop(index); // Используем slideToLoop для loop-режима
  }
};
</script>

<template>
  <div class="swiper-container" :class="{ 'slider--collapsing': isCollapsing }">
    <Swiper v-bind="swiperOptions" @swiper="onSwiperInit">
      <SwiperSlide v-for="(image, index) in images" :key="index">
        <NuxtImg
          :src="image"
          :preload="index < 2"
          loading="lazy"
          class="slide-image"
          :class="{ collapsed: isCollapsed }"
        />
      </SwiperSlide>

      <div class="prev-button">
        <NuxtImg width="16" height="16" src="/slider/back.svg" />
      </div>
      <div class="next-button">
        <NuxtImg width="16" height="16" src="/slider/more.svg" />
      </div>
    </Swiper>

    <div class="custom-pagination">
      <button
        v-for="(_, index) in images"
        :key="index"
        @click="goToSlide(index)"
        :class="{ active: activeIndex === index }"
        class="pagination-dot"
      />
    </div>
  </div>
</template>

<style scoped>
@import "swiper/css";
@import "swiper/css/navigation";
@import "swiper/css/pagination";

.swiper-container {
  position: relative;
}
.swiper-container:hover .slide-image {
  filter: brightness(90%);
}

.swiper-container:hover .prev-button,
.swiper-container:hover .next-button {
  opacity: 50%;
  visibility: visible;
}
.slide-image {
  width: 100%;
  object-fit: cover;
  border-radius: 20px;
  transition: height 0.6s ease-in-out;
  height: 70vh;
  max-height: 480px;
  min-height: 200px;
}

.slide-image.collapsed {
  height: 160px; /* или 0, если нужно спрятать */
  max-height: 160px;
}

.prev-button,
.next-button {
  visibility: hidden;
  position: absolute;
  top: 50%;
  z-index: 10;
  width: 32px;
  height: 32px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transform: translateY(-50%);
  user-select: none;
}
.prev-button {
  left: 20px;
}
.next-button {
  right: 20px;
}

.prev-button:hover,
.next-button:hover {
  opacity: 100% !important;
}

.custom-pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
}

.pagination-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #ccc;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: background-color 0.3s ease;
}

.pagination-dot.active {
  background-color: #000;
}
.pagination-dot {
  translate: all 0.5s ease;
}

/* Анимации */

.swiper-container {
  transition: height 0.5s ease;
}

.slide-image {
  transition: height 0.5s ease-in-out;
}

.slide-image.collapsed {
  height: 160px;
  max-height: 160px;
}
</style>

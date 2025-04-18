<template>
  <div class="constructor-page">
    <!-- Галерея слева -->
    <aside class="gallery">
      <h3>Галерея</h3>
      <input type="file" multiple @change="handleFiles" />
      <div class="thumbnails">
        <img
          v-for="(img, i) in galleryImages"
          :key="i"
          :src="img"
          @click="addToPolaroids(img)"
          class="thumbnail"
        />
      </div>
    </aside>

    <!-- Полароид-превью по центру -->
    <main class="polaroid-preview">
      <div class="polaroid" v-for="(img, index) in polaroidImages" :key="index">
        <img :src="img" class="polaroid-img" />
        <div class="polaroid-label">Ваш текст</div>
      </div>
    </main>

    <!-- Кнопка добавления в корзину -->
    <button class="submit-btn" @click="submitProject">
      Добавить в корзину
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";

const galleryImages = ref([]);
const polaroidImages = ref([]);

function handleFiles(event) {
  const files = Array.from(event.target.files);
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = () => galleryImages.value.push(reader.result);
    reader.readAsDataURL(file);
  });
}

function addToPolaroids(image) {
  polaroidImages.value.push(image);
}

function submitProject() {
  console.log("Сохраняем проект", {
    images: polaroidImages.value,
    // Позже сюда добавим данные об обрезке и т.д.
  });
}
</script>

<style scoped>
.constructor-page {
  display: flex;
  gap: 20px;
  padding: 20px;
  position: relative;
}
.gallery {
  width: 200px;
  border-right: 1px solid #ccc;
}
.thumbnails {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.thumbnail {
  width: 80px;
  height: 80px;
  object-fit: cover;
  cursor: pointer;
}
.polaroid-preview {
  flex-grow: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}
.polaroid {
  width: 150px;
  height: 180px;
  background: white;
  border: 1px solid #000;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 10px;
}
.polaroid-img {
  max-width: 100%;
  max-height: 120px;
}
.polaroid-label {
  margin-top: 10px;
  font-size: 14px;
  text-align: center;
}
.submit-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #4caf50;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
}
</style>

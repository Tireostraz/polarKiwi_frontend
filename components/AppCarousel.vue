<template>
  <div class="carousel-container">
    <Carousel control indicators>
      <CarouselInner>
        <CarouselItem>
          <CarouselItemImage class="carousel-image" src="kiwi.webp" />
        </CarouselItem>
        <CarouselItem>
          <CarouselItemImage class="carousel-image" src="kiwi.webp" />
        </CarouselItem>
        <CarouselItem>
          <CarouselItemImage class="carousel-image" src="carousel_1.jpg" />
        </CarouselItem>
      </CarouselInner>
    </Carousel>
  </div>
</template>

<style scoped>
.carousel-container {
  max-width: 100%; /* Задаём максимальную ширину */
  margin: 0 auto; /* Центрируем */
}

.carousel-image {
  width: 100%;
  height: 400px; /* Устанавливаем фиксированную высоту */
  object-fit: cover; /* Обрезаем изображение, сохраняя пропорции */
}

@media (max-width: 768px) {
  .carousel-image {
    height: 250px;
  }
}
</style>

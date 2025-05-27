<template>
  <footer class="bg-gray-100 border-t border-gray-200 mt-10">
    <div class="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Логотип и описание -->
        <div>
          <NuxtLink to="/" class="inline-flex items-center space-x-2">
            <NuxtImg src="/logo.svg" width="32" height="32" />
            <span class="text-lg font-semibold text-gray-800">PolarKiwi</span>
          </NuxtLink>
          <p class="text-sm text-gray-600 mt-3">
            Заказ печатной продукции с удобным онлайн-редактором. Фотокниги,
            постеры, сувениры — всё в одном месте.
          </p>
        </div>

        <!-- Навигация -->
        <div>
          <h3
            class="text-sm font-semibold text-gray-700 uppercase tracking-wide"
          >
            Навигация
          </h3>
          <ul class="mt-4 space-y-2 text-sm text-gray-600">
            <li>
              <NuxtLink to="/projects" class="hover:text-black"
                >Мои проекты</NuxtLink
              >
            </li>
            <li>
              <NuxtLink to="/cart" class="hover:text-black">Корзина</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/about" class="hover:text-black">О нас</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/contacts" class="hover:text-black"
                >Контакты</NuxtLink
              >
            </li>
          </ul>
        </div>

        <!-- Контакты -->
        <div>
          <h3
            class="text-sm font-semibold text-gray-700 uppercase tracking-wide"
          >
            Контакты
          </h3>
          <ul class="mt-4 text-sm text-gray-600 space-y-2">
            <li>
              Тел:
              <a href="tel:+79991234567" class="hover:text-black"
                >+7 (999) 123-45-67</a
              >
            </li>
            <li>
              Email:
              <a href="mailto:hello@polarkiwi.ru" class="hover:text-black"
                >hello@polarkiwi.ru</a
              >
            </li>
            <li>г. Москва, ул. Примерная, 1</li>
          </ul>
        </div>

        <!-- Соцсети -->
        <div>
          <h3
            class="text-sm font-semibold text-gray-700 uppercase tracking-wide"
          >
            Мы в соцсетях
          </h3>
          <div class="mt-4 flex space-x-4">
            <a
              href="#"
              class="text-gray-500 hover:text-black"
              aria-label="Telegram"
            >
              <Icon name="lucide:send" size="24" />
            </a>
            <a
              href="#"
              class="text-gray-500 hover:text-black"
              aria-label="Instagram"
            >
              <Icon name="lucide:camera" size="24" />
            </a>
            <a href="#" class="text-gray-500 hover:text-black" aria-label="VK">
              <Icon name="mdi:vk" size="24" />
            </a>
          </div>
        </div>
      </div>

      <div
        class="mt-10 border-t border-gray-300 pt-6 text-center text-sm text-gray-500"
      >
        © 2025 PolarKiwi. Все права защищены.
      </div>
    </div>
  </footer>
</template>

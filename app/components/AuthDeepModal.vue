<!-- components/AuthModal.vue -->
<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content" ref="modalContent">
      <button class="close-button" @click="closeModal">×</button>

      <div class="auth-tabs">
        <button
          :class="{ active: activeTab === 'login' }"
          @click="setActiveTab('login')"
        >
          Login
        </button>
        <button
          :class="{ active: activeTab === 'register' }"
          @click="setActiveTab('register')"
        >
          Register
        </button>
      </div>

      <form
        v-if="activeTab === 'login'"
        @submit.prevent="handleLogin"
        class="auth-form"
      >
        <h3>Login to your account</h3>
        <input
          type="email"
          v-model="loginForm.email"
          placeholder="Email"
          required
        />
        <input
          type="password"
          v-model="loginForm.password"
          placeholder="Password"
          required
        />
        <button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? "Logging in..." : "Login" }}
        </button>
      </form>

      <form v-else @submit.prevent="handleRegister" class="auth-form">
        <h3>Create new account</h3>
        <input
          type="text"
          v-model="registerForm.name"
          placeholder="Name"
          required
        />
        <input
          type="email"
          v-model="registerForm.email"
          placeholder="Email"
          required
        />
        <input
          type="password"
          v-model="registerForm.password"
          placeholder="Password"
          required
        />
        <button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? "Registering..." : "Register" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(["close"]);

const activeTab = ref("login");
const isSubmitting = ref(false);

const loginForm = ref({
  email: "",
  password: "",
});

const registerForm = ref({
  name: "",
  email: "",
  password: "",
});

const modalContent = ref(null);

// Закрытие по Esc
const onKeyDown = (e) => {
  if (e.key === "Escape") closeModal();
};

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      window.addEventListener("keydown", onKeyDown);
    } else {
      window.removeEventListener("keydown", onKeyDown);
    }
  }
);

const setActiveTab = (tab) => {
  activeTab.value = tab;
};

const closeModal = () => {
  emit("close");
};

const handleLogin = async () => {
  isSubmitting.value = true;
  try {
    // Здесь логика входа
    console.log("Login data:", loginForm.value);
    // await $fetch('/api/auth/login', { method: 'POST', body: loginForm.value })
    closeModal();
  } catch (error) {
    console.error("Login error:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const handleRegister = async () => {
  isSubmitting.value = true;
  try {
    // Здесь логика регистрации
    console.log("Register data:", registerForm.value);
    // await $fetch('/api/auth/register', { method: 'POST', body: registerForm.value })
    setActiveTab("login"); // Переключаем на вкладку входа после регистрации
  } catch (error) {
    console.error("Registration error:", error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 400px;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.close-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  color: #666;
}

.auth-tabs {
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.auth-tabs button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: 500;
  color: #666;
  border-bottom: 2px solid transparent;
}

.auth-tabs button.active {
  color: #000;
  border-bottom-color: #000;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.auth-form h3 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.auth-form input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  font-size: 1rem;
}

.auth-form button[type="submit"] {
  padding: 0.75rem;
  background: #000;
  color: white;
  border: none;
  border-radius: 0.25rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.auth-form button[type="submit"]:hover {
  background: #333;
}

.auth-form button[type="submit"]:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>

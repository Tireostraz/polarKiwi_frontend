<script setup lang="ts">
import type { LoginStore, RegisterStore } from "~/repository/auth";

/* genetic type argument https://vuejs.org/guide/typescript/composition-api */
defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const auth = useAuthStore();
const error = ref<string>("");
const isSubmitting = ref(false);
const activeTab = ref<"Login" | "Register">("Login");

const loginForm = ref<LoginStore>({
  email: "",
  password: "",
  rememberMe: false,
});

const registerForm = ref<RegisterStore>({
  name: "",
  email: "",
  password: "",
});

async function handleLogin() {
  isSubmitting.value = true;
  error.value = "";
  try {
    await auth.login({
      email: loginForm.value.email,
      password: loginForm.value.password,
      rememberMe: loginForm.value.rememberMe,
    });
    closeModal();
  } catch (e: any) {
    error.value = e.data.error;
    console.error("Login error:", e.data);
  } finally {
    isSubmitting.value = false;
  }
}

async function handleRegistration() {
  isSubmitting.value = true;
  try {
    await auth.register({
      name: registerForm.value.name,
      email: registerForm.value.email,
      password: registerForm.value.password,
    });
    setActiveTab("Login");
  } catch (e: any) {
    error.value = e.data.error;
    console.error("Registration error:", e.data);
  } finally {
    isSubmitting.value = false;
  }
}

function closeModal() {
  console.log("close");
  emit("close");
}

function setActiveTab(newValue: "Login" | "Register") {
  activeTab.value = newValue;
}
</script>
<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <button class="modal-close" @click="closeModal">×</button>
      <div class="auth-tabs">
        <button
          :class="{ active: activeTab === 'Login' }"
          @click="setActiveTab('Login')"
        >
          Login
        </button>
        <button
          :class="{ active: activeTab === 'Register' }"
          @click="setActiveTab('Register')"
        >
          Register
        </button>
      </div>

      <form v-if="activeTab === 'Login'" class="auth-form">
        <h3>Login to your account</h3>
        <input
          v-model="loginForm.email"
          type="email"
          placeholder="Email"
          required
        />
        <input
          v-model="loginForm.password"
          type="password"
          placeholder="Password"
          required
        />
        <div v-if="error" class="login-error">{{ error }}</div>
        <div>
          <input
            v-model="loginForm.rememberMe"
            type="checkbox"
            id="remamberMe"
          />
          <label for="remamberMe">Запомнить меня</label>
        </div>
        <button @click="handleLogin" :disabled="isSubmitting">
          {{ isSubmitting ? "Loggin in..." : "Login" }}
        </button>
      </form>
      <form
        v-else-if="activeTab === 'Register'"
        class="auth-form"
        autocomplete="off"
      >
        <h3>Create new account</h3>
        <input
          v-model="registerForm.name"
          type="text"
          placeholder="Name"
          required
        />
        <input
          v-model="registerForm.email"
          type="email"
          placeholder="Email"
          required
          autocomplete="off"
        />
        <input
          v-model="registerForm.password"
          type="password"
          placeholder="Password"
          required
        />
        <input type="password" placeholder="Confirm password" required />
        <div v-if="error" class="login-error">{{ error }}</div>
        <button @click="handleRegistration" :disabled="isSubmitting">
          {{ isSubmitting ? "Registration..." : "Registrate" }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
}
.modal-content {
  background: white;
  position: relative;
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}
.modal-close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}
.auth-tabs {
  display: flex;
}

.auth-tabs button {
  flex: 1;
  font-size: 0.8rem;
  border: none;
  background: none;
  padding: 0.75rem;
  color: rgba(0, 0, 0, 0.6);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.auth-tabs button.active {
  color: #000;
  border-bottom: 2px solid black;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.auth-form input {
  padding: 12px;
  border: 1px solid #666;
  border-radius: 5px;
}

.auth-form button {
  color: white;
  background: #000;
  padding: 0.75rem;
  border-radius: 5px;
  font-size: 1rem;
}
</style>

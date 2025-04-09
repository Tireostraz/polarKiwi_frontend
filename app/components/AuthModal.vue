<script setup lang="ts">
import { ref } from "vue";
/* genetic type argument https://vuejs.org/guide/typescript/composition-api */
defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

function closeModal() {
  console.log("close");
  emit("close");
}

const activeTab = ref("");
console.log(activeTab.value);

function setActiveTab(newValue) {
  activeTab.value = newValue;
}
</script>
<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <button @click="closeModal">Close</button>
      <button @click="setActiveTab('Login')">Login</button>
      <button @click="setActiveTab('Register')">Register</button>

      <form v-if="activeTab === 'Register'">
        <h3>Create new account</h3>
        <input type="text" value="text" />
        <input type="password" />
        <button>Submit</button>
      </form>

      <form v-else-if="activeTab === 'Login'">
        <h3>Login to your account</h3>
        <input type="text" />
        <input type="password" />
        <Button>Submit</Button>
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
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}
</style>

<script setup lang="ts">
definePageMeta({ layout: false });

const route = useRoute();
const { $api } = useNuxtApp();
const definitionsStore = useDefinitionStore();

const projectId = computed(() => route.params.id as string);

const { data: project } = await useAsyncData(
  `project-${projectId.value}`,
  async () => {
    try {
      const result = await $api.projects.getById(projectId.value);
      return result;
    } catch (err) {
      console.error("❌ Error in getById", err);
      return null;
    }
  },
  { server: false }
);

const { data: template } = await useAsyncData(
  `template-${projectId.value}`,
  () => $api.definitions.getTemplate(projectId.value),
  { server: false }
);

const { data: content } = await useAsyncData(
  `content-${projectId.value}`,
  () => $api.definitions.getContent(projectId.value),
  { server: false }
);

/* onMounted(() => {
  window.addEventListener("beforeunload", updateProjectBeforeExit);
});
onUnmounted(() => {
  window.removeEventListener("beforeunload", updateProjectBeforeExit);
}); */

const isAutoPlacing = ref(true);

//Логика для сохранения проекта при обновлении/закрытии вкладки
/* async function updateProjectBeforeExit() {
  if (project.value) {
    try {
      await projects.updateProject(project.value);
    } catch (e) {
      console.error("Ошибка при обновлении проекта перед выходом:", e);
    }
  }
} */

function showInfo() {
  console.log("✅ Project:", project.value);
  console.log("✅ Template:", template.value);
  console.log("✅ Content:", content.value);
}
</script>

<template>
  <div class="base-editor-layout">
    <client-only>
      <div class="workspace">
        <div class="workspace-info">
          <div>Проект: {{}}</div>
          <input type="checkbox" v-model="isAutoPlacing" />
          <label>Изображений:</label>

          <UButton color="info" @click="console.log('save project')"
            >Сохранить проект</UButton
          >
          <UButton color="info" @click="showInfo">Инфо</UButton>
        </div>
        <div class="flex-row-container">
          <div class="editor-panel">
            <EditorPanel :project-id="projectId" />
          </div>

          <div class="workspace-container">
            <EditorPlaceholder
              v-for="page in content?.definition.pages"
              :page="page"
              :page-definition="
                template?.definition.pageDefinitions.find(
                  (pageDefinition) =>
                    pageDefinition.key === page.pageDefinitionKey
                )
              "
            />
          </div>
        </div>
      </div>
    </client-only>
  </div>
</template>

<style scoped>
.base-editor-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.workspace {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
}

.workspace-info {
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  flex-shrink: 0;
  overflow: hidden;
}

.flex-row-container {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
  height: 100%;
}

.editor-panel {
  width: 250px; /* ширина панели */
  flex-shrink: 0;
  overflow: hidden;
  background-color: #f3f3f3; /* для визуального разделения */
}

.workspace-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  gap: 28px;
  padding: 40px 50px;
  overflow-y: auto;
}

.submit-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #2e7d32;
  color: white;
  padding: 10px 16px;
  border-radius: 4px;
  border: none;
  font-size: 14px;
  cursor: pointer;
}
</style>

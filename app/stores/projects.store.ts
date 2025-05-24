import { defineStore } from "pinia";
import type { Project } from "~/repository/projects";
import type { Product } from "~/repository/products";

export const useProjectsStore = defineStore(
  "projects",
  () => {
    const addedProjects = ref<Project[]>([]);
    const totalProjects = computed(() => addedProjects.value.length);

    const { $toast, $api } = useNuxtApp();
    const authStore = useAuthStore();

    const loadProjects = async () => {
      try {
        const projects = await $api.projects.getAll();
        addedProjects.value = projects;
      } catch (e) {
        console.error("Ошибка загрузки проектов", e);
        // TODO $toast добавить $toast.error
      }
    };

    const addProject = async (product: Product) => {
      const userId = authStore.user?.id;

      if (!userId) {
        $toast.authError("Вы не авторизованы");
        return;
      }
      const newProjectData: Omit<Project, "id" | "createdAt" | "updatedAt"> = {
        userId,
        title: product.title,
        type: "photo", //TODO Добавить type (вместо slug) в Product и в БД
        format: product.slug,
        productId: product.id,
        status: "draft",
        pages: Array.from({ length: product.pages_quantity }, () => ({
          id: crypto.randomUUID(),
          layout: null,
          elements: [],
          textBlocks: [],
        })),
        photos: [],
      };

      try {
        const dto = await $api.projects.create(newProjectData);
        const project = dto;

        addedProjects.value.push(project);
        $toast.projectAdded(product.title);
      } catch (e) {
        console.error("Ошибка создания проекта:", e);
      }
    };

    const removeProject = async (id: string) => {
      try {
        await $api.projects.remove(id);
        addedProjects.value = addedProjects.value.filter((p) => p.id !== id);
        console.log("Проект удалён");
        //$toast.success("Проект удалён");
      } catch (e) {
        console.error("Ошибка удаления проекта:", e);
        //$toast.error("Не удалось удалить проект");
      }

      addedProjects.value = addedProjects.value.filter(
        (project) => project.id !== id
      );
    };

    const updateProject = async (project: Project) => {
      try {
        const updated = await $api.projects.update(project.id, {
          title: project.title,
          type: project.type,
          format: project.format,
          productId: project.productId,
          status: project.status,
          pages: project.pages,
          photos: project.photos,
        });
        const updatedProject = updated;

        const index = addedProjects.value.findIndex(
          (p) => p.id === updatedProject.id
        );
        if (index !== -1) addedProjects.value[index] = updatedProject;
      } catch (e) {
        console.error("Ошибка обновления проекта:", e);
        //$toast.error("Не удалось сохранить проект");
      }
    };

    const duplicateProject = async (project: Project) => {
      try {
        const cloneData: Omit<Project, "id" | "createdAt" | "updatedAt"> = {
          userId: project.userId,
          title: project.title + " (копия)",
          type: project.type,
          format: project.format,
          productId: project.productId,
          status: "draft",
          pages: structuredClone(project.pages),
          photos: structuredClone(project.photos),
        };

        const dto = await $api.projects.create(cloneData);
        const duplicated = dto;
        addedProjects.value.push(duplicated);
        //$toast.success("Проект продублирован");
      } catch (e) {
        console.error("Ошибка дублирования:", e);
        //$toast.error("Не удалось продублировать проект");
      }
    };

    const renameProject = async (newTitle: string, id: string) => {
      const project = addedProjects.value.find((p) => p.id === id);
      if (!project) return;

      project.title = newTitle;
      project.updatedAt = new Date();

      await updateProject(project);
    };

    return {
      addedProjects,
      totalProjects,
      loadProjects,
      addProject,
      removeProject,
      updateProject,
      duplicateProject,
      renameProject,
    };
  },
  {
    persist: true,
  }
);

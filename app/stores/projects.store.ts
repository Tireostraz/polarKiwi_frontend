import { defineStore } from "pinia";
import type { Project } from "~/repository/projects";
import type { Product } from "~/repository/products";

export const useProjectsStore = defineStore(
  "projects",
  () => {
    const addedProjects = ref<Project[]>([]);
    const totalProjects = computed(() => addedProjects.value.length);
    const { $toast } = useNuxtApp();
    const authStore = useAuthStore();

    const addProject = (product: Product) => {
      const userId = authStore.user?.id; //TODO сделать из userId string и задавать его как crypto.randomUUID(). Сейчас он берется из БД

      if (!userId) {
        $toast.authError("Вы не авторизованы");
        return;
      }
      const newProject: Project = {
        id: crypto.randomUUID(),
        userId,
        title: product.title,
        type: "photo", //TODO Добавить type (вместо slug) в Product и в БД
        format: product.slug,
        productId: product.id,
        status: "draft",
        createdAt: new Date(),
        updatedAt: new Date(),
        pages: Array.from({ length: product.pages_quantity }, () => ({
          id: crypto.randomUUID(),
          layout: null,
          elements: [],
          textBlocks: [],
        })),
        photos: [],
      };

      addedProjects.value.push(newProject);
      $toast.projectAdded(product.title);
    };

    const removeProject = (id: number) => {
      /* addedProjectsIds.value = addedProjectsIds.value.filter(
        (pid) => pid !== id
      ); */
      addedProjects.value = addedProjects.value.filter(
        (project) => project.productId !== id
      );
    };

    const duplicateProject = (project: Project) => {
      const newProject = structuredClone(project);
      newProject.id = crypto.randomUUID();
      newProject.createdAt = new Date();
      newProject.updatedAt = new Date();
      addedProjects.value.push(newProject);
    };

    const renameProject = (newTitle: string, id: string) => {
      /* const projectIndex = addedProjects.value.findIndex(
        (project) => project.id === id
      );
      if (addedProjects.value[projectIndex]) {
        addedProjects.value[projectIndex].title = newTitle;
      } */
      const project = addedProjects.value.find((p) => p.id === id);
      if (project) {
        project.title = newTitle;
        project.updatedAt = new Date();
      }
    };

    return {
      totalProjects,
      addedProjects,
      duplicateProject,
      addProject,
      removeProject,
      renameProject,
    };
  },
  {
    persist: true,
  }
);

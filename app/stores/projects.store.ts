import { defineStore } from "pinia";
import type { Project } from "~/repository/projects";

export const useProjectsStore = defineStore(
  "projects",
  () => {
    const addedProjects = ref<Project[]>([]);
    const totalProjects = computed(() => addedProjects.value.length);
    const { $toast } = useNuxtApp();

    const addProject = (
      title: string,
      productId: number,
      preview: string,
      format: string,
      pagesQuantity: number,
      price: number,
      shortDescription: string
    ) => {
      addedProjects.value.push({
        id: crypto.randomUUID(),
        title,
        productId,
        preview,
        format,
        pagesQuantity,
        price,
        shortDescription,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      $toast.projectAdded(title);
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
      const newProject = { ...project };
      newProject.id = crypto.randomUUID(); // делаем новый ID проекта
      addedProjects.value.push(newProject);
    };

    const renameProject = (newTitle: string, id: string) => {
      const projectIndex = addedProjects.value.findIndex(
        (project) => project.id === id
      );
      if (addedProjects.value[projectIndex]) {
        addedProjects.value[projectIndex].title = newTitle;
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

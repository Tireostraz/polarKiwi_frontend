import { defineStore } from "pinia";
import type { Project } from "~/repository/projects";

export const useProjectsStore = defineStore(
  "projects",
  () => {
    const projects = ref<Project[]>([]);
    const addedProjectsIds = ref<number[]>([]);
    const totalProjects = computed(() => addedProjectsIds.value.length);
    const { $toast } = useNuxtApp();

    const addProject = (
      id: number,
      title: string,
      preview: string,
      price: number
    ) => {
      if (!addedProjectsIds.value.includes(id)) {
        addedProjectsIds.value.push(id);
        projects.value.push({
          id: crypto.randomUUID(),
          title,
          productId: id,
          preview,
          price,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        $toast.projectAdded(title);
      }
    };

    const removeProject = (id: number) => {
      addedProjectsIds.value = addedProjectsIds.value.filter(
        (pid) => pid !== id
      );
      projects.value = projects.value.filter(
        (project) => project.productId !== id
      );
    };

    return {
      addedProjectsIds,
      totalProjects,
      projects,
      addProject,
      removeProject,
    };
  },
  {
    persist: true,
  }
);

import { defineStore } from "pinia";
import type { Project } from "~/repository/projects";

export const useProjectsStore = defineStore(
  "projects",
  () => {
    const addedProjectsIds = ref<number[]>([]);
    const projects = ref<Project[]>([]);
    const { $toast } = useNuxtApp();

    const addProject = (id: number, title: string) => {
      if (!addedProjectsIds.value.includes(id)) {
        addedProjectsIds.value.push(id);
        $toast.projectAdded(title);
      }
    };

    const removeProject = (id: number) => {
      addedProjectsIds.value = addedProjectsIds.value.filter(
        (pid) => pid !== id
      );
      projects.value = projects.value.filter((p) => p.id !== id);
      //$toast.info("Проект удалён");
    };

    return {
      addedProjectsIds,
      projects,
      addProject,
      removeProject,
    };
  },
  {
    persist: true,
  }
);

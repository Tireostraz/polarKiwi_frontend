import { defineStore } from "pinia";
import type { Product } from "~/repository/products";
import type { Project } from "~/repository/projects";

export const useProjectsStore = defineStore(
  "projects",
  () => {
    const addedProjectsIds = ref<number[]>([]);
    const projects = ref<Project[]>([]);
    const currentProject = ref<Project | null>(null);
    const { $toast } = useNuxtApp();

    const addProject = (id: number, title: string) => {
      addedProjectsIds.value.push(id);
      console.log(addedProjectsIds.value);
      $toast.projectAdded(title);
    };

    const removeProject = (projectId: string) => {
      projects.value = projects.value.filter((p) => p.id !== projectId);
    };

    const setCurrentProject = (projectId: string) => {
      currentProject.value =
        projects.value.find((p) => p.id === projectId) || null;
    };

    /* const updateProject = (projectId: string, updates: Partial<Project>) => {
      const index = projects.value.findIndex(p => p.id === projectId);
      if (index !== -1) {
        projects.value[index] = {
          ...projects.value[index],
          ...updates,
          updatedAt: new Date()
        };
      }
    }; */

    return {
      addedProjectsIds,
      projects,
      currentProject,
      addProject,
      removeProject,
      setCurrentProject,
      //updateProject,
    };
  },
  {
    persist: true,
  }
);

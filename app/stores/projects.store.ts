import { defineStore } from "pinia";
import type { Product } from "~/repository/products";
import type { Project } from "~/repository/projects";

export const useProjectsStore = defineStore(
  "projects",
  () => {
    const projects = ref<Project[]>([]);
    const currentProject = ref<Project | null>(null);

    const addProject = (product: Product) => {
      let project: Project;

      // Создаем проект в зависимости от категории продукта
      if (product.category === "photos") {
        project = {
          id: crypto.randomUUID(),
          productId: product.id,
          type: "photo",
          createdAt: new Date(),
          updatedAt: new Date(),
          status: "draft",
          images: [],
          format: "10x15", // По умолчанию
        };
      } else if (product.category === "smsbooks") {
        project = {
          id: crypto.randomUUID(),
          productId: product.id,
          type: "smsbook",
          createdAt: new Date(),
          updatedAt: new Date(),
          status: "draft",
          pages: Array(10)
            .fill(0)
            .map((_, i) => ({
              number: i + 1,
              layout: "default",
            })),
        };
      } else {
        // Базовый проект для других типов
        project = {
          id: crypto.randomUUID(),
          productId: product.id,
          type: "photo", // или другой тип по умолчанию
          createdAt: new Date(),
          updatedAt: new Date(),
          status: "draft",
          images: [],
          format: "default",
        };
      }

      projects.value.push(project);
      return project;
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

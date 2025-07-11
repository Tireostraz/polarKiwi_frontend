import { defineStore } from "pinia";
import type {
  CreateProjectDTO,
  Project,
  ProjectId,
} from "~/repository/projects";
import type { Product } from "~/repository/products";

export const useProjectsStore = defineStore(
  "projects",
  () => {
    const addedProjects = ref<Project[]>([]);
    const draftProjects = ref<ProjectId[]>([]);
    const cartProjects = ref<ProjectId[]>([]);

    const totalDraftProjects = computed(() =>
      draftProjects.value.reduce((acc, val) => acc + val.quantity, 0)
    );

    const totalCartProjects = computed(() =>
      cartProjects.value.reduce((acc, val) => acc + val.quantity, 0)
    );
    const totalProjects = computed(() => addedProjects.value.length);

    const { $toast, $api } = useNuxtApp();
    const authStore = useAuthStore();

    const loadProjects = async () => {
      try {
        const projects = await $api.projects.getAll();
        addedProjects.value = projects;
      } catch (e) {
        console.error("Ошибка загрузки проектов", e);
        $toast.base.add({
          title: "Не удалось загрузить проекты",
          color: "warning",
        });
      }
    };

    const getProjectsIds = async () => {
      try {
        const projectIds = await $api.projects.getIds();
        cartProjects.value = projectIds.response.cart_projects;
        draftProjects.value = projectIds.response.draft_projects;
      } catch (e) {
        console.error("Ошибка загрузки идентификаторов проектов", e);
      }
    };

    const addProject = async (product: Product) => {
      const userId = authStore.user?.id;
      const guestId = authStore.guestId;

      if (!userId && !guestId) {
        $toast.authError("Вы не авторизованы");
        return;
      }
      const newProjectData: CreateProjectDTO = {
        title: product.title,
        type: "photo", //TODO Добавить type (вместо slug) в Product и в БД
        format: product.slug,
        product_id: product.id,
        pages_quantity: product.pages_quantity,
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
        const clonedProject = await $api.projects.clone(project.id);
        const duplicated = clonedProject;
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
      cartProjects,
      draftProjects,
      totalDraftProjects,
      totalCartProjects,
      totalProjects,
      loadProjects,
      getProjectsIds,
      addProject,
      removeProject,
      updateProject,
      duplicateProject,
      renameProject,
    };
  },
  {
    persist: true /* {
      key: "projects",
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
    }, */,
  }
);

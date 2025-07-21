import { defineStore } from "pinia";
import type { Template } from "~/repository/definitions";

export const useDefinitionStore = defineStore("definition", () => {
  const getTemplate = async (id: string) => {
    const { $api } = useNuxtApp();
    const template = ref<Template>();
    try {
      const res = await $api.definitions.getTemplate(id);
      template.value = res;
      console.log("Template:", template.value);
    } catch (e) {
      console.error("Ошибка при получении шаблона", e);
    }
  };
  return {
    getTemplate,
  };
});

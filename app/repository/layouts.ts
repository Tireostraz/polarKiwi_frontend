//import Konva from "konva";

export interface Layout {
  id: string;
  name: string;
  type: "cover" | "page"; // обложка или страница
  previewUrl: string; // для отображения превью
  //data: Konva.NodeConfig | Konva.GroupConfig; // конфигурация сцены
  data: string | null;
}

export function createLayoutsRepository(appFetch: typeof $fetch) {
  return {
    all() {
      return appFetch<Layout[]>("/layouts", {
        method: "GET",
      });
    },
    byId(id: number) {
      return appFetch<Layout>(`/layouts/${id}`, {
        method: "GET",
      });
    },
  };
}

export interface Layout {
  id: string;
  name: string;
  type: "cover" | "page"; // обложка или страница
  previewUrl: string; // для отображения превью
  //data: Konva.NodeConfig | Konva.GroupConfig; // конфигурация сцены
  data: string | null;
}

export interface PhotoLayout {
  id: number;
  title: string;
  quantity: number;
  size: {
    width: number;
    height: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
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
    getPhotoLayout(format: string) {
      return appFetch<PhotoLayout>("/layouts/photo", {
        method: "POST",
        body: { format: format },
      });
    },
  };
}

import type { PhotoLayout } from "~/repository/layouts";

export interface Project {
  id: string;
  userId: number; //чей проект
  title: string;
  type: "photo" | "smsbook" | "poster";
  format: string;
  productId: number; //id продукта, соответствующего данному проекту
  status: "draft" | "completed" | "in_cart";
  createdAt: Date;
  updatedAt: Date;
  pages: ProjectPage[];
  photos: UploadedPhoto[];
}

export interface ProjectId {
  id: string;
  quantity: number;
}

export interface ProjectIdsDTO {
  response: {
    cart_projects: ProjectId[];
    draft_projects: ProjectId[];
  };
}

//это либо 1 страница смсбука либо для фото плейсхолдер. На одну страницу/шаблон фото 1 шаблон и несколько фото
export interface ProjectPage {
  id: string;
  layout: PhotoLayout | null; // здесь храним переопределённый layout. В данный момент тут PhotoLayout, нужно изменить чтобы был Layout для смсбуков также
  elements: PhotoData[]; // заполненные placeholder'ы или пустые
  textBlocks: TextElement[];
}

export interface PhotoData {
  id: string; //уникальный id конкретной картинки
  src: string; //картинка в виде base64
  width: number;
  height: number;
  crop?: {
    cropX: number;
    cropY: number;
    cropWidth: number;
    cropHeight: number;
  };
  scale: number;
  rotation: number;
}

interface TextElement {
  id: string; // id текстового поля (из layout)
  text: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  alignment?: "left" | "center" | "right";
}

export interface UploadedPhoto {
  id: string;
  url: string;
  used: boolean;
  uploadedAt: Date;
  updatedAt: Date;
  // Метаинформация, например, ориентация, EXIF и т.п.
}

// DTO - приходит с сервера
export interface ProjectDTO {
  id: string;
  user_id: number;
  title: string;
  type: "photo" | "smsbook" | "poster";
  format: string;
  product_id: number;
  status: "draft" | "completed" | "in_cart";
  pages: ProjectPage[];
  photos: UploadedPhoto[];
  created_at: string;
  updated_at: string;
}
// DTO - уходит на сервер при создании
export interface CreateProjectDTO {
  title: string;
  type: string;
  format: string;
  product_id: number;
  pages_quantity: number;
}

// Преобразование
export function fromDTO(dto: ProjectDTO): Project {
  return {
    id: dto.id,
    userId: dto.user_id,
    title: dto.title,
    type: dto.type,
    format: dto.format,
    productId: dto.product_id,
    status: dto.status,
    pages: dto.pages,
    photos: dto.photos,
    createdAt: new Date(dto.created_at),
    updatedAt: new Date(dto.updated_at),
  };
}

export function toDTO(project: Project): ProjectDTO {
  return {
    id: project.id,
    user_id: project.userId,
    title: project.title,
    type: project.type,
    format: project.format,
    product_id: project.productId,
    status: project.status,
    pages: project.pages,
    photos: project.photos,
    created_at: project.createdAt.toISOString(),
    updated_at: project.updatedAt.toISOString(),
  };
}

// Репозиторий
export function createProjectRepository(appFetch: typeof $fetch) {
  return {
    // Получение всех проектов пользователя
    async getAll(): Promise<Project[]> {
      const guestId = useAuthStore().guestId;
      const dtos = await appFetch<ProjectDTO[]>("/projects", {
        method: "GET",
        headers: guestId ? { "x-guest-id": guestId } : undefined,
      });
      return dtos.map(fromDTO);
    },

    //Получение всех id проектов пользователя которые draft и in_cart
    async getIds(): Promise<ProjectIdsDTO> {
      const guestId = useAuthStore().guestId;
      return await appFetch<ProjectIdsDTO>("/projects/ids", {
        method: "GET",
        headers: guestId ? { "x-guest-id": guestId } : undefined,
      });
    },

    // Получение одного проекта
    async get(id: string): Promise<Project> {
      const guestId = useAuthStore().guestId;
      const dto = await appFetch<ProjectDTO>(`/projects/${id}`, {
        method: "GET",
        headers: guestId ? { "x-guest-id": guestId } : undefined,
      });
      return fromDTO(dto);
    },

    // Создание проекта
    async create(data: CreateProjectDTO): Promise<Project> {
      const guestId = useAuthStore().guestId;
      const dto = await appFetch<ProjectDTO>("/projects", {
        method: "POST",
        headers: guestId ? { "x-guest-id": guestId } : undefined,
        body: {
          title: data.title,
          type: data.type,
          format: data.format,
          product_id: data.product_id,
          pages_quantity: data.pages_quantity,
        },
      });
      return fromDTO(dto);
    },

    // Обновление проекта
    async update(
      id: string,
      data: Omit<Project, "id" | "createdAt" | "updatedAt" | "userId">
    ): Promise<Project> {
      const guestId = useAuthStore().guestId;
      const dto = await appFetch<ProjectDTO>(`/projects/${id}`, {
        method: "PUT",
        headers: guestId ? { "x-guest-id": guestId } : undefined,
        body: {
          title: data.title,
          type: data.type,
          format: data.format,
          product_id: data.productId,
          status: data.status,
          pages: data.pages,
          photos: data.photos,
        },
      });
      return fromDTO(dto);
    },

    async clone(projectId: string): Promise<Project> {
      const guestId = useAuthStore().guestId;
      const dto = await appFetch<ProjectDTO>(
        `/projects/${projectId}/duplicate`,
        {
          method: "POST",
          headers: guestId ? { "x-guest-id": guestId } : undefined,
        }
      );
      return fromDTO(dto);
    },

    // Удаление проекта
    async remove(id: string): Promise<void> {
      const guestId = useAuthStore().guestId;
      await appFetch(`/projects/${id}`, {
        method: "DELETE",
        headers: guestId ? { "x-guest-id": guestId } : undefined,
      });
    },
  };
}

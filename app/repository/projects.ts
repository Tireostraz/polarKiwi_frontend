import type { PhotoLayout } from "~/repository/layouts";

interface ProductDTO {
  slug: string;
  price?: number;
  is_customizable_on_web_mobile?: boolean;
  bypass_customization?: boolean;
  is_out_of_stock?: boolean;
  is_quantity_editable?: boolean;
}

interface Product {
  slug: string;
  price?: number;
  isCustomizableOnWebMobile?: boolean;
  bypassCustomization?: boolean;
  isOutOfStock?: boolean;
  isQuantityEditable?: boolean;
}

export interface ProjectDTO {
  id: string;
  title: string;
  subtitle?: string;
  image_url: string;
  total: number;
  status: "draft" | "completed" | "in_cart";
  quantity: number;
  can_be_reordered: boolean;
  created_at: Date;
  updated_at: Date;
  product: ProductDTO;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  total: number;
  status: "draft" | "completed" | "in_cart";
  quantity: number;
  canBeReordered: boolean;
  product: Product;
  createdAt: Date;
  updatedAt: Date;
  expiredAt?: Date;
}

//Для /projects/ids

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

//Для POST /projects создание нового проекта
export interface CreateProjectDTO {
  productSlug: string;
}

//Для GET /projects/{{projectId}} (projectById)
export interface ConfigProjectDTO {
  min_page_count: number;
  max_page_count: any;
  page_increment_step: number;
  page_increment_price: number;
  display_title: string;
  display_format: string;
  display_page_name_singular: string;
  display_page_name_plural: string;
  min_column_count: any;
  max_column_count: any;
  is_zoom_out_enabled: boolean;
  should_start_with_gallery: boolean;
  dpi_thresholds: DpiThresholds;
}

export interface DpiThresholds {
  optimal: number;
  acceptable: number;
}

export interface ProjectByIdDTO {
  response: {
    project: ProjectDTO;
    config: ConfigProjectDTO;
    addons: any[];
  }[];
}

export interface DraftsDTO {
  response: {
    drafts: DraftDTO[];
  };
}

export interface DraftDTO {
  expired_at: Date;
  project: ProjectDTO;
}

function mapProduct(dto: ProductDTO): Product {
  return {
    slug: dto.slug,
    price: dto.price,
    isCustomizableOnWebMobile: dto.is_customizable_on_web_mobile,
    bypassCustomization: dto.bypass_customization,
    isOutOfStock: dto.is_out_of_stock,
    isQuantityEditable: dto.is_quantity_editable,
  };
}

function mapProject(dto: ProjectDTO): Project {
  return {
    id: dto.id,
    title: dto.title,
    subtitle: dto.subtitle ?? null,
    imageUrl: dto.image_url,
    total: dto.total,
    status: dto.status,
    quantity: dto.quantity,
    canBeReordered: dto.can_be_reordered,
    createdAt: new Date(dto.created_at),
    updatedAt: new Date(dto.updated_at),
    product: mapProduct(dto.product),
  };
}

//_________________ Новые интерфейсы

// Репозиторий
export function createProjectRepository(appFetch: typeof $fetch) {
  return {
    async drafts(): Promise<Project[]> {
      const guestId = useAuthStore().guestId;
      const dtosResponse = await appFetch<DraftsDTO>("/projects/drafts", {
        method: "GET",
        headers: guestId ? { "x-guest-id": guestId } : undefined,
      });
      const dtos = dtosResponse.response.drafts;
      return dtos.map((dto) => {
        const project = mapProject(dto.project);
        return {
          ...project,
          expiredAt: new Date(dto.expired_at),
        };
      }); // возможно сделать потом map для исправления DraftDTO -> нормальный Draft
    },

    //Получение всех id проектов пользователя которые draft и in_cart
    async getIds(): Promise<ProjectIdsDTO> {
      const guestId = useAuthStore().guestId;
      return await appFetch<ProjectIdsDTO>("/projects/ids", {
        method: "GET",
        headers: guestId ? { "x-guest-id": guestId } : undefined,
      });
    },

    // Создание проекта. Отправляем product_slug, ничего не получаем (на самом деле "message": "Project created")
    async create(data: CreateProjectDTO): Promise<void> {
      const guestId = useAuthStore().guestId;
      const dto = await appFetch<void>("/projects", {
        method: "POST",
        headers: guestId ? { "x-guest-id": guestId } : undefined,
        body: {
          product_slug: data.productSlug,
        },
      });
    },

    // Получение одного проекта
    async getById(id: string): Promise<ProjectByIdDTO> {
      const guestId = useAuthStore().guestId;
      const dto = await appFetch<ProjectByIdDTO>(`/projects/${id}`, {
        method: "GET",
        headers: guestId ? { "x-guest-id": guestId } : undefined,
      });
      return dto;
    },

    // Обновление проекта
    /* async update(
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
    }, */

    /* async clone(projectId: string): Promise<Project> {
      const guestId = useAuthStore().guestId;
      const dto = await appFetch<ProjectDTO>(
        `/projects/${projectId}/duplicate`,
        {
          method: "POST",
          headers: guestId ? { "x-guest-id": guestId } : undefined,
        }
      );
      return fromDTO(dto);
    }, */

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

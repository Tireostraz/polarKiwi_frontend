export interface ProjectBase {
  id: string;
  title: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
  status: "draft" | "completed";
}

export interface PhotoProject extends ProjectBase {
  type: "photo";
  images: {
    url: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    rotation: number;
    text?: string;
  }[];
  format: string; // '10x15', '15x20' и т.д.
}

export interface SmsBookProject extends ProjectBase {
  type: "smsbook";
  pages: {
    number: number;
    image?: string;
    text?: string;
    layout: string; // Идентификатор шаблона страницы
  }[];
  coverImage?: string;
}

export type Project = PhotoProject | SmsBookProject;

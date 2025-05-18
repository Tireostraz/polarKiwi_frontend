/* import type { PhotoLayout } from "./layouts";

export interface ProjectBase {
  //не используется
  id: number;
  title: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
  status: "draft" | "completed";
}

export interface PhotoProject extends ProjectBase {
  //не используется
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
  //не используется
  type: "smsbook";
  pages: {
    number: number;
    image?: string;
    text?: string;
    layout: string; // Идентификатор шаблона страницы
  }[];
  coverImage?: string;
}

export type Project = PhotoProject | SmsBookProject; //не используется */

export interface Project {
  id: string;
  title: string;
  productId: number; //id продукта, соответствующего данному проекту
  preview: string; //путь до картинки превью?
  gallery?: string; //путь к папке данного проекта. Надо ли? папка просто по id проекта.
  photoData?: PhotoData[]; //массив типа PhotoData где хранятся все картинки данного проекта, их масштаб кроп и т.д.
  price: string;
  createdAt: Date;
  updatedAt: Date;
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

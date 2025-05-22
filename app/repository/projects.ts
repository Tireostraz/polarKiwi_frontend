import type { PhotoLayout } from "~/repository/layouts";

/*

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
  userId: number; //чей проект
  title: string;
  type: "photo" | "smsbook" | "poster";
  format: string;
  productId: number; //id продукта, соответствующего данному проекту
  status: "draft" | "completed" | "in_cart";
  createdAt: Date;
  updatedAt: Date;
  pages: ProjectPage[];
  photos: PhotoData[];
}

//это либо 1 страница смсбука либо для фото плейсхолдер. На одну страницу/шаблон фото 1 шаблон и несколько фото
interface ProjectPage {
  id: string;
  layout: PhotoLayout; // здесь храним переопределённый layout. В данный момент тут PhotoLayout, нужно изменить чтобы был Layout для смсбуков также
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

interface UploadedPhoto {
  id: string;
  url: string;
  uploadedAt: string;
  // Метаинформация, например, ориентация, EXIF и т.п.
}

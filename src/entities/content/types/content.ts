export interface Content {
  id: number;
  path: string;
  name: string;
  link: null | string;
  mime: string;
  extension: string;
}

export interface YandexFile {
  file: Blob;
  contentType: string;
  filename: string;
}

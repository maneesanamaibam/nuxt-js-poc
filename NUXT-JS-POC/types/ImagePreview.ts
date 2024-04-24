export interface ImagePreviewProps {
  imageFile?: string | File;
  previewName: string;
  properties: {
    [key: string]: string | number | boolean;
  };
}

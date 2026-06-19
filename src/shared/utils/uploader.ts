export type UploadedFile = {
  url: string;
  key: string;
};

export async function uploadFile(): Promise<UploadedFile> {
  throw new Error("Uploader provider is not configured.");
}

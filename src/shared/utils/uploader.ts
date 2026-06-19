import { Readable } from "node:stream";
import type { UploadApiOptions, UploadApiResponse } from "cloudinary";
import { configureCloudinary } from "../config/cloudinary.js";

export type UploadedFile = {
  url: string;
  secureUrl: string;
  key: string;
  publicId: string;
  format: string;
  resourceType: string;
  bytes: number;
  width?: number;
  height?: number;
};

export type UploadFileInput = string | Buffer;

export type UploadFileOptions = Partial<Pick<
  UploadApiOptions,
  "folder" | "public_id" | "resource_type" | "overwrite" | "tags" | "context"
>>;

function mapCloudinaryResponse(response: UploadApiResponse): UploadedFile {
  return {
    url: response.url,
    secureUrl: response.secure_url,
    key: response.public_id,
    publicId: response.public_id,
    format: response.format,
    resourceType: response.resource_type,
    bytes: response.bytes,
    width: response.width,
    height: response.height
  };
}

function uploadBuffer(buffer: Buffer, options: UploadFileOptions): Promise<UploadApiResponse> {
  const cloudinary = configureCloudinary();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      if (!result) {
        reject(new Error("Cloudinary upload did not return a result."));
        return;
      }

      resolve(result);
    });

    Readable.from(buffer).pipe(uploadStream);
  });
}

export async function uploadFile(input: UploadFileInput, options: UploadFileOptions = {}): Promise<UploadedFile> {
  const cloudinary = configureCloudinary();
  const uploadOptions: UploadFileOptions = {
    folder: process.env.CLOUDINARY_UPLOAD_FOLDER ?? "asri",
    resource_type: "auto",
    ...options
  };

  const response = Buffer.isBuffer(input)
    ? await uploadBuffer(input, uploadOptions)
    : await cloudinary.uploader.upload(input, uploadOptions);

  return mapCloudinaryResponse(response);
}

export async function deleteFile(publicId: string, resourceType: string = "image") {
  const cloudinary = configureCloudinary();

  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType
  });
}

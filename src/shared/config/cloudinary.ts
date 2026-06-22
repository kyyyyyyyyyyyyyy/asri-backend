import { v2 as cloudinary } from "cloudinary";

const cloudUrl = process.env.CLOUDINARY_URL;
// const apiKey = process.env.CLOUDINARY_API_KEY;
// const apiSecret = process.env.CLOUDINARY_API_SECRET;

export function isCloudinaryConfigured() {
  return Boolean(cloudUrl);
}

export function configureCloudinary() {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary configuration is missing.");
  }

  cloudinary.config({
    cloudinary_url: cloudUrl,
  });

  return cloudinary;
}

export { cloudinary };

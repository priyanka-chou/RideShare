


import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  api_key: process.env.CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
  secure: true,
});

// Startup pe sirf check (secret/key print nahi hota)
console.log("Cloudinary config loaded:", {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || "MISSING",
  apiKeyPresent: Boolean(process.env.CLOUDINARY_API_KEY),
  apiSecretPresent: Boolean(process.env.CLOUDINARY_API_SECRET),
});

export default cloudinary;
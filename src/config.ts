import { S3Client } from "@aws-sdk/client-s3";

export const API_URL = "";
export const BUCKET = process.env.BUCKET;
export const THUMBNAIL_FOLDER = process.env.THUMBNAIL_FOLDER;
export const s3Client = new S3Client({ region: process.env.REGION });

export const THUMBNAIL_WIDTH = 800;
export const THUMBNAIL_HEIGHT = 600;
export const THUMBNAIL_FILE_SUFFIX = "-thumbnail.jpg";

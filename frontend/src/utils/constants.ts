export const ROLES = {
  ADMIN: 'admin',
  CHAPTER: 'chapter',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const API_URL = 'https://api.example.com';
export const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;
export const AWS_BUCKET = import.meta.env.VITE_AWS_BUCKET;
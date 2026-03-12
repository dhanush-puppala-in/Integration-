export const ROLES = {
  ADMIN: 'admin',
  CHAPTER: 'chapter',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const API_URL = 'https://api.example.com';

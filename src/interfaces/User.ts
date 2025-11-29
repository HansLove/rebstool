// src/interfaces/User.ts
export interface User {
  id: number;
  name: string;
  email: string;
  rol: number;
  slug: string | null;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

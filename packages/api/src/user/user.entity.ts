export interface UserEntity {
  id: string;
  email: string;
  name: string | null;
  role: 'USER' | 'ADMIN';
}

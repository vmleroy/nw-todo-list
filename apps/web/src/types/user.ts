export type UserEntity = {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
};

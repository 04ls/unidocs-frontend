export type UserRole =
  | 'ADMINISTRADOR'
  | 'GESTOR'
  | 'USUARIO'
  | 'APROBADOR'
  | 'AUDITOR';

export interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
  role: UserRole;
  permisos: string[];
}
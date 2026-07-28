export interface Document {
  id: number;
  title: string;
  type: string;
  status: 'BORRADOR' | 'EN_PROCESO' | 'COMPLETADO' | 'RECHAZADO' | 'EN_APROBACION';
  createdAt: string;
  data: Record<string, string | number | boolean>;
}
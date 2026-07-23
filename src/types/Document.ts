export interface Document{
    id: number;
    title: string;
    type: string;
    status: 'BORRADOR' | 'EN_PROCESO' | 'COMPLETADO' | 'RECHAZADO';
    createdAt: string;
    data: Record<string, string>;
}
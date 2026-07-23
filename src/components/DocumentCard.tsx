import type { Document } from '../types/Document';

interface DocumentCardProps{
    document: Document;
    onViewDocument: (document: Document) => void;
}

function getDocumentTypeName(type: string){
    const documentTypes: Record<string, string> = {
        OFI: 'Oficio',
        MEM: 'Memorando',
        CON: 'Constancia',
        RES: 'Resolución',
        ACT: 'Acta',
        CIR: 'Circular',
        DIC: 'Dictamen',
        CTR: 'Contrato',
        VAC: 'Permiso de Vacaiones'
    };

    return documentTypes[type] || type;
}

function getStatusName(status: Document['status']) {
    const statusNames: Record<Document['status'], string> = {
        BORRADOR: 'Borrador',
        EN_PROCESO: 'En proceso',
        COMPLETADO: 'Completado',
        RECHAZADO: 'Rechazado'
    };

    return statusNames[status];
}

export default function DocumentCard({
    document,
    onViewDocument
}: DocumentCardProps) {
    return(
        <article className='document-card'>
            <div className='document-card-header'>
                <div>
                    <h3>{document.title}</h3>
                    <span className='document-type'>
                        Tipo: {getDocumentTypeName(document.type)}
                    </span>
                </div>
                <span 
                    className={`document-status ${document.status.toLowerCase()}`}>
                        {getStatusName(document.status)}
                </span>
            </div>
            <div className='document-card-info'>
                <p>
                    <strong>Creado:</strong>{' '}
                    {new Date(document.createdAt).toLocaleDateString()}
                </p>
            </div>
            <div className='document-card-actions'>
                <button 
                    className='view-all-button'
                    onClick={() => onViewDocument(document)}>
                        👁️ Ver documento
                </button>
            </div>
        </article>
    );
}
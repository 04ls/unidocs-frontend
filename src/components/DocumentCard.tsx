import type { Document } from '../types/Document';

interface DocumentCardProps{
    document: Document;
}

export default function DocumentCard({
    document
}: DocumentCardProps){
    return(
        <article className='document-card'>
            <div className='document-card-header'>
                <div>
                    <h3>{document.title}</h3>
                    <span className='document-type'>
                        {document.type}
                    </span>
                </div>
                <span className={`document-status ${document.status.toLowerCase()}`}>
                    {document.status}
                </span>
            </div>
            <div className='document-card-info'>
                <p>
                    <strong>Creado:</strong>{''}
                    {new Date(document.createdAt).toLocaleDateString()}
                </p>
            </div>
        </article>
    );
}
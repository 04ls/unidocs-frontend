import type { User } from '../types/User'
import type { Document } from '../types/Document'
import DocumentCard from './DocumentCard';

interface DocumentsSectionProps{
    user: User;
    documents: Document[];
}

export default function DocumentsSection({ 
    user, documents 
}: DocumentsSectionProps){
    return(
        <section className='documents-section'>
            <div className="section-header">
                <div>
                    <h2>Mis Documentos</h2>
                    <p>
                        Consulta y administra tus documentos universitarios
                    </p>
                    <p>
                        Usuario: {user.name} {user.lastName}
                    </p>
                </div>
                <button className="upload-button">
                    ➕ Crear documento
                </button>
            </div>

            {documents.length === 0 ?(
                <div className="empty-documents">
                    <div className='empty-icon'>
                        📂
                    </div>
                    <h3>No tienes documentos todavía</h3>
                    <p>
                        Los documentos que crees aparecerán en esta sección
                    </p>
                </div>
            ) : (
                <div className='documents-grid'>
                    {documents.map((document) => (
                        <DocumentCard
                            key={document.id}
                            document={document}
                        />    
                    ))}
                </div>
            )}
        </section>
    );
}
import type { User } from '../types/User';
import type { Document } from '../types/Document';
import DocumentCard from './DocumentCard';
import { useState } from 'react';

interface DocumentsSectionProps {
  user: User;
  documents: Document[];
}

function getFieldName(code: string){
    const fieldNames: Record<string, string> = {
        C01: 'Fecha Fin',
        C02: 'Unidad Destinataria',
        C03: 'Firma',
        C04: 'Observaciones',
        C05: 'Fecha de Envío',
        C06: 'Número de Referencia',
        C07: 'Asunto',
        C08: 'Cuerpo del Texto',
        C10: 'Participantes',
        C11: 'Lugar de Emisión',
        C12: 'Base Legal',
        C13: 'Vigencia',
        C14: 'Monto',
        C15: 'Partes Contratantes',
        C16: 'Días Solicitados',
        C17: 'Fecha de Regreso'
    };

    return fieldNames[code] || code;
}

export default function DocumentsSection({
  user,
  documents
}: DocumentsSectionProps) {

  const [selectedDocument, setSelectedDocument] =
    useState<Document | null>(null);

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
  };

  return (
    <section className="documents-section">

      {selectedDocument ? (

        <div className="document-details">

          <div className="section-header">

            <div>
              <h2>{selectedDocument.title}</h2>

              <p>
                Detalles del documento
              </p>
            </div>

            <button
              className="view-all-button"
              onClick={() => setSelectedDocument(null)}
            >
              ← Volver
            </button>

          </div>

          <div className="document-details-info">

            <p>
              <strong>Tipo:</strong>{' '}
              {selectedDocument.type}
            </p>

            <p>
              <strong>Estado:</strong>{' '}
              {selectedDocument.status}
            </p>

            <p>
              <strong>Fecha de creación:</strong>{' '}
              {new Date(
                selectedDocument.createdAt
              ).toLocaleDateString()}
            </p>

          </div>

          <div className="document-data">

            <h3>Información del documento</h3>

            {Object.entries(selectedDocument.data).map(
              ([key, value]) => (

                <p key={key}>
                  <strong>{getFieldName(key)}:</strong>{' '}
                  {value}
                </p>

              )
            )}

          </div>

        </div>

      ) : (

        <>
          <div className="section-header">

            <div>
              <h2>Mis documentos</h2>

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


          {documents.length === 0 ? (

            <div className="empty-documents">

              <div className="empty-icon">
                📂
              </div>

              <h3>No tienes documentos todavía</h3>

              <p>
                Los documentos que crees aparecerán en esta sección
              </p>

            </div>

          ) : (

            <div className="documents-grid">

              {documents.map((document) => (

                <DocumentCard
                  key={document.id}
                  document={document}
                  onViewDocument={handleViewDocument}
                />

              ))}

            </div>

          )}

        </>

      )}

    </section>
  );
}
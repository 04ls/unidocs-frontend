import type { User } from '../types/User';
import type { Document } from '../types/Document';
import DocumentCard from './DocumentCard';
import { useState } from 'react';

interface DocumentsSectionProps {
  user: User;
  documents: Document[];
  onEditDocument: (document: Document) => void;
  onCreateDocument: () => void;
}

interface DocumentField {
  campo_codigo: string;
  valortexto: string | null;
  valorfecha: string | null;
  valornumerico: number | null;
  valorbooleano: boolean | null;
}

interface DocumentDetailResponse {
  iddocumento: number;
  titulo: string;
  descripcion: string | null;
  fechacreacion: string;
  estado: string;
  error?: string;
  tipodocumentos?: {
    codigo: string;
    nombre: string;
  };
  documentocampos: DocumentField[];
}

function getDocumentTypeName(code: string) {
  const documentTypes: Record<string, string> = {
    MEM: 'Memorando',
    OFI: 'Oficio',
    RES: 'Resolución',
    INF: 'Informe',
    ACT: 'Acta',
    CIR: 'Circular',
    DIC: 'Dictamen',
    CTR: 'Contrato',
    VAC: 'Permiso de Vacaciones'
  };

  return documentTypes[code] || code;
}


function getFieldName(code: string) {
  const fieldNames: Record<string, string> = {
    ASUN: 'Asunto',
    FECH: 'Fecha',
    MONT: 'Monto',
    FIRM: 'Firma',
    CUER: 'Cuerpo del Texto',
    UNID: 'Unidad Destinataria',
    OBSE: 'Observaciones',
    REFE: 'Número de Referencia',
    LUGA: 'Lugar de Emisión',
    BASE: 'Base Legal',
    VIGE: 'Vigencia',
    PART: 'Partes Contratantes',
    DIAS: 'Días Solicitados',
    REGR: 'Fecha de Regreso'
  };

  return fieldNames[code] || code;
}
export default function DocumentsSection({
  user,
  documents,
  onEditDocument,
  onCreateDocument
}: DocumentsSectionProps) {

  const [selectedDocument, setSelectedDocument] =
    useState<Document | null>(null);


  const handleViewDocument = async (document: Document) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('No hay una sesión activa');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/documentos/${document.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data: DocumentDetailResponse = await response.json();

      if (!response.ok) {
        alert(data.error || 'Error al obtener el documento');
        return;
      }

      const documentoDetalle: Document = {
        id: data.iddocumento,

        title: data.titulo,

        type: data.tipodocumentos?.codigo || '',

        status: data.estado.toUpperCase() as Document['status'],

        createdAt: data.fechacreacion,

        data: {
          titulo: data.titulo,

          descripcion:
            data.descripcion || '',

          ...Object.fromEntries(

            data.documentocampos.map(
              (campo: DocumentField) => {

                let valor: string | number | boolean = '';

                if (campo.valortexto !== null) {
                  valor = campo.valortexto;
                }

                else if (campo.valorfecha !== null) {
                  valor = campo.valorfecha.split('T')[0];
                }

                else if (campo.valornumerico !== null) {
                  valor = campo.valornumerico;
                }

                else if (campo.valorbooleano !== null) {
                  valor = campo.valorbooleano;
                }

                return [
                  campo.campo_codigo,
                  valor
                ];

              }
            )

          )

        }

      };

      console.log('Estado recibido del backend: ', data.estado);
      console.log('Estado convertido:', data.estado.toUpperCase());
      console.log('Documento detalle:', documentoDetalle);

      setSelectedDocument(documentoDetalle);
      

    } catch (error) {
      console.error(
        'Error al obtener el documento:',
        error
      );

      alert('No se pudo conectar con el servidor');
    }
  };

  const handleEditDocument = (document: Document) => {
    onEditDocument(document);
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

            <div className="form-actions">

              {selectedDocument.status.toUpperCase() === 'BORRADOR' && (
                <button
                  className="upload-button"
                  onClick={() => {
                    onEditDocument(selectedDocument);
                    setSelectedDocument(null);
                  }}
                >
                  ✏️ Editar documento
                </button>
              )}

              <button
                className="view-all-button"
                onClick={() => setSelectedDocument(null)}
              >
                ← Volver
              </button>

            </div>

        </div>

          <div className="document-details-info">

            <p>
              <strong>Tipo:</strong>{' '}
              {getDocumentTypeName(selectedDocument.type)}
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

            <button className="upload-button" onClick={onCreateDocument}>
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
                  onEditDocument={handleEditDocument}
                />

              ))}

            </div>

          )}

        </>

      )}

    </section>
  );
}
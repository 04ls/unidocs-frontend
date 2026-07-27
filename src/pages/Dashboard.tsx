import { useState,  type ChangeEvent } from 'react';
import type { User } from '../types/User';
import type { Document } from '../types/Document'
import DocumentsSection from '../components/DocumentsSection';

interface DashboardProps {
  user: User;
  documents: Document[];
  onSaveDocument: (document: Document) => void;
  onUpdateDocument: (document: Document) => void;
}

function Dashboard({ 
  user,
  documents,
  onSaveDocument,
  onUpdateDocument 
}: DashboardProps) {
  console.log('Usuario recibido en dashboard: ', user);
  const [activeSection, setActiveSection] = useState('inicio');
  const [selectedDocumentType, setSelectedDocumentType] = useState<string | null>(null);
  const [documentToEdit, setDocumentToEdit] = useState<Document | null>(null);
  const [documentStep, setDocumentStep] = useState<'selection' | 'form'>('selection');

  const handleEditDocument = (document: Document) => {
    setDocumentToEdit(document);
    setSelectedDocumentType(document.type);
    setDocumentStep('form');
    setActiveSection('crear');
  };

  return (
    <main className="dashboard">

      <aside className="sidebar">

        <div className="sidebar-logo">
          <div className="logo">
            UD
          </div>

          <h2>UniDocs</h2>
        </div>

        <nav className="sidebar-nav">

          <button
            className={`nav-item ${activeSection === 'inicio' ? 'active' : ''}`}
            onClick={() => setActiveSection('inicio')}
          >
            🏠 Inicio
          </button>

          {user.role === 'USUARIO' && (
            <>
              <button
                className={`nav-item ${activeSection === 'documentos' ? 'active' : ''}`}
                onClick={() => setActiveSection('documentos')}
              >
                📄 Mis documentos
              </button>

              <button
                className={`nav-item ${activeSection === 'crear' ? 'active' : ''}`}
                onClick={() => setActiveSection('crear')}
              >
                ➕ Crear documento
              </button>

              <button
                className={`nav-item ${activeSection === 'solicitudes' ? 'active' : ''}`}
                onClick={() => setActiveSection('solicitudes')}
              >
                📋 Mis solicitudes
              </button>

              <button
                className={`nav-item ${activeSection === 'historial' ? 'active' : ''}`}
                onClick={() => setActiveSection('historial')}
              >
                🕒 Historial
              </button>
            </>
          )}

          {user.role === 'GESTOR' && (
            <>
              <button className="nav-item">
                📥 Documentos pendientes
              </button>

              <button className="nav-item">
                🔍 Revisar documentos
              </button>

              <button className="nav-item">
                🔄 Flujos de trabajo
              </button>

              <button className="nav-item">
                📋 Historial
              </button>
            </>
          )}

          {user.role === 'APROBADOR' && (
            <>
              <button className="nav-item">
                📋 Pendientes de aprobación
              </button>

              <button className="nav-item">
                ✅ Aprobaciones
              </button>

              <button className="nav-item">
                ❌ Rechazos
              </button>

              <button className="nav-item">
                🕒 Historial
              </button>
            </>
          )}

          {user.role === 'ADMINISTRADOR' && (
            <>
              <button className="nav-item">
                👥 Usuarios
              </button>

              <button className="nav-item">
                🛡️ Roles
              </button>

              <button className="nav-item">
                🏢 Unidades
              </button>

              <button className="nav-item">
                ⚙️ Configuración
              </button>
            </>
          )}

          {user.role === 'AUDITOR' && (
            <>
              <button className="nav-item">
                📄 Documentos
              </button>

              <button className="nav-item">
                🔍 Trazabilidad
              </button>

              <button className="nav-item">
                🕒 Historial de movimientos
              </button>

              <button className="nav-item">
                ✔️ Verificaciones
              </button>
            </>
          )}

        </nav>

        <div className="sidebar-footer">
          <p>UniDocs v1.0</p>
        </div>

      </aside>


      <section className="dashboard-content">

        <header className="dashboard-header">

          <div>
            <h1>
              Bienvenido, {user.name} 👋
            </h1>

            <p>
              {getWelcomeMessage(user.role)}
            </p>
          </div>

          <div className="user-profile">

            <div className="user-avatar">
              {user.name.charAt(0)}
            </div>

            <div>
              <span>
                {user.name} {user.lastName}
              </span>

              <small>
                {getRoleName(user.role)}
              </small>
            </div>

          </div>

        </header>


        {user.role === 'USUARIO' && (
          <>
            {activeSection === 'inicio' && (
              <UserDashboard />
            )}

            {activeSection === 'documentos' && (
              <DocumentsSection 
              user={user}
              documents={documents}
              onEditDocument={handleEditDocument}
              onCreateDocument={() => {
                setSelectedDocumentType(null);
                setDocumentToEdit(null);
                setDocumentStep('selection');
                setActiveSection('crear');
              }}
              />
            )}

            {activeSection === 'crear' && documentStep === 'selection' && (
              <CreateDocumentSection 
                selectedDocumentType = {selectedDocumentType}
                setSelectedDocumentType = {setSelectedDocumentType}
                onContinue={() => setDocumentStep('form')}
              />
            )}

            {activeSection === 'crear' && documentStep === 'form' && (
              <DocumentForm
                documentType={selectedDocumentType}
                onBack={() => {
                  setDocumentStep('selection');
                  setDocumentToEdit(null);
                }}
                onSaveDocument={onSaveDocument}
                existingDocument={documentToEdit}
                onUpdateDocument={onUpdateDocument}
              />  
            )}

            {activeSection === 'solicitudes' && (
              <RequestsSection />
            )}

            {activeSection === 'historial' && (
              <HistorySection />
            )}
          </>
        )}

        {user.role === 'GESTOR' && (
          <ManagerDashboard />
        )}

        {user.role === 'APROBADOR' && (
          <ApproverDashboard />
        )}

        {user.role === 'ADMINISTRADOR' && (
          <AdministratorDashboard />
        )}

        {user.role === 'AUDITOR' && (
          <AuditorDashboard />
        )}

      </section>

    </main>
  );
}


function getWelcomeMessage(role: User['role']) {

  switch (role) {

    case 'USUARIO':
      return 'Gestiona tus documentos y solicitudes universitarias.';

    case 'GESTOR':
      return 'Gestiona documentos y supervisa los flujos de trabajo.';

    case 'APROBADOR':
      return 'Revisa, aprueba y rechaza documentos pendientes.';

    case 'ADMINISTRADOR':
      return 'Administra usuarios, roles y la configuración del sistema.';

    case 'AUDITOR':
      return 'Consulta la trazabilidad y el historial del sistema.';

    default:
      return 'Bienvenido a UniDocs.';
  }
}


function getRoleName(role: User['role']) {

  switch (role) {

    case 'USUARIO':
      return 'Usuario';

    case 'GESTOR':
      return 'Gestor';

    case 'APROBADOR':
      return 'Aprobador';

    case 'ADMINISTRADOR':
      return 'Administrador';

    case 'AUDITOR':
      return 'Auditor';

    default:
      return 'Usuario';
  }
}


function UserDashboard() {
  return (
    <>

      <section className="stats-container">

        <div className="stat-card">
          <span className="stat-icon">📄</span>

          <div>
            <h3>0</h3>
            <p>Mis documentos</p>
          </div>

        </div>


        <div className="stat-card">
          <span className="stat-icon">🔄</span>

          <div>
            <h3>0</h3>
            <p>En proceso</p>
          </div>

        </div>


        <div className="stat-card">
          <span className="stat-icon">✅</span>

          <div>
            <h3>0</h3>
            <p>Completados</p>
          </div>

        </div>

      </section>


      <section className="documents-section">

        <div className="section-header">
          <h2>Mis documentos recientes</h2>

          <button className="view-all-button">
            Ver todos
          </button>
        </div>

        <div className="empty-documents">

          <div className="empty-icon">
            📂
          </div>

          <h3>Aún no tienes documentos</h3>

          <p>
            Puedes comenzar creando un nuevo documento.
          </p>

          <button className="upload-button">
            ➕ Crear documento
          </button>

        </div>

      </section>

    </>
  );
}

interface CreateDocumentSectionProps {
  selectedDocumentType: string | null;
  setSelectedDocumentType: (type: string) => void;
  onContinue: () => void;
}

function CreateDocumentSection({
  selectedDocumentType,
  setSelectedDocumentType,
  onContinue
}: CreateDocumentSectionProps) {

  const documentTypes = [
    {
      code: 'MEM',
      name: 'Memorando',
      icon: '📝',
      description: 'Comunicación interna.'
    },
    {
      code: 'OFI',
      name: 'Oficio',
      icon: '📄',
      description: 'Comunicación externa.'
    },
    {
      code: 'RES',
      name: 'Resolución',
      icon: '📑',
      description: 'Acto administrativo.'
    },
    {
      code: 'INF',
      name: 'Informe',
      icon: '📊',
      description: 'Informe técnico.'
    },
    {
      code: 'ACT',
      name: 'Acta',
      icon: '📒',
      description: 'Registro oficial de una reunión o sesión.'
    },
    {
      code: 'CIR',
      name: 'Circular',
      icon: '📢',
      description: 'Comunicado dirigido a múltiples destinatarios.'
    },
    {
      code: 'DIC',
      name: 'Dictamen',
      icon: '⚖️',
      description: 'Opinión técnica o jurídica sobre un asunto.'
    },
    {
      code: 'CTR',
      name: 'Contrato',
      icon: '📃',
      description: 'Acuerdo formal entre dos o más partes.'
    },
    {
      code: 'VAC',
      name: 'Permiso de Vacaciones',
      icon: '🏖️',
      description: 'Solicitud formal de permiso de vacaciones.'
    }
  ];

  return (
    <section className="documents-section">

      <div className="section-header">

        <div>
          <h2>Crear documento</h2>

          <p>
            Selecciona el tipo de documento que deseas crear.
          </p>
        </div>

      </div>


      <div className="document-types">

        {documentTypes.map((documentType) => (

          <button
            key={documentType.code}
            className={`document-type-card ${
              selectedDocumentType === documentType.code
                ? 'selected'
                : ''
            }`}
            onClick={() =>
              setSelectedDocumentType(documentType.code)
            }
          >

            <span className="document-type-icon">
              {documentType.icon}
            </span>

            <h3>
              {documentType.name}
            </h3>

            <p>
              {documentType.description}
            </p>

            {selectedDocumentType === documentType.code && (
              <span className="selected-indicator">
                ✓ Seleccionado
              </span>
            )}

          </button>

        ))}

      </div>


      {selectedDocumentType && (

        <div className="document-type-action">

          <p>
            Tipo seleccionado:
            <strong>
              {
                documentTypes.find(
                  type => type.code === selectedDocumentType
                )?.name
              }
            </strong>
          </p>

          <button 
            className="upload-button"
            onClick={onContinue}
          >
            Continuar →
          </button>

        </div>

      )}

    </section>
  );
}

interface DocumentFormProps {
  documentType: string | null;
  onBack: () => void;
  onSaveDocument: (document: Document) => void;
  existingDocument?: Document | null;
  onUpdateDocument: (document: Document) => void;
}

type DocumentStatus =
  | 'BORRADOR'
  | 'EN_PROCESO'
  | 'COMPLETADO'
  | 'RECHAZADO';

function DocumentForm({
  documentType,
  onBack,
  onSaveDocument,
  existingDocument,
  onUpdateDocument
}: DocumentFormProps) {

  const [documentData, setDocumentData] = 
    useState<Record<string, string | number | boolean>>(
      existingDocument?.data || {}
    )

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {

    const { name, value } = event.target;

    setDocumentData(previousData => ({
      ...previousData,
      [name]: value
    }));
  }

  const documentTypeIds: Record<string, number> = {
    MEM: 1,
    OFI: 2,
    RES: 3,
    INF: 4,
    ACT: 5,
    CIR: 6,
    DIC: 7,
    CTR: 8,
    VAC: 9
  };

  const documentTypeCodes: Record<number, string> = {
    1: 'MEM',
    2: 'OFI',
    3: 'RES',
    4: 'INF',
    5: 'ACT',
    6: 'CIR',
    7: 'DIC',
    8: 'CTR',
    9: 'VAC'
  };

  const fieldIds: Record<string, number> = {
    ASUN: 1,
    FECH: 2,
    MONT: 3,
    FIRM: 4,
    CUER: 5,
    UNID: 6,
    OBSE: 7,
    REFE: 8,
    LUGA: 9,
    BASE: 10,
    VIGE: 11,
    PART: 12,
    DIAS: 13,
    REGR: 14
  };
  const documentFields: Record<
  string,
  {
    code: string;
    name: string;
    type: 'text' | 'date' | 'number' | 'boolean';
  }[]
> = {

    OFI: [
      { code: 'ASUN', name: 'Asunto', type: 'text' },
      { code: 'FECH', name: 'Fecha', type: 'date' },
      { code: 'UNID', name: 'Unidad Destinataria', type: 'text' },
      { code: 'FIRM', name: 'Firma', type: 'boolean' },
      { code: 'REFE', name: 'Número de Referencia', type: 'text' },
      { code: 'CUER', name: 'Cuerpo del Texto', type: 'text' }
    ],

    MEM: [
      { code: 'ASUN', name: 'Asunto', type: 'text' },
      { code: 'FECH', name: 'Fecha', type: 'date' },
      { code: 'UNID', name: 'Unidad Destinataria', type: 'text' },
      { code: 'FIRM', name: 'Firma', type: 'boolean' },
      { code: 'OBSE', name: 'Observaciones', type: 'text' },
      { code: 'CUER', name: 'Cuerpo del Texto', type: 'text' }
    ],

    RES: [
      { code: 'ASUN', name: 'Asunto', type: 'text' },
      { code: 'FECH', name: 'Fecha', type: 'date' },
      { code: 'FIRM', name: 'Firma', type: 'boolean' },
      { code: 'REFE', name: 'Número de Referencia', type: 'text' },
      { code: 'CUER', name: 'Cuerpo del Texto', type: 'text' },
      { code: 'LUGA', name: 'Lugar de Emisión', type: 'text' },
      { code: 'BASE', name: 'Base Legal', type: 'text' }
    ],

    INF: [
      { code: 'ASUN', name: 'Asunto', type: 'text' },
      { code: 'FECH', name: 'Fecha', type: 'date' },
      { code: 'FIRM', name: 'Firma', type: 'boolean' },
      { code: 'CUER', name: 'Cuerpo del Texto', type: 'text' }
    ],

    ACT: [
      { code: 'ASUN', name: 'Asunto', type: 'text' },
      { code: 'FECH', name: 'Fecha', type: 'date' },
      { code: 'FIRM', name: 'Firma', type: 'boolean' },
      { code: 'CUER', name: 'Cuerpo del Texto', type: 'text' },
      { code: 'PART', name: 'Partes Contratantes', type: 'text' },
      { code: 'LUGA', name: 'Lugar de Emisión', type: 'text' }
    ],

    CIR: [
      { code: 'ASUN', name: 'Asunto', type: 'text' },
      { code: 'FECH', name: 'Fecha', type: 'date' },
      { code: 'UNID', name: 'Unidad Destinataria', type: 'text' },
      { code: 'FIRM', name: 'Firma', type: 'boolean' },
      { code: 'CUER', name: 'Cuerpo del Texto', type: 'text' }
    ],

    DIC: [
      { code: 'ASUN', name: 'Asunto', type: 'text' },
      { code: 'FECH', name: 'Fecha', type: 'date' },
      { code: 'FIRM', name: 'Firma', type: 'boolean' },
      { code: 'REFE', name: 'Número de Referencia', type: 'text' },
      { code: 'CUER', name: 'Cuerpo del Texto', type: 'text' },
      { code: 'BASE', name: 'Base Legal', type: 'text' }
    ],

    CTR: [
      { code: 'ASUN', name: 'Asunto', type: 'text' },
      { code: 'FECH', name: 'Fecha', type: 'date' },
      { code: 'FIRM', name: 'Firma', type: 'boolean' },
      { code: 'CUER', name: 'Cuerpo del Texto', type: 'text' },
      { code: 'VIGE', name: 'Vigencia', type: 'date' },
      { code: 'MONT', name: 'Monto', type: 'number' },
      { code: 'PART', name: 'Partes Contratantes', type: 'text' }
    ],

    VAC: [
      { code: 'FECH', name: 'Fecha', type: 'date' },
      { code: 'UNID', name: 'Unidad Destinataria', type: 'text' },
      { code: 'FIRM', name: 'Firma', type: 'boolean' },
      { code: 'OBSE', name: 'Observaciones', type: 'text' },
      { code: 'BASE', name: 'Base Legal', type: 'text' },
      { code: 'DIAS', name: 'Días Solicitados', type: 'number' },
      { code: 'REGR', name: 'Fecha de Regreso', type: 'date' }
    ]

  };


  const fields = documentType
    ? documentFields[documentType]
    : [];

  const prepararCampos = () => {
    return Object.entries(documentData)
      .filter(([codigo, valor]) =>
        codigo !== 'titulo' &&
        valor !== ''
      )
      .map(([codigo, valor]) => {

        const idcampo = fieldIds[codigo];

        const field = fields.find(
          field => field.code === codigo
        );

        if (!idcampo || !field) {
          return null;
        }

        if (field.type === 'text') {
          return {
            idcampo,
            valortexto: valor
          };
        }

        if (field.type === 'date') {
          return {
            idcampo,
            valorfecha: valor
          };
        }

        if (field.type === 'number') {
          return {
            idcampo,
            valornumerico: Number(valor)
          };
        }

        if (field.type === 'boolean') {
          return {
            idcampo,
            valorbooleano: valor === true
          };
        }

        return null;
      })
      .filter(campo => campo !== null);
  };

  const convertirEstado = (
    estado: string
  ): DocumentStatus => {
    const estadoNormalizado = estado.toUpperCase();
    if(
      estadoNormalizado === 'BORRADOR' ||
      estadoNormalizado === 'EN_PROCESO' ||
      estadoNormalizado === 'COMPLETADO' ||
      estadoNormalizado === 'RECHAZADO'
    ){
      return estadoNormalizado
    }
    return 'BORRADOR'
  };

  const handleSaveDraft = async (
  event: React.FormEvent<HTMLFormElement>
) => {
    event.preventDefault();

    const token = localStorage.getItem('token');

    if (!token) {
      alert('No hay una sesión activa');
      return;
    }

    const idtipodocumento =
      documentTypeIds[documentType || ''];

    if (!idtipodocumento) {
      alert('Tipo de documento no válido');
      return;
    }
    console.log('Datos que se enviarán:', {
      titulo: documentData.titulo,
      idtipodocumento,
      idunidad: 2,
      campos: prepararCampos()
    });

    try {
      const response = await fetch(
        'http://localhost:3000/documentos',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            titulo: documentData.titulo,
            descripcion: documentData.CUER || '',
            idtipodocumento,
            idunidad: 2,
            campos: prepararCampos()
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Error al guardar el documento');
        return;
      }

      const documentoCreado: Document = {
        id: data.iddocumento,

        title: data.titulo,

        type:
          documentTypeCodes[
            data.idtipodocumento
          ] || '',

        status:
          convertirEstado(data.estado),

        createdAt:
          data.fechacreacion,

        data: documentData
      };

      if(existingDocument){
        onUpdateDocument(documentoCreado);
      }else{
        onSaveDocument(documentoCreado);
      }

      alert('Borrador guardado correctamente');

      onBack();

    } catch (error) {
      console.error(
        'Error al guardar documento:',
        error
      );

      alert('No se pudo conectar con el servidor');
    }
  };

  

  return (
    <section className="documents-section">

      <div className="section-header">

        <div>
          <h2>
            {existingDocument ? 'Editar documento' : 'Crear documento'}
          </h2>

          <p>
            {existingDocument
              ? 'Modifica la información del documento'
              : 'Completa la información requerida'
            }
          </p>
        </div>

        <button
          className="view-all-button"
          onClick={onBack}
        >
          ← Volver
        </button>

      </div>


      <form className="document-form" onSubmit={handleSaveDraft}>

        <div className="form-group">

          <label>
            Título del documento
          </label>

          <input
            type="text"
            name="titulo"
            value={String(documentData.titulo ?? '')}
            placeholder="Ingresa el título del documento"
            onChange={handleInputChange}
          />

        </div>


        {fields.map((field) => (

          <div
            className="form-group"
            key={field.code}
          >

            <label>
              {field.name}
            </label>


            {field.type === 'text' && (

              field.name === 'Cuerpo del Texto' ? (

                <textarea
                  name={field.code}
                  rows={6}
                  value={String(documentData[field.code] ?? '')}
                  placeholder={`Ingresa ${field.name.toLowerCase()}`}
                  onChange={handleInputChange}
                />

              ) : (

                <input
                  type="text"
                  name={field.code}
                  value={String(documentData[field.code] ?? '')}
                  placeholder={`Ingresa ${field.name.toLowerCase()}`}
                  onChange={handleInputChange}
                />

              )

            )}


            {field.type === 'date' && (

              <input
                type="date"
                name={field.code}
                value={String(documentData[field.code] ?? '')}
                onChange={handleInputChange}
              />

            )}


            {field.type === 'number' && (

              <input
                type="number"
                name={field.code}
                value={
                  documentData[field.code] == undefined ||
                  documentData[field.code] == ''
                  ? ''
                  :Number(documentData[field.code])
                }
                placeholder={`Ingresa ${field.name.toLowerCase()}`}
                onChange={handleInputChange}
              />

            )}

            {field.type === 'boolean' && (

              <input
                type="checkbox"
                name={field.code}
                checked={
                  documentData[field.code] === true
                }
                onChange={(event) => {

                  setDocumentData(
                    previousData => ({
                      ...previousData,
                      [field.code]:
                        event.target.checked
                    })
                  );

                }}
              />

            )}

          </div>

        ))}


        <div className="form-actions">

          <button
            type="button"
            className="view-all-button"
            onClick={onBack}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="upload-button"
          >
            💾 Guardar borrador
          </button>

        </div>

      </form>

    </section>
  );
  
}

function RequestsSection(){
  return(
    <section className='documents-section'>
      <div className='section-header'>
        <div>
          <h2>Mis solicitudes</h2>
          <p>
            Consulta el estado de tus solicitudes
          </p>
        </div>
      </div>
      <div className='empty-documents'>
        <div className='empty-icon'>
          📋
        </div>
        <h3>No tienes solicitudes</h3>
          <p>
            Tus solicitudes aparecerán aquí
          </p>
      </div>
    </section>
  );
}

function HistorySection(){
  return(
    <section className='documents-section'>
      <div className='section-header'>
        <div>
          <h2>Historial</h2>
          <p>
            Consulta el historial de tus documentos y solicitudes
          </p>
        </div>
      </div>
      <div className='empty-documents'>
        <div className='empty-icon'>
          🕒
        </div>
        <h3>No hay actividad registrada</h3>
        <p>
          Las acciones relacionadas con tus documentos aparecerán aquí
        </p>
      </div>
    </section>
  );
}

function ManagerDashboard() {
  return (
    <>

      <section className="stats-container">

        <div className="stat-card">
          <span className="stat-icon">📥</span>

          <div>
            <h3>0</h3>
            <p>Pendientes</p>
          </div>

        </div>


        <div className="stat-card">
          <span className="stat-icon">🔍</span>

          <div>
            <h3>0</h3>
            <p>En revisión</p>
          </div>

        </div>


        <div className="stat-card">
          <span className="stat-icon">✅</span>

          <div>
            <h3>0</h3>
            <p>Procesados</p>
          </div>

        </div>

      </section>


      <section className="documents-section">

        <h2>Documentos pendientes</h2>

        <div className="empty-documents">

          <div className="empty-icon">
            📥
          </div>

          <h3>No hay documentos pendientes</h3>

          <p>
            Los documentos que requieran gestión aparecerán aquí.
          </p>

        </div>

      </section>

    </>
  );
}


function ApproverDashboard() {
  return (
    <>

      <section className="stats-container">

        <div className="stat-card">
          <span className="stat-icon">📋</span>

          <div>
            <h3>0</h3>
            <p>Pendientes de aprobación</p>
          </div>

        </div>


        <div className="stat-card">
          <span className="stat-icon">✅</span>

          <div>
            <h3>0</h3>
            <p>Aprobados</p>
          </div>

        </div>


        <div className="stat-card">
          <span className="stat-icon">❌</span>

          <div>
            <h3>0</h3>
            <p>Rechazados</p>
          </div>

        </div>

      </section>


      <section className="documents-section">

        <h2>Documentos para aprobación</h2>

        <div className="empty-documents">

          <div className="empty-icon">
            📋
          </div>

          <h3>No hay documentos pendientes</h3>

          <p>
            Los documentos que requieran tu aprobación aparecerán aquí.
          </p>

        </div>

      </section>

    </>
  );
}


function AdministratorDashboard() {
  return (
    <>

      <section className="stats-container">

        <div className="stat-card">
          <span className="stat-icon">👥</span>

          <div>
            <h3>0</h3>
            <p>Usuarios</p>
          </div>

        </div>


        <div className="stat-card">
          <span className="stat-icon">🛡️</span>

          <div>
            <h3>0</h3>
            <p>Roles</p>
          </div>

        </div>


        <div className="stat-card">
          <span className="stat-icon">🏢</span>

          <div>
            <h3>0</h3>
            <p>Unidades</p>
          </div>

        </div>

      </section>


      <section className="documents-section">

        <h2>Administración del sistema</h2>

        <div className="empty-documents">

          <div className="empty-icon">
            ⚙️
          </div>

          <h3>Panel de administración</h3>

          <p>
            Desde aquí podrás administrar los usuarios, roles y unidades del sistema.
          </p>

        </div>

      </section>

    </>
  );
}


function AuditorDashboard() {
  return (
    <>

      <section className="stats-container">

        <div className="stat-card">
          <span className="stat-icon">📄</span>

          <div>
            <h3>0</h3>
            <p>Documentos revisados</p>
          </div>

        </div>


        <div className="stat-card">
          <span className="stat-icon">🔍</span>

          <div>
            <h3>0</h3>
            <p>Movimientos registrados</p>
          </div>

        </div>


        <div className="stat-card">
          <span className="stat-icon">✔️</span>

          <div>
            <h3>0</h3>
            <p>Verificaciones</p>
          </div>

        </div>

      </section>


      <section className="documents-section">

        <h2>Trazabilidad del sistema</h2>

        <div className="empty-documents">

          <div className="empty-icon">
            🔍
          </div>

          <h3>No hay movimientos registrados</h3>

          <p>
            El historial de movimientos y verificaciones aparecerá aquí.
          </p>

        </div>

      </section>

    </>

  );
}
export default Dashboard;


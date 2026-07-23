import { useState, type ChangeEvent } from 'react';
import type { User } from '../types/User';
import type { Document } from '../types/Document'

interface DashboardProps {
  user: User;
  documents: Document[];
  onSaveDocument: (document: Document) => void;
}

function Dashboard({ 
  user,
  documents,
  onSaveDocument 
}: DashboardProps) {
  const [activeSection, setActiveSection] = useState('inicio');
  const [selectedDocumentType, setSelectedDocumentType] = useState<string | null>(null);
  const [documentStep, setDocumentStep] = useState<'selection' | 'form'>('selection');
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
              <DocumentsSection documents={documents} />
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
                onBack={() => setDocumentStep('selection')}
                onSaveDocument={onSaveDocument}
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

function DocumentsSection(){
  return(
    <section className="documents-section">
      <div className="section-header">
        <div>
          <h2>Mis documenos</h2>
          <p>
            Consulta y administra tus documentos universitarios
          </p>
        </div>

        <button className="upload-button">
          ➕ Crear documento
        </button>
      </div>

      <div className="empty-documents">
        <div className="empty-icon">
          📂
        </div>
        <h3>No tienes documentos todavía</h3>
        <p>
          Los documentos que crees aparecerán en esta sección
        </p>
      </div>
    </section>
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
      code: 'OFI',
      name: 'Oficio',
      icon: '📄',
      description: 'Comunicación formal entre unidades o instituciones.'
    },
    {
      code: 'MEM',
      name: 'Memorando',
      icon: '📝',
      description: 'Comunicado interno breve entre dependencias.'
    },
    {
      code: 'CON',
      name: 'Constancia',
      icon: '📋',
      description: 'Certifica una situación académica o laboral.'
    },
    {
      code: 'RES',
      name: 'Resolución',
      icon: '📑',
      description: 'Decisión formal de una autoridad universitaria.'
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

interface DocumentFormProps{
  documentType: string | null;
  onBack: () => void;
}

function DocumentForm({
  documentType,
  onBack
}: DocumentFormProps) {

  const [documentData, setDocumentData] = useState<Record<string, string>>({});
  
  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {

    const { name, value } = event.target;

    setDocumentData(previousData => ({
      ...previousData,
      [name]: value
    }));
  }
  
  const handleSaveDraft = (
    event: React.FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault();

    console.log('Documento guardado:', {
      documentType,
      data: documentData
    });

  alert('Borrador guardado correctamente');

  };

  const documentFields: Record<
    string,
    {
      code: string;
      name: string;
      type: 'text' | 'date' | 'number' | 'file' | 'boolean';
    }[]
  > = {

    OFI: [
      { code: 'C01', name: 'Fecha Fin', type: 'date' },
      { code: 'C02', name: 'Unidad Destinataria', type: 'text' },
      { code: 'C03', name: 'Firma', type: 'file' },
      { code: 'C05', name: 'Fecha de Envío', type: 'date' },
      { code: 'C06', name: 'Número de Referencia', type: 'text' },
      { code: 'C07', name: 'Asunto', type: 'text' },
      { code: 'C08', name: 'Cuerpo del Texto', type: 'text' }
    ],

    MEM: [
      { code: 'C01', name: 'Fecha Fin', type: 'date' },
      { code: 'C02', name: 'Unidad Destinataria', type: 'text' },
      { code: 'C03', name: 'Firma', type: 'file' },
      { code: 'C04', name: 'Observaciones', type: 'text' },
      { code: 'C07', name: 'Asunto', type: 'text' },
      { code: 'C08', name: 'Cuerpo del Texto', type: 'text' }
    ],

    CON: [
      { code: 'C02', name: 'Unidad Destinataria', type: 'text' },
      { code: 'C03', name: 'Firma', type: 'file' },
      { code: 'C05', name: 'Fecha de Envío', type: 'date' },
      { code: 'C08', name: 'Cuerpo del Texto', type: 'text' },
      { code: 'C11', name: 'Lugar de Emisión', type: 'text' }
    ],

    RES: [
      { code: 'C01', name: 'Fecha Fin', type: 'date' },
      { code: 'C03', name: 'Firma', type: 'file' },
      { code: 'C06', name: 'Número de Referencia', type: 'text' },
      { code: 'C08', name: 'Cuerpo del Texto', type: 'text' },
      { code: 'C11', name: 'Lugar de Emisión', type: 'text' },
      { code: 'C12', name: 'Base Legal', type: 'text' }
    ],

    ACT: [
      { code: 'C03', name: 'Firma', type: 'file' },
      { code: 'C05', name: 'Fecha de Envío', type: 'date' },
      { code: 'C08', name: 'Cuerpo del Texto', type: 'text' },
      { code: 'C10', name: 'Participantes', type: 'text' },
      { code: 'C11', name: 'Lugar de Emisión', type: 'text' }
    ],

    CIR: [
      { code: 'C02', name: 'Unidad Destinataria', type: 'text' },
      { code: 'C03', name: 'Firma', type: 'file' },
      { code: 'C05', name: 'Fecha de Envío', type: 'date' },
      { code: 'C07', name: 'Asunto', type: 'text' },
      { code: 'C08', name: 'Cuerpo del Texto', type: 'text' }
    ],

    DIC: [
      { code: 'C03', name: 'Firma', type: 'file' },
      { code: 'C06', name: 'Número de Referencia', type: 'text' },
      { code: 'C08', name: 'Cuerpo del Texto', type: 'text' },
      { code: 'C12', name: 'Base Legal', type: 'text' }
    ],

    CTR: [
      { code: 'C01', name: 'Fecha Fin', type: 'date' },
      { code: 'C03', name: 'Firma', type: 'file' },
      { code: 'C05', name: 'Fecha de Envío', type: 'date' },
      { code: 'C08', name: 'Cuerpo del Texto', type: 'text' },
      { code: 'C13', name: 'Vigencia', type: 'date' },
      { code: 'C14', name: 'Monto', type: 'number' },
      { code: 'C15', name: 'Partes Contratantes', type: 'text' }
    ],

    VAC: [
      { code: 'C01', name: 'Fecha Fin', type: 'date' },
      { code: 'C02', name: 'Unidad Destinataria', type: 'text' },
      { code: 'C03', name: 'Firma', type: 'file' },
      { code: 'C04', name: 'Observaciones', type: 'text' },
      { code: 'C05', name: 'Fecha de Envío', type: 'date' },
      { code: 'C12', name: 'Base Legal', type: 'text' },
      { code: 'C16', name: 'Días Solicitados', type: 'number' },
      { code: 'C17', name: 'Fecha de Regreso', type: 'date' }
    ]

  };

  const fields = documentType
    ? documentFields[documentType]
    : [];

  

  return (
    <section className="documents-section">

      <div className="section-header">

        <div>
          <h2>Crear documento</h2>

          <p>
            Completa la información requerida.
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
            value={documentData.titulo || ''}
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
                  value={documentData[field.code] || ''}
                  placeholder={`Ingresa ${field.name.toLowerCase()}`}
                  onChange={handleInputChange}
                />

              ) : (

                <input
                  type="text"
                  name={field.code}
                  value={documentData[field.code] || ''}
                  placeholder={`Ingresa ${field.name.toLowerCase()}`}
                  onChange={handleInputChange}
                />

              )

            )}


            {field.type === 'date' && (

              <input
                type="date"
                name={field.code}
                value={documentData[field.code] || ''}
                onChange={handleInputChange}
              />

            )}


            {field.type === 'number' && (

              <input
                type="number"
                name={field.code}
                value={documentData[field.code] || ''}
                placeholder={`Ingresa ${field.name.toLowerCase()}`}
                onChange={handleInputChange}
              />

            )}


            {field.type === 'file' && (

              <input
                type="file"
                accept=".pdf,.doc,.docx"
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


import { useEffect, useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import type { User, UserRole } from './types/User';
import type { Document } from './types/Document';
import './App.css';

interface LoginUser {
  idusuario: number;
  correo: string;
  nombre: string;
  roles: string[];
  permisos: string[];
}

interface BackendDocument {
  iddocumento: number;
  codigo: string;
  titulo: string;
  descripcion: string | null;
  fechacreacion: string;

  estado:
  | 'BORRADOR'
  | 'EN_PROCESO'
  | 'COMPLETADO'
  | 'RECHAZADO';

  idtipodocumento: number;
  idunidad: number;

  campos: {
    codigo: string;
    tipo: 'text' | 'date' | 'number' | 'boolean';
    valortexto: string | null;
    valorfecha: string | null;
    valornumerico: number | null;
    valorbooleano: boolean | null;
  }[];
}

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

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);

  const handleSendToReview = async (
    document: Document
  ) => {

    const token = localStorage.getItem('token');

    if (!token) {
      alert('No hay una sesión activa');
      return;
    }

    try {

      const response = await fetch(
        `http://localhost:3000/documentos/${document.id}/estado`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            estado: 'EN_PROCESO',
            observacion: 'Documento enviado a revisión'
          })
        }
      );


      const data = await response.json();


      if (!response.ok) {
        alert(
          data.error ||
          'No se pudo enviar el documento'
        );
        return;
      }


      setDocuments(previousDocuments =>
        previousDocuments.map(doc =>
          doc.id === document.id
            ? {
                ...doc,
                status: 'EN_PROCESO'
              }
            : doc
        )
      );


      alert(
        'Documento enviado a revisión correctamente'
      );


    } catch(error){

      console.error(
        'Error enviando documento:',
        error
      );

      alert(
        'Error de conexión con el servidor'
      );

    }

  };

  const handleLogin = (userData: LoginUser) => {
    console.log('Datos recibidos del login:', userData);
    console.log('Roles recibidos:', userData.roles);

    const rolesNormalizados = userData.roles.map(
      role => role.toUpperCase()
    );

    const userLogged: User = {
      id: userData.idusuario,
      name: userData.nombre,
      lastName: '',
      email: userData.correo,
      role: rolesNormalizados.includes('USUARIO')
        ? 'USUARIO'
        : rolesNormalizados[0] as UserRole,
      permisos: userData.permisos
    };

    console.log('Usuario creado:', userLogged);

    setUser(userLogged);
  };

  useEffect(() => {
    const cargarDocumentos = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No existe un token');
        return;
      }

      try {
        const response = await fetch(
          'http://localhost:3000/documentos',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data: BackendDocument[] =
          await response.json();

        console.log(
          'Respuesta del backend:',
          data
        );

        if (!response.ok) {
          console.error(
            'Error al cargar documentos:',
            data
          );
          return;
        }

        const documentosAdaptados: Document[] =
          data.map((documento) => ({
            id: documento.iddocumento,

            title: documento.titulo,

            type: documentTypeCodes[
              documento.idtipodocumento
            ] || '',

            status: documento.estado.toUpperCase() as Document['status'],

            createdAt: documento.fechacreacion,

            data: {
              titulo: documento.titulo,

              descripcion:
                documento.descripcion || '',

              ...Object.fromEntries(
                documento.campos.map(campo => [
                  campo.codigo,

                  campo.tipo === 'text'
                    ? campo.valortexto || ''

                    : campo.tipo === 'date'
                      ? campo.valorfecha || ''

                      : campo.tipo === 'number'
                        ? String(
                            campo.valornumerico ?? ''
                          )

                        : String(
                            campo.valorbooleano ?? false
                          )
                ])
              )
            }
          }));

        console.log(
          'Documentos adaptados:',
          documentosAdaptados
        );

        setDocuments(documentosAdaptados);

      } catch (error) {
        console.error(
          'Error de conexión al cargar documentos:',
          error
        );
      }
    };

    if (user) {
      cargarDocumentos();
    }
  }, [user]);

  const handleSaveDocument = (
    document: Document
  ) => {
    setDocuments(previousDocuments => [
      ...previousDocuments,
      document
    ]);
  };

  const handleUpdateDocument = (
    updatedDocument: Document
  ) => {
    setDocuments(previousDocuments =>
      previousDocuments.map(document =>
        document.id === updatedDocument.id
          ? updatedDocument
          : document
      )
    );
  };

  return (
    <>
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard
          user={user}
          documents={documents}
          onSaveDocument={handleSaveDocument}
          onUpdateDocument={handleUpdateDocument}
          onSendToReview={handleSendToReview}
        />
      )}
    </>
  );
}

export default App;
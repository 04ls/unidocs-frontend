import { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import type { User } from './types/User';
import type { Document } from './types/Document';
import './App.css';

function App() {
  const [user, setUser] = useState<User | null>(null);

  const [documents, setDocuments] = useState<Document[]>([]);

  const handleLogin = () => {
    const userLogged: User = {
      id: 1,
      name: 'Luis',
      lastName: 'Suazo',
      email: 'luis@universidad.edu',
      role: 'USUARIO'
    };

    setUser(userLogged);
  };

  const handleSaveDocument = (
    document: Document
  ) => {
    setDocuments(previousDocuments => [
      ...previousDocuments,
      document
    ]);
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
        />
      )}
    </>
  );
}

export default App;
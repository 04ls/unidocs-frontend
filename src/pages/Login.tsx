import { useState } from 'react';
import '../App.css';

interface LoginProps {
    onLogin: () => void;
}

function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) {
      alert('Por favor, completa todos los campos');
      return;
    }

    onLogin();
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-header">
          <div className="logo">
            UD
          </div>

          <h1>UniDocs</h1>

          <p>
            Gestor de Documentos Universitarios
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">
              Correo electrónico
            </label>

            <input
              type="email"
              id="email"
              placeholder="ejemplo@universidad.edu"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Contraseña
            </label>

            <input
              type="password"
              id="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <button type="submit">
            Iniciar sesión
          </button>
        </form>

        <a href="#" className="forgot-password">
          ¿Olvidaste tu contraseña?
        </a>
      </section>
    </main>
  );
}

export default Login;
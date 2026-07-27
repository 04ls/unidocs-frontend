import { useState } from 'react';
import '../App.css';

interface LoginProps {
  onLogin: (user: LoginUser) => void;
}

interface LoginUser {
  idusuario: number;
  correo: string;
  nombre: string;
  roles: string[];
  permisos: string[];
}

function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError('');

    if (!email || !password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    try {
      const response = await fetch(
        'http://localhost:3000/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            correo: email,
            password: password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al iniciar sesión');
        return;
      }

      localStorage.setItem('token', data.token);

      onLogin(data.usuario);

    } catch (error) {
      console.error(error);
      setError('No se pudo conectar con el servidor');
    }
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

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">

            <label htmlFor="email">
              Correo electrónico
            </label>

            <input
              type="email"
              id="email"
              placeholder="ejemplo@universidad.edu"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
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
              onChange={(event) =>
                setPassword(event.target.value)
              }
            />

          </div>

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <button type="submit">
            Iniciar sesión
          </button>

        </form>

        <a
          href="#"
          className="forgot-password"
        >
          ¿Olvidaste tu contraseña?
        </a>

      </section>
    </main>
  );
}

export default Login;
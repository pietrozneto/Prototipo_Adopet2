// src/pages/LoginPage.tsx
import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { loginMock } from "../mocks/api";
import { FaPaw, FaUsers } from 'react-icons/fa';
import { useSession } from '../context/SessionContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null);
  const { session, setSession } = useSession();
  // Ensure at least one of the role buttons is selected when the page loads.
  // Default to 'TUTOR' to avoid empty selection causing login errors.
  const [localSelection, setLocalSelection] = useState<typeof session>(() => {
    return session === 'ONG' || session === 'TUTOR' ? session : 'TUTOR';
  });

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await loginMock(email, password);
      // Armazenar token em localStorage para simulação
      localStorage.setItem("token", res.token);
      localStorage.setItem("user_email", res.user.email);
      // set session based on role returned by mock
      setSession(res.user.role === 'ONG' ? 'ONG' : 'TUTOR');
      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Nome de usuário ou senha incorretos");
      }
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="min-h-screen w-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-xl text-neutral-950 font-bold mb-6 text-center">
            Bem-Vindo de Volta!
          </h1>
          {error && <div className="text-red-600 mb-3 text-sm text-center">{error}</div>}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex gap-3 justify-center mb-2">
              <button
                type="button"
                onClick={() => { setLocalSelection('ONG'); }}
                className={`flex items-center gap-2 px-3 py-2 rounded-md border border-black`}
                style={{ backgroundColor: localSelection === 'ONG' ? '#000000' : '#ffffff', color: localSelection === 'ONG' ? '#ffffff' : '#000000' }}
              >
                <FaUsers style={{ color: localSelection === 'ONG' ? '#ffffff' : '#000000' }} />
                <span style={{ color: localSelection === 'ONG' ? '#ffffff' : '#000000' }}>ONG</span>
              </button>

              <button
                type="button"
                onClick={() => { setLocalSelection('TUTOR'); }}
                className={`flex items-center gap-2 px-3 py-2 rounded-md border border-black`}
                style={{ backgroundColor: localSelection === 'TUTOR' ? '#000000' : '#ffffff', color: localSelection === 'TUTOR' ? '#ffffff' : '#000000' }}
              >
                <FaPaw style={{ color: localSelection === 'TUTOR' ? '#ffffff' : '#000000' }} />
                <span style={{ color: localSelection === 'TUTOR' ? '#ffffff' : '#000000' }}>Tutor</span>
              </button>
            </div>
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-2 border-yellow-600 text-neutral-950 p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-2 border-yellow-600 text-neutral-950 p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-neutral-950">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="accent-yellow-600"
                />
                Lembrar senha
              </label>
              <span
                className="text-yellow-600 hover:underline cursor-pointer"
                onClick={() => navigate("/recuperar-senha")}
              >
                Esqueci minha senha
              </span>
            </div>

            <button
              type="submit"
              className="bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700 transition"
            >
              Login
            </button>
          </form>

          

          <p className="text-center mt-4 text-sm text-neutral-950">
            Não tem uma conta?{" "}
            <span
              className="text-yellow-600 hover:underline cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Registre-se
            </span>
          </p>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;

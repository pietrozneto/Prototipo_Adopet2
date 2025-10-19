import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useSession } from '../context/SessionContext';
import { registerMock, AccountRole } from '../mocks/api';
import { FaPaw, FaUsers } from 'react-icons/fa';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { setSession } = useSession();

  const [accountType, setAccountType] = useState<'ADOTANTE' | 'ONG'>('ADOTANTE');
  React.useEffect(() => {
    // Ensure there's always a selected account type when the page loads
    if (!accountType) setAccountType('ADOTANTE');
  }, []);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password || !confirm) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    if (password !== confirm) {
      setError('As senhas não coincidem.');
      return;
    }
    if (!agree) {
      setError('Você precisa aceitar os termos de uso.');
      return;
    }

    setLoading(true);
    (async () => {
      try {
        const role: AccountRole = accountType === 'ONG' ? 'ONG' : 'TUTOR';
        const ok = await registerMock(email, password, role);
        setLoading(false);
        if (!ok) {
          setError('Erro ao criar conta.');
          return;
        }
        localStorage.setItem('token', 'fake_register_token');
        localStorage.setItem('user_email', email);
        // definir sessão conforme tipo
        if (accountType === 'ONG') setSession('ONG'); else setSession('TUTOR');
        navigate('/');
      } catch (err) {
        setLoading(false);
        setError('Erro ao criar conta.');
      }
    })();
  };

  return (
    <div className="min-h-screen w-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow flex justify-center items-start py-12">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-xl font-bold text-center mb-6 text-black">Crie sua conta!</h1>

          <div className="flex items-center justify-center gap-6 mb-4">
            <button
              type="button"
              onClick={() => setAccountType('ONG')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md border border-black`}
              style={{ backgroundColor: accountType === 'ONG' ? '#000000' : '#ffffff', color: accountType === 'ONG' ? '#ffffff' : '#000000' }}
            >
              <FaUsers style={{ color: accountType === 'ONG' ? '#ffffff' : '#000000' }} />
              <span style={{ color: accountType === 'ONG' ? '#ffffff' : '#000000' }}>ONG</span>
            </button>

            <button
              type="button"
              onClick={() => setAccountType('ADOTANTE')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md border border-black`}
              style={{ backgroundColor: accountType === 'ADOTANTE' ? '#000000' : '#ffffff', color: accountType === 'ADOTANTE' ? '#ffffff' : '#000000' }}
            >
              <FaPaw style={{ color: accountType === 'ADOTANTE' ? '#ffffff' : '#000000' }} />
              <span style={{ color: accountType === 'ADOTANTE' ? '#ffffff' : '#000000' }}>Tutor</span>
            </button>
          </div>

          {error && <div className="text-red-600 mb-3 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Nome Completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-2 border-yellow-600 p-2 rounded focus:outline-none text-black placeholder:text-gray-400"
            />

            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-2 border-yellow-600 p-2 rounded focus:outline-none text-black placeholder:text-gray-400"
            />

            <input
              type="text"
              placeholder="CPF"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              className="border-2 border-yellow-600 p-2 rounded focus:outline-none text-black placeholder:text-gray-400"
            />

            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-2 border-yellow-600 p-2 rounded focus:outline-none text-black placeholder:text-gray-400"
            />

            <input
              type="password"
              placeholder="Confirme Sua Senha"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="border-2 border-yellow-600 p-2 rounded focus:outline-none text-black placeholder:text-gray-400"
            />

            <label className="flex items-center gap-2 text-sm text-black">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="accent-yellow-600" />
              Aceito os termos de uso
            </label>

            <button type="submit" className="bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700 transition mt-2">
              {loading ? 'Criando...' : 'Registrar-se'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;

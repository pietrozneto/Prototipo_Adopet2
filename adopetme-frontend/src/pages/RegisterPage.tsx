// src/pages/RegisterPage.tsx

import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; // 👈 Importado o Footer
import { useSession } from '../context/SessionContext';
import { registerMock } from '../mocks/api';
import { FaPaw, FaUsers } from 'react-icons/fa';
import { AccountRole } from '../models/UserModel'; 
import { Loader2 } from 'lucide-react'; // 👈 Importado o ícone de loading

// Validações básicas (mantidas)
const isValidEmailFormat = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidCPFFormat = (cpf: string) => {
    const numbers = cpf.replace(/[^\d]/g, '');
    return numbers.length === 11;
};

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { setSession, setUserName } = useSession(); 

    const [accountType, setAccountType] = useState<'ADOTANTE' | 'ONG'>('ADOTANTE');
    
    // Garantir que o tipo de conta esteja sempre definido
    React.useEffect(() => {
        if (!accountType) setAccountType('ADOTANTE');
    }, [accountType]);
    
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

        // Validação local (mantida)
        if (!name || !email || !password || !confirm || !cpf) {
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
        if (!isValidEmailFormat(email)) {
            setError('O formato do E-mail é inválido.');
            return;
        }
        if (accountType === 'ADOTANTE' && !isValidCPFFormat(cpf)) {
            setError('O formato do CPF é inválido (11 dígitos).');
            return;
        }


        setLoading(true);
        (async () => {
            try {
                const role: AccountRole = accountType === 'ONG' ? 'ONG' : 'TUTOR';
                
                const ok = await registerMock(name, email, cpf, password, role);
                setLoading(false);
                
                if (!ok) {
                    setError('Erro ao criar conta.');
                    return;
                }
                
                // Simulação de sessão após registro
                localStorage.setItem('token', 'fake_register_token');
                localStorage.setItem('user_email', email);
                localStorage.setItem('user_name', name); 
                
                // ATUALIZA O ESTADO DO NOME IMEDIATAMENTE
                setUserName(name); 
                
                // definir sessão conforme tipo
                setSession(role);
                navigate('/');
            } catch (err) {
                setLoading(false);
                // Trata erros vindos do mock 
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Erro ao criar conta.');
                }
            }
        })();
    };

    return (
        <div className="min-h-screen w-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow flex justify-center items-start py-12">
                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                    <h1 className="text-2xl font-bold text-center mb-6 text-black">Crie sua conta!</h1>
                    
                    {/* Seleção de Tipo de Conta */}
                    <div className="flex items-center justify-center gap-6 mb-6">
                        <button
                            type="button"
                            onClick={() => setAccountType('ONG')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-amber-600 transition duration-200 ${accountType === 'ONG' ? 'bg-amber-600 text-white shadow-md' : 'bg-white text-black hover:bg-amber-50'}`}
                        >
                            <FaUsers className="w-5 h-5" />
                            <span className="font-semibold">ONG</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setAccountType('ADOTANTE')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-amber-600 transition duration-200 ${accountType === 'ADOTANTE' ? 'bg-amber-600 text-white shadow-md' : 'bg-white text-black hover:bg-amber-50'}`}
                        >
                            <FaPaw className="w-5 h-5" />
                            <span className="font-semibold">Tutor</span>
                        </button>
                    </div>

                    {error && <div className="text-red-600 mb-4 text-sm text-center bg-red-100 p-2 rounded border border-red-200">{error}</div>}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Nome Completo"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border-2 border-yellow-600/50 p-3 rounded focus:outline-none text-black placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-500"
                            required
                        />

                        <input
                            type="email"
                            placeholder="E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border-2 border-yellow-600/50 p-3 rounded focus:outline-none text-black placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-500"
                            required
                        />

                        <input
                            type="text"
                            placeholder="CPF"
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)}
                            className="border-2 border-yellow-600/50 p-3 rounded focus:outline-none text-black placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-500"
                            required
                        />

                        <input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border-2 border-yellow-600/50 p-3 rounded focus:outline-none text-black placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-500"
                            required
                        />

                        <input
                            type="password"
                            placeholder="Confirme Sua Senha"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            className="border-2 border-yellow-600/50 p-3 rounded focus:outline-none text-black placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-500"
                            required
                        />

                        <label className="flex items-center gap-2 text-sm text-neutral-700">
                            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="accent-yellow-600" />
                            Aceito os termos de uso
                        </label>

                        <button 
                            type="submit" 
                            className="bg-amber-800 text-white py-3 rounded-md font-bold hover:bg-amber-900 transition mt-2 shadow-lg flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                            {loading ? 'Criando...' : 'Registrar-se'}
                        </button>

                        <p className="text-center mt-3 text-sm text-neutral-700">
                            Já tem uma conta? <span 
                                onClick={() => navigate('/login')}
                                className="text-amber-700 hover:underline cursor-pointer font-medium"
                            >
                                Faça Login
                            </span>
                        </p>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default RegisterPage;
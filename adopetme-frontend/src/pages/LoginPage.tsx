// matheus-de-andrade-lourenco/prototipo_adopet/Prototipo_Adopet-83121f52595e1e8153395d49fca8b2dc2b85a109/adopetme-frontend/src/pages/LoginPage.tsx 

import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { loginMock } from "../mocks/api";
import { FaPaw, FaUsers } from 'react-icons/fa';
import { useSession } from '../context/SessionContext';
import { Loader2 } from 'lucide-react'; 

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null);
    const { session, setSession, setUserName } = useSession(); 
    
    const [localSelection, setLocalSelection] = useState<typeof session>(() => {
        return session === 'ONG' || session === 'TUTOR' ? session : 'TUTOR';
    });

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await loginMock(email, password);
            
            // Armazenando informações da sessão e o nome do usuário
            localStorage.setItem("token", res.token);
            localStorage.setItem("user_email", res.user.email);
            localStorage.setItem("user_name", res.user.name); 

            // Atualiza o estado do React Context para exibir o nome na Navbar
            setUserName(res.user.name); 
            
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
        <div className="min-h-screen w-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow flex justify-center items-start py-12">
                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                    <h1 className="text-2xl font-bold text-center mb-6 text-black">Bem-Vindo de Volta!</h1>

                    {/* Botões de Seleção de Perfil (ONG/Tutor) */}
                    <div className="flex items-center justify-center gap-6 mb-6">
                        <button
                            type="button"
                            onClick={() => setLocalSelection('ONG')}
                            // Usando bg-amber-600 para seleção
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-amber-600 transition duration-200 ${localSelection === 'ONG' ? 'bg-amber-600 text-white shadow-md' : 'bg-white text-black hover:bg-amber-50'}`}
                        >
                            {/* Cor do ícone ajustada via classe condicional */}
                            <FaUsers className={`w-5 h-5 ${localSelection === 'ONG' ? 'text-white' : 'text-black'}`} />
                            <span className="font-semibold">ONG</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setLocalSelection('TUTOR')}
                            // Usando bg-amber-600 para seleção
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-amber-600 transition duration-200 ${localSelection === 'TUTOR' ? 'bg-amber-600 text-white shadow-md' : 'bg-white text-black hover:bg-amber-50'}`}
                        >
                            {/* Cor do ícone ajustada via classe condicional */}
                            <FaPaw className={`w-5 h-5 ${localSelection === 'TUTOR' ? 'text-white' : 'text-black'}`} />
                            <span className="font-semibold">Tutor</span>
                        </button>
                    </div>
                    
                    {error && <div className="text-red-600 mb-4 text-sm text-center bg-red-100 p-2 rounded border border-red-200">{error}</div>}

                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <input
                            type="email"
                            placeholder="E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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

                        <div className="flex justify-between items-center text-sm text-neutral-700">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="accent-yellow-600" />
                                Lembrar de mim
                            </label>
                            <button 
                                type="button" 
                                onClick={() => navigate('/recuperar-senha')} 
                                className="text-amber-700 hover:underline transition"
                            >
                                Esqueci minha senha
                            </button>
                        </div>

                        <button 
                            type="submit" 
                            className="bg-amber-800 text-white py-3 rounded font-bold hover:bg-amber-900 transition mt-2 shadow-lg flex items-center justify-center gap-2" 
                            disabled={loading}
                        >
                            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                            {loading ? 'Entrando...' : 'Login'}
                        </button>

                        <div className="text-center text-sm text-neutral-700 mt-3">
                            Não tem uma conta? <span 
                                onClick={() => navigate('/register')} 
                                className="text-amber-700 hover:underline cursor-pointer font-medium"
                            >
                                Registre-se
                            </span>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default LoginPage;
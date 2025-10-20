// src/pages/RecoveryPage.tsx

import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Loader2 } from 'lucide-react';
import { recoverPassword } from '../mocks/api';

const RecoveryPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState<string | null>(null); // Usando null para estado inicial limpo
    const [loading, setLoading] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setMessage(null); // Limpa mensagens ao digitar
    };

    const handleRecovery = (e: FormEvent) => {
        e.preventDefault();
        setMessage(null);
        
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setMessage("Por favor, insira um e-mail válido.");
            return;
        }

        setLoading(true);

        (async () => {
            try {
                // Simulação de envio usando o mock
                const success = await recoverPassword(email);
                setLoading(false);

                if (success) {
                    setMessage(`Instruções de redefinição foram enviadas para ${email}. Verifique sua caixa de entrada.`);
                    // Redireciona para o login após 3 segundos
                    setTimeout(() => navigate('/login'), 3000); 
                } else {
                    setMessage("E-mail não encontrado. Verifique o endereço e tente novamente.");
                }
            } catch (error) {
                setLoading(false);
                setMessage("Ocorreu um erro na solicitação. Tente novamente mais tarde.");
            }
        })();
    };

    return (
        <div className="min-h-screen w-screen flex flex-col bg-gray-100">
            <Navbar />

            <main className="flex-grow flex justify-center items-center p-6">
                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
                    
                    <h1 className="text-3xl font-bold mb-4 text-center text-neutral-950">
                        Recuperar Senha
                    </h1>
                    
                    <p className="text-center text-sm mb-6 text-gray-600">
                        Digite seu e-mail para receber as instruções de redefinição.
                    </p>

                    {/* Mensagem de Feedback */}
                    {message && (
                        <div className={`p-3 mb-4 rounded text-sm font-medium ${message.includes('enviadas') ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleRecovery} className="flex flex-col gap-4">
                        
                        {/* Campo de E-mail */}
                        <div className="relative">
                            {/* 👈 Usando Lucide: Mail */}
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-600 w-5 h-5" />
                            <input
                                type="email"
                                placeholder="Seu e-mail cadastrado"
                                value={email}
                                onChange={handleChange}
                                required
                                className="border-2 border-yellow-600/50 pl-10 pr-4 text-neutral-950 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                        </div>

                        {/* Botão de Envio */}
                        <button
                            type="submit"
                            className="bg-amber-800 text-white py-3 px-4 rounded font-semibold hover:bg-amber-900 transition shadow-lg flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                            {loading ? 'Enviando...' : 'Enviar Instruções'}
                        </button>
                        
                    </form>

                    <p className="text-center mt-6 text-sm">
                        <span
                            className="text-amber-700 hover:underline cursor-pointer font-medium"
                            onClick={() => navigate("/login")}
                        >
                            Voltar para o Login
                        </span>
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default RecoveryPage;
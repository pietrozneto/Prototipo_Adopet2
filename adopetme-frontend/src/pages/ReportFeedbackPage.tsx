// src/pages/ReportFeedbackPage.tsx

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaCheck } from 'react-icons/fa';

const ReportFeedbackPage: React.FC = () => {
    const navigate = useNavigate();
    const { protocol } = useParams<{ protocol: string }>();

    return (
        <div className="min-h-screen w-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow flex items-center justify-center p-6">
                <div className="w-full max-w-sm bg-white rounded-xl p-8 shadow-2xl border-t-4 border-amber-600">
                    <h1 className="text-3xl font-extrabold text-center text-green-700">
                        Denúncia Enviada!
                    </h1>
                    <p className="text-center mt-3 text-neutral-700">
                        Obrigado por ajudar a construir um lugar mais receptivo para pets!
                    </p>

                    <div className="mt-6 flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full bg-green-600 flex items-center justify-center text-white shadow-lg">
                            <FaCheck className="w-10 h-10" />
                        </div>
                    </div>

                    <div className="mt-6 text-center border-t pt-4 border-gray-200">
                        <p className="font-bold text-lg text-neutral-900 mb-1">
                            Seu Protocolo:
                        </p>
                        <p className="text-xl font-mono text-amber-700 bg-amber-50 p-2 rounded inline-block select-all">
                            {protocol}
                        </p>
                        <p className="text-sm text-neutral-600 mt-2">
                            Use este número para acompanhar o status da sua denúncia.
                        </p>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
                        <button 
                            className="px-6 py-3 bg-amber-800 text-white font-semibold rounded-full hover:bg-amber-900 transition shadow"
                            onClick={() => navigate('/')}
                            aria-label="Retornar para a página inicial"
                        >
                            Voltar para a Home
                        </button>
                        <button 
                            className="px-6 py-3 border border-neutral-300 text-neutral-800 font-semibold rounded-full hover:bg-gray-100 transition"
                            onClick={() => navigate('/report')}
                        >
                            Nova Denúncia
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ReportFeedbackPage;
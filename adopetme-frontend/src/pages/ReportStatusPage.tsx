// src/pages/ReportStatusPage.tsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getReportByProtocol, ReportRecord } from '../mocks/api';
import { FaImage } from 'react-icons/fa';

// Função auxiliar para determinar a cor do status
const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
        case 'recebido':
            return 'bg-blue-100 text-blue-700 border-blue-300';
        case 'em investigação':
            return 'bg-amber-100 text-amber-700 border-amber-300';
        case 'resolvido':
            return 'bg-green-100 text-green-700 border-green-300';
        default:
            return 'bg-gray-100 text-gray-700 border-gray-300';
    }
};

const ReportStatusPage: React.FC = () => {
    const { protocol } = useParams<{ protocol: string }>();
    const navigate = useNavigate();
    const [report, setReport] = useState<ReportRecord | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            if (!protocol) { setLoading(false); return; }
            const res = await getReportByProtocol(protocol);
            setReport(res);
            setLoading(false);
        };
        load();
    }, [protocol]);

    return (
        <div className="min-h-screen w-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="max-w-6xl mx-auto px-4 py-6 flex-1 w-full"> {/* flex-1 para empurrar o footer */}
                <button className="mb-4 text-sm text-amber-600 hover:underline" onClick={() => navigate(-1)}>
                    &larr; Voltar
                </button>

                {loading ? (
                    <div className="p-6 text-center text-xl text-neutral-600">Carregando...</div>
                ) : !report ? (
                    <div className="p-10 bg-white rounded shadow-lg border-l-4 border-red-500">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Protocolo Não Encontrado</h2>
                        <p className="text-neutral-700">O número de protocolo fornecido não corresponde a nenhuma denúncia em nosso sistema.</p>
                        <p className="mt-2 text-sm text-gray-500">Verifique o número e tente novamente ou inicie uma nova denúncia.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Left: media & description */}
                        <div className="md:col-span-2 bg-white rounded p-6 shadow-lg">
                            <h2 className="text-2xl font-bold mb-4 text-neutral-950">Denúncia #<span className="text-amber-700">{report.protocol}</span></h2>
                            
                            {/* Bloco de mídia principal */}
                            <div className="border rounded h-96 flex items-center justify-center bg-gray-100/70 mb-4">
                                {/* Main image placeholder */}
                                <FaImage className="w-24 h-24 text-gray-400" />
                            </div>

                            {/* Thumbnails */}
                            {report.images.length > 0 && (
                                <div className="mt-4 grid grid-cols-3 gap-3">
                                    {report.images.map((img, idx) => (
                                        <div key={idx} className="h-20 bg-gray-100 rounded flex items-center justify-center border hover:shadow-md transition">
                                            <FaImage className="text-gray-400 w-8 h-8" />
                                        </div>
                                    ))}
                                </div>
                            )}

                             <div className="mt-6">
                                <h4 className="font-bold text-neutral-900 mb-2 border-b pb-1">Detalhes da Ocorrência</h4>
                                <p className="text-sm text-neutral-700 leading-relaxed">{report.description}</p>
                            </div>
                        </div>

                        {/* Right: report details & status */}
                        <aside className="md:col-span-1 space-y-6">
                            <div className="bg-white rounded p-4 shadow-lg">
                                <h3 className="text-lg font-semibold text-neutral-950 mb-3">Status Atual</h3>
                                
                                {/* Indicador de Status com cor dinâmica */}
                                <div className={`p-3 rounded-lg border font-semibold text-center ${getStatusColor(report.status)}`}>
                                    {report.status.toUpperCase()}
                                </div>
                            </div>

                            <div className="bg-white rounded p-4 shadow-lg">
                                <h3 className="text-lg font-semibold text-neutral-950 mb-3">Informações</h3>
                                <p className="text-sm text-neutral-700"><strong>Tipo:</strong> {report.type}</p>
                                <p className="text-sm text-neutral-700 mt-2"><strong>Localização:</strong> {report.location}</p>
                                <p className="text-sm text-neutral-700 mt-2">
                                    <strong>Enviado por:</strong> 
                                    <span className="font-medium ml-1">
                                        {report.anonymous ? 'Anônimo' : (report.reporterEmail || '—')}
                                    </span>
                                </p>
                            </div>
                        </aside>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default ReportStatusPage;
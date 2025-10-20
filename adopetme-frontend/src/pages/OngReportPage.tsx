// src/pages/OngReportPage.tsx

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; // 👈 Importado o Footer
import { getAllReports, searchReports, ReportRecord } from '../mocks/api';
import { FaImage } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Loader2, Search } from 'lucide-react'; // 👈 Importado Loader2 e Search

// Função auxiliar para determinar a cor do status (coerência visual com ReportStatusPage)
const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
        case 'recebido':
            return 'bg-blue-100 text-blue-700 border-blue-300';
        case 'em investigação':
            return 'bg-amber-100 text-amber-700 border-amber-300';
        case 'resolvido':
        case 'concluído':
            return 'bg-green-100 text-green-700 border-green-300';
        default:
            return 'bg-gray-100 text-gray-700 border-gray-300';
    }
};

const OngReportPage: React.FC = () => {
    const [reports, setReports] = useState<ReportRecord[]>([]);
    const [query, setQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchReports = async (isSearch: boolean = false) => {
        setLoading(true);
        try {
            let res: ReportRecord[];
            if (isSearch) {
                res = await searchReports({ protocol: query, type: typeFilter });
            } else {
                res = await getAllReports();
            }
            setReports(res);
        } catch (e) {
            console.error("Erro ao buscar denúncias:", e);
            setReports([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []); // Carrega todos os relatórios na montagem

    const handleSearch = () => {
        fetchReports(true);
    };

    return (
        <div className="min-h-screen w-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="max-w-6xl mx-auto px-4 py-6 flex-1 w-full">
                <h1 className="text-2xl font-bold text-neutral-950 mb-6">Painel de Denúncias Recebidas</h1>

                {/* Área de Filtros e Busca */}
                <div className="bg-white p-4 rounded-xl shadow-lg mb-6 flex flex-wrap gap-4 items-end border border-gray-200">
                    <div className="flex-1 min-w-[150px]">
                        <label className="block text-sm font-medium text-neutral-800">Protocolo</label>
                        <div className='relative'>
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 w-4 h-4" />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full border-2 border-amber-500/30 rounded px-3 py-2 pl-10 text-neutral-900 focus:ring-amber-600 focus:border-amber-600"
                                placeholder="Buscar por protocolo"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-800">Tipo</label>
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="w-full border-2 border-amber-500/30 rounded px-3 py-2 text-neutral-900 bg-white focus:ring-amber-600 focus:border-amber-600"
                        >
                            <option value="">Todos</option>
                            <option>Abuso</option>
                            <option>Negligência</option>
                            <option>Abandono</option>
                            <option>Tráfico</option>
                        </select>
                    </div>
                    <div>
                        <button 
                            onClick={handleSearch} 
                            disabled={loading}
                            className="bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700 transition shadow flex items-center justify-center gap-2 h-full"
                        >
                            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                            Buscar
                        </button>
                    </div>
                </div>

                {/* Área de Resultados */}
                {loading && (
                    <div className="flex justify-center py-10">
                        <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
                        <p className='ml-3 text-lg text-neutral-600'>Carregando denúncias...</p>
                    </div>
                )}

                {!loading && reports.length === 0 && (
                     <div className="p-10 text-center bg-white rounded-xl shadow-lg border-l-4 border-gray-400">
                        <h2 className="text-xl font-semibold text-neutral-900">Nenhuma denúncia encontrada.</h2>
                        <p className="text-neutral-600">Ajuste os filtros ou aguarde novas submissões.</p>
                     </div>
                )}

                {!loading && reports.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {reports.map((r) => {
                            const statusStyle = getStatusColor(r.status);
                            return (
                                <Link
                                    key={r.protocol}
                                    to={`/report/${r.protocol}`}
                                    className="no-underline block"
                                    aria-label={`Abrir denúncia ${r.protocol}`}
                                >
                                    <div className="bg-white p-4 rounded-xl shadow-md flex gap-4 items-center hover:shadow-lg cursor-pointer transition border border-gray-100">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <FaImage className="text-gray-400 w-8 h-8" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <div className="text-xl font-bold text-neutral-900">{r.protocol}</div>
                                                {/* Badge de Status */}
                                                <span className={`text-xs font-bold px-2 py-1 rounded-full border ${statusStyle}`}>
                                                    {r.status.toUpperCase()}
                                                </span>
                                            </div>

                                            <div className="text-sm text-neutral-700 space-y-1">
                                                <div><strong>Tipo:</strong> {r.type}</div>
                                                <div><strong>Local:</strong> {r.location}</div>
                                                <div className='pt-1 text-xs'>
                                                    <strong>Enviado por:</strong> {r.anonymous ? 'Anônimo' : (r.reporterEmail || '—')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default OngReportPage;
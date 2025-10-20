// src/pages/ReportPage.tsx

import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; // 👈 Importado o Footer
import { getReportByProtocol, createReportMock } from '../mocks/api';
import { FaPaperclip } from 'react-icons/fa';
import { Loader2 } from 'lucide-react'; // 👈 Importado Loader2 para loading

const ReportPage: React.FC = () => {
    const navigate = useNavigate();

    const [reportType, setReportType] = useState('Abuso');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [email, setEmail] = useState('');
    const [anonymous, setAnonymous] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(false); // Novo estado de loading

    // Sidebar: acompanhar denúncia
    const [protocolNumber, setProtocolNumber] = useState('');
    const [checkMessage, setCheckMessage] = useState('');

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files && e.target.files[0];
        setImageFile(f || null);
        // Limpar o preview anterior
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        if (f) setPreviewUrl(URL.createObjectURL(f));
        else setPreviewUrl(null);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setMessage('');

        // Validação local antes de chamar o mock
        if (!location || location.trim().length < 5) {
            setMessage('Por favor, informe a localização do ocorrido.');
            return;
        }
        if (!description || description.trim().length < 10) {
            setMessage('Por favor, descreva o ocorrido com pelo menos 10 caracteres.');
            return;
        }
        if (!anonymous && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setMessage('Por favor, informe um e-mail válido ou marque como anônimo.');
            return;
        }

        (async () => {
            setLoading(true);
            try {
                const protocol = await createReportMock({
                    type: reportType,
                    location,
                    description,
                    images: imageFile ? [imageFile.name] : [],
                    reporterEmail: anonymous ? undefined : email,
                    anonymous: anonymous,
                });
                setLoading(false);
                
                // Limpa o preview de imagem após envio
                if (previewUrl) { URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }
                
                // Navega para a página de feedback
                navigate(`/report/feedback/${protocol}`);
                
                // Não limpamos os campos aqui, pois o usuário é redirecionado
            } catch (err) {
                setLoading(false);
                setMessage('Erro ao enviar denúncia. Tente novamente.');
            }
        })();
    };

    const handleCheckStatus = async () => {
        setCheckMessage('');
        if (!protocolNumber.trim()) {
            setCheckMessage('Informe o número do protocolo.');
            return;
        }
        setCheckingStatus(true);
        try {
            const p = await getReportByProtocol(protocolNumber);
            setCheckingStatus(false);
            if (!p) {
                setCheckMessage('Protocolo não encontrado. Verifique o número e tente novamente.');
                return;
            }
            // navigate to status page
            navigate(`/report/${p.protocol}`);
        } catch (error) {
            setCheckingStatus(false);
            setCheckMessage('Erro ao consultar status.');
        }
    };

    return (
        <div className="min-h-screen w-screen flex flex-col bg-gray-50">
            <Navbar />

            {/* Banner de Canal de Denúncias */}
            <section
                className="mx-4 my-6 rounded-lg bg-yellow-600 text-white border-2 border-yellow-700 shadow-lg"
                role="region"
                aria-label="Canal de denúncias"
            >
                <div className="max-w-4xl mx-auto px-6 py-4 text-left">
                    <h2 className="text-2xl font-bold text-white">Canal de denúncias</h2>
                    <p className="mt-2 text-base leading-relaxed text-white/95">
                        Reporte casos de abandono, maus-tratos ou animais em situação de risco. Sua denúncia nos ajuda a proteger os animais e acionar as medidas necessárias.
                    </p>
                </div>
            </section>

            {/* Conteúdo principal: duas colunas (form | sidebar) */}
            <main className="max-w-6xl mx-auto px-4 py-4 w-full flex-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left: formulário (ocupa 2 colunas em desktop) */}
                    <section className="md:col-span-2 bg-white rounded-lg p-6 shadow-xl">
                        <h2 className="text-xl font-bold mb-4 text-neutral-950">Nova denúncia</h2>

                        {message && (
                            <div className="mb-4 text-sm text-red-700 bg-red-100 p-3 rounded border border-red-200 font-medium">{message}</div>
                        )}

                        <form id="report-form" onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-800 mb-1">Tipo de denúncia</label>
                                <select
                                    value={reportType}
                                    onChange={(e) => setReportType(e.target.value)}
                                    className="w-full border-2 border-amber-500/30 rounded px-3 py-2 bg-white text-neutral-950 focus:ring-amber-600 focus:border-amber-600"
                                >
                                    <option>Abuso</option>
                                    <option>Negligência</option>
                                    <option>Abandono</option>
                                    <option>Tráfico</option>
                                    <option>Outro</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-800 mb-1">Localização *</label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Endereço ou ponto de referência"
                                    required
                                    className="w-full border-2 border-amber-500/30 rounded px-3 py-2 bg-white text-neutral-950 placeholder:text-gray-400 focus:ring-amber-600 focus:border-amber-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-800 mb-1">Descrição da situação *</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Descreva detalhadamente a situação (mínimo 10 caracteres)"
                                    rows={5}
                                    required
                                    className="w-full border-2 border-amber-500/30 rounded px-3 py-2 bg-white text-neutral-950 placeholder:text-gray-400 focus:ring-amber-600 focus:border-amber-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-800 mb-1">Evidências (Opcional)</label>

                                {/* Hidden native file input — activated by the styled label below */}
                                <input
                                    id="evidence-upload"
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />

                                <label
                                    htmlFor="evidence-upload"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-md cursor-pointer hover:bg-yellow-700 text-sm font-semibold transition shadow"
                                    aria-label="Anexar evidências"
                                >
                                    <FaPaperclip className="w-4 h-4" />
                                    <span>Anexar</span>
                                </label>

                                {imageFile && (
                                    <p className="mt-2 text-sm text-neutral-700">Arquivo: {imageFile.name}</p>
                                )}

                                {previewUrl && (
                                    <img src={previewUrl} alt="preview" className="mt-2 max-h-40 rounded shadow-md border border-gray-200" />
                                )}
                            </div>

                            <div className="flex items-center space-x-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={anonymous}
                                        onChange={(e) => setAnonymous(e.target.checked)}
                                        className="mr-2 accent-yellow-600"
                                    />
                                    <span className="text-sm text-neutral-800">Enviar como anônimo</span>
                                </label>

                                {!anonymous && (
                                        <div className="flex-1">
                                        <label className="block text-sm font-medium text-neutral-800 mb-1">E-mail (opcional)</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="seu-email@exemplo.com"
                                            className="w-full border-2 border-amber-500/30 rounded px-3 py-2 bg-white text-neutral-950 placeholder:text-gray-400 focus:ring-amber-600 focus:border-amber-600"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full bg-amber-800 text-white font-semibold py-3 rounded-md hover:bg-amber-900 disabled:opacity-60 transition shadow-lg flex items-center justify-center gap-2"
                                    disabled={loading}
                                >
                                    {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                                    {loading ? 'Enviando...' : 'Enviar denúncia'}
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Right: blocos informativos */}
                    <aside className="md:col-span-1 space-y-4">
                        {/* Acompanhar denúncia */}
                        <div className="bg-white rounded-lg p-4 shadow-xl border-l-4 border-amber-600">
                            <h4 className="font-bold mb-3 text-neutral-950">Acompanhar denúncia</h4>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="text"
                                    value={protocolNumber}
                                    onChange={(e) => setProtocolNumber(e.target.value)}
                                    placeholder="Número do protocolo"
                                    className="flex-1 border rounded px-3 py-2 bg-white text-neutral-950 placeholder:text-gray-400 border-amber-500/30 focus:ring-amber-600"
                                />
                                <button
                                    onClick={handleCheckStatus}
                                    disabled={checkingStatus || !protocolNumber.trim()}
                                    className="bg-amber-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 hover:bg-amber-700 transition"
                                >
                                    {checkingStatus && <Loader2 className="w-5 h-5 animate-spin" />}
                                    Consultar
                                </button>
                            </div>
                            {checkMessage && <p className="mt-2 text-sm text-red-600 font-medium">{checkMessage}</p>}
                        </div>

                        {/* Como funciona */}
                        <div className="bg-white rounded-lg p-4 shadow-xl">
                            <h4 className="font-bold mb-2 text-neutral-950">Como funciona</h4>
                            <ol className="list-decimal list-inside text-sm space-y-1 text-neutral-700">
                                <li>Preencha o formulário com detalhes.</li>
                                <li>Anexe fotos ou vídeos como evidência.</li>
                                <li>O sistema gera um protocolo automaticamente.</li>
                                <li>A denúncia é direcionada à ONG responsável.</li>
                                <li>Acompanhe o status pelo protocolo.</li>
                            </ol>
                        </div>

                        {/* Emergência */}
                        <div className="bg-red-50 rounded-lg p-4 shadow-xl border-l-4 border-red-600">
                            <h4 className="font-bold mb-2 text-red-800">Emergência</h4>
                            <p className="text-sm text-neutral-700">
                                Em casos urgentes de risco de vida iminente, entre em contato direto:
                            </p>
                            <p className="mt-2 text-base font-bold text-red-900">Telefone: 0000-0000-0000</p>
                        </div>
                    </aside>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ReportPage;
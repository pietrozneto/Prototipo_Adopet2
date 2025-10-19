import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getReportByProtocol, createReportMock } from '../mocks/api';
import { FaPaperclip } from 'react-icons/fa';

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
        if (f) setPreviewUrl(URL.createObjectURL(f));
        else setPreviewUrl(null);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setMessage('');

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
                });
                setLoading(false);
                // navigate to feedback page
                navigate(`/report/feedback/${protocol}`);
                // limpar
                setReportType('Abuso');
                setLocation('');
                setDescription('');
                setEmail('');
                setAnonymous(false);
                setImageFile(null);
                if (previewUrl) { URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }
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
        const p = await getReportByProtocol(protocolNumber);
        if (!p) {
            setCheckMessage('Protocolo não encontrado. Caso já tenha registrado, aguarde contato da ONG.');
            return;
        }
        // navigate to status page
        navigate(`/report/${p.protocol}`);
    };

    return (
        <div className="min-h-screen w-screen flex flex-col bg-gray-50">
            <Navbar />

            {/* Banner de Canal de Denúncias */}
            <section
                className="mx-4 my-6 rounded-md bg-yellow-600 text-white border-2 border-yellow-700 shadow-sm"
                role="region"
                aria-label="Canal de denúncias"
            >
                <div className="max-w-4xl mx-auto px-6 py-4 text-left">
                    <h2 className="text-xl font-bold text-white">Canal de denúncias</h2>
                    <p className="mt-2 text-base leading-relaxed text-white/95">
                        Reporte casos de abandono, maus-tratos ou animais em situação de risco. Sua denúncia nos ajuda a proteger os animais e acionar as medidas necessárias.
                    </p>
                </div>
            </section>

            {/* Conteúdo principal: duas colunas (form | sidebar) */}
            <main className="max-w-6xl mx-auto px-4 py-4 w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left: formulário (ocupa 2 colunas em desktop) */}
                    <section className="md:col-span-2 bg-white rounded-md p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4 text-neutral-950">Nova denúncia</h2>

                        {message && (
                            <div className="mb-4 text-sm text-green-700 bg-green-50 p-2 rounded">{message}</div>
                        )}

                        <form id="report-form" onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-800 mb-1">Tipo de denúncia</label>
                                <select
                                    value={reportType}
                                    onChange={(e) => setReportType(e.target.value)}
                                    className="w-full border rounded px-3 py-2 bg-white text-neutral-950 placeholder:text-gray-400"
                                >
                                    <option>Abuso</option>
                                    <option>Negligência</option>
                                    <option>Abandono</option>
                                    <option>Tráfico</option>
                                    <option>Outro</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-800 mb-1">Localização</label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Endereço ou ponto de referência"
                                    className="w-full border rounded px-3 py-2 bg-white text-neutral-950 placeholder:text-gray-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-800 mb-1">Descrição da situação</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Descreva detalhadamente a situação"
                                    rows={5}
                                    className="w-full border rounded px-3 py-2 bg-white text-neutral-950 placeholder:text-gray-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-800 mb-1">Evidências</label>

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
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md cursor-pointer hover:opacity-95 text-sm font-semibold"
                                    aria-label="Anexar evidências"
                                >
                                    <FaPaperclip className="w-4 h-4" />
                                    <span>Anexar</span>
                                </label>

                                {imageFile && (
                                    <p className="mt-2 text-sm text-neutral-700">Arquivo: {imageFile.name}</p>
                                )}

                                {previewUrl && (
                                    <img src={previewUrl} alt="preview" className="mt-2 max-h-40 rounded" />
                                )}
                            </div>

                            <div className="flex items-center space-x-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={anonymous}
                                        onChange={(e) => setAnonymous(e.target.checked)}
                                        className="mr-2"
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
                                                className="w-full border rounded px-3 py-2 bg-white text-neutral-950 placeholder:text-gray-400"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full bg-black text-white font-semibold py-3 rounded-md hover:opacity-95 disabled:opacity-60"
                                    disabled={loading}
                                >
                                    {loading ? 'Enviando...' : 'Enviar denúncia'}
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Right: blocos informativos */}
                    <aside className="md:col-span-1 space-y-4">
                        {/* Acompanhar denúncia */}
                        <div className="bg-white rounded-md p-4 shadow-sm">
                            <h4 className="font-semibold mb-2 text-neutral-950">Acompanhar denúncia</h4>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="text"
                                    value={protocolNumber}
                                    onChange={(e) => setProtocolNumber(e.target.value)}
                                    placeholder="Número do protocolo"
                                    className="flex-1 border rounded px-3 py-2 bg-white text-neutral-950 placeholder:text-gray-400"
                                />
                                <button
                                    onClick={handleCheckStatus}
                                    className="bg-black text-white px-4 py-2 rounded"
                                >
                                    Consultar status
                                </button>
                            </div>
                            {checkMessage && <p className="mt-2 text-sm text-neutral-700">{checkMessage}</p>}
                        </div>

                        {/* Como funciona */}
                        <div className="bg-white rounded-md p-4 shadow-sm">
                            <h4 className="font-semibold mb-2 text-neutral-950">Como funciona</h4>
                            <ol className="list-decimal list-inside text-sm space-y-1 text-neutral-700">
                                <li>Preencha o formulário com detalhes.</li>
                                <li>Anexe fotos ou vídeos como evidência.</li>
                                <li>O sistema gera um protocolo automaticamente.</li>
                                <li>A denúncia é direcionada à ONG responsável.</li>
                                <li>Acompanhe o status pelo protocolo.</li>
                            </ol>
                        </div>

                        {/* Emergência */}
                        <div className="bg-white rounded-md p-4 shadow-sm">
                            <h4 className="font-semibold mb-2 text-neutral-950">Emergência</h4>
                            <p className="text-sm text-neutral-700">
                                Em casos urgentes, entre em contato direto:
                            </p>
                            <p className="mt-2 text-sm font-medium text-neutral-950">Telefone: 0000-0000-0000</p>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default ReportPage;
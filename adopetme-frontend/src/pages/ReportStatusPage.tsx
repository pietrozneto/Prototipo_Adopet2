import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getReportByProtocol, ReportRecord } from '../mocks/api';
import { FaImage } from 'react-icons/fa';

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
      <main className="max-w-6xl mx-auto px-4 py-6">
        <button className="mb-4 text-sm text-amber-600 hover:underline" onClick={() => navigate(-1)}>
          &larr; Voltar
        </button>

        {loading ? (
          <div>Carregando...</div>
        ) : !report ? (
          <div className="p-6 bg-white rounded shadow">Protocolo não encontrado.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left: media */}
            <div className="md:col-span-2 bg-white rounded p-4 shadow">
              <h2 className="text-xl font-bold mb-4 text-neutral-950">Denúncia {report.protocol}</h2>
              <div className="border rounded h-80 flex items-center justify-center bg-gray-100">
                {/* Main image placeholder */}
                <FaImage className="w-24 h-24 text-gray-400" />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                {report.images.map((img, idx) => (
                  <div key={idx} className="h-20 bg-gray-100 rounded flex items-center justify-center border">
                    <FaImage className="text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: report details */}
            <aside className="md:col-span-1 bg-white rounded p-4 shadow">
              <h3 className="text-lg font-semibold text-neutral-950 mb-4">Detalhes da denúncia</h3>
              <p className="text-sm text-neutral-700"><strong>Tipo:</strong> {report.type}</p>
              <p className="text-sm text-neutral-700 mt-2"><strong>Localização:</strong> {report.location}</p>
              <p className="text-sm text-neutral-700 mt-2"><strong>Status:</strong> {report.status}</p>
              <div className="mt-4">
                <h4 className="font-medium text-neutral-900 mb-1">Descrição</h4>
                <p className="text-sm text-neutral-700">{report.description}</p>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReportStatusPage;

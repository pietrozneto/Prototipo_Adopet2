import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getAllReports, searchReports, ReportRecord } from '../mocks/api';
import { FaImage } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const OngReportPage: React.FC = () => {
  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    (async () => {
      const all = await getAllReports();
      setReports(all);
    })();
  }, []);

  const handleSearch = async () => {
    const res = await searchReports({ protocol: query, type: typeFilter });
    setReports(res);
  };

  return (
    <div className="min-h-screen w-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-neutral-950 mb-4">Denúncias recebidas</h1>

        <div className="bg-white p-4 rounded shadow mb-6 flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-neutral-800">Protocolo</label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border border-black rounded px-3 py-2 text-neutral-900"
              placeholder="Buscar por protocolo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-800">Tipo</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-black rounded px-3 py-2 text-neutral-900 bg-white"
            >
              <option value="">Todos</option>
              <option>Abuso</option>
              <option>Negligência</option>
              <option>Abandono</option>
              <option>Tráfico</option>
            </select>
          </div>
          <div>
            <button onClick={handleSearch} className="bg-black text-white px-4 py-2 rounded">Buscar</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reports.map((r) => (
            <Link
              key={r.protocol}
              to={`/report/${r.protocol}`}
              className="no-underline block"
              aria-label={`Abrir denúncia ${r.protocol}`}
            >
              <div className="bg-white p-4 rounded shadow flex gap-3 items-center hover:shadow-md cursor-pointer h-36">
                <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
                  <FaImage className="text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="mb-2">
                    <div className="text-2xl font-bold text-neutral-900">{r.protocol}</div>
                  </div>

                  <div className="text-sm text-neutral-700">
                    <div><strong>Tipo:</strong> {r.type}</div>
                    <div className="mt-1"><strong>Endereço:</strong> {r.location}</div>
                    <div className="mt-1"><strong>Enviado por:</strong> {r.anonymous ? 'Anônimo' : (r.reporterEmail || '—')}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default OngReportPage;

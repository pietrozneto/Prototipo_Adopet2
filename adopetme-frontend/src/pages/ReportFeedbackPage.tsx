import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaCheck } from 'react-icons/fa';

const ReportFeedbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { protocol } = useParams<{ protocol: string }>();

  return (
    <div className="min-h-screen w-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-3xl bg-white rounded-lg p-8 shadow">
          <h1 className="text-2xl font-bold text-center text-neutral-950">Denúncia enviada!</h1>
          <p className="text-center mt-2 text-neutral-700">Obrigado por ajudar a construir um lugar mais receptivo para pets!</p>

          <div className="mt-6 flex justify-center">
            <div className="w-28 h-28 rounded-md bg-amber-600 flex items-center justify-center text-white">
              <FaCheck className="w-12 h-12" />
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="font-medium text-neutral-900">Protocolo:</p>
            <p className="text-sm text-neutral-700">{protocol}</p>
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <button className="px-4 py-2 bg-black text-white rounded hover:opacity-95" onClick={() => navigate('/report')}>Tenho outra denúncia</button>
            <button
              className="px-4 py-2 bg-white border border-neutral-300 text-white rounded hover:bg-amber-50"
              onClick={() => navigate('/')}
              aria-label="Retornar para a página inicial"
            >
              Retornar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportFeedbackPage;

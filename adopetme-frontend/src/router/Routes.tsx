// matheus-de-andrade-lourenco/prototipo_adopet/Prototipo_Adopet-83121f52595e1e8153395d49fca8b2dc2b85a109/adopetme-frontend/src/router/Routes.tsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import SearchPage from '../pages/SearchPage';
import AboutUsPage from '../pages/AboutUsPage';
import SearchResultsPage from '../pages/SearchResultsPage';
import PetDetailsPage from '../pages/PetDetailsPage';
import LoginPage from '../pages/LoginPage';
import ReportPage from '../pages/ReportPage';
import ReportStatusPage from '../pages/ReportStatusPage';
import ReportFeedbackPage from '../pages/ReportFeedbackPage';
import OngReportPage from '../pages/OngReportPage';
import RegisterPage from '../pages/RegisterPage';
import RecoveryPage from '../pages/RecoveryPage';
import AnimalRegistrationPage from '../pages/AnimalRegistrationPage'; // 👈 NOVA IMPORTAÇÃO

const NotFoundPage = () => <div className="p-10 text-center text-3xl font-bold text-red-600">404 - Página Não Encontrada</div>;
// REMOVIDO: const AnimalRegistrationPage = () => <div className="p-10 text-center text-xl font-semibold">Página de Registro de Animal (Privada)</div>;

// Esse componente define todas as rotas do aplicativo.
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rota Padrão (Homepage) */}
      <Route path="/" element={<HomePage />} />
      
      {/* Rotas de Navegação */}
      <Route path="/search" element={<SearchPage />} />
      <Route path="/search-results" element={<SearchResultsPage />} />
      <Route path="/about-us" element={<AboutUsPage />} />
      <Route path="/pets/:id" element={<PetDetailsPage />} />
      <Route path="/report" element={<ReportPage />} />
      <Route path="/report/:protocol" element={<ReportStatusPage />} />
      <Route path="/report/feedback/:protocol" element={<ReportFeedbackPage />} />
      <Route path="/ong/reports" element={<OngReportPage />} />
      
      {/* Rotas de Autenticação */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/recovery" element={<RecoveryPage />} />
      <Route path="/register-animal" element={<AnimalRegistrationPage />} />
      
      {/* Rota Curinga para 404 (qualquer caminho não mapeado) */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
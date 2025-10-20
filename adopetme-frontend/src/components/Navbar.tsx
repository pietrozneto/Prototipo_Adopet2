// matheus-de-andrade-lourenco/prototipo_adopet/Prototipo_Adopet-83121f52595e1e8153395d49fca8b2dc2b85a109/adopetme-frontend/src/components/Navbar.tsx

import React from "react";
import { PawPrint, User } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSession } from '../context/SessionContext';

// base navLinks kept for NONE session (public)
const publicLinks = [
  { name: "Home", href: "/" },
  { name: "Buscar Pets", href: "/search" },
  { name: "Denúncias", href: "/report" }, // Link de Denúncias incluído para sessão NONE
  { name: "Sobre nós", href: "/about-us" },
];

const Navbar: React.FC = () => {
  // Obtendo userName e setUserName do contexto da sessão
  const { session, setSession, userName } = useSession(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user_email');
      localStorage.removeItem('session_type');
      localStorage.removeItem('user_name'); // Remoção do nome ao sair
    } catch {}
    setSession('NONE');
    navigate('/');
  };
  
  const baseClasses =
    "no-underline !text-neutral-50 visited:!text-neutral-50 hover:!text-gray-200 focus:!text-neutral-50 active:!text-neutral-50 font-medium transition duration-150 p-2 rounded-lg";
  const activeClasses = "font-bold";

  return (
    <nav className="bg-yellow-600 shadow-sm border-b border-amber-200/50 sticky top-0 z-20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-2xl font-bold no-underline !text-neutral-50">
          <PawPrint className="w-8 h-8 text-amber-800" aria-hidden="true" />
          <span 
            className="no-underline !text-neutral-50 visited:!text-neutral-50 hover:!text-gray-200 focus:!text-neutral-50 active:!text-neutral-50 font-medium transition duration-150 rounded-lg"
            >
            adopet.me
          </span>
        </Link>
        <div className="hidden sm:flex space-x-8 items-center">
          {/* Links para sessão NONE (Público) */}
          {session === 'NONE' && publicLinks.map((link) => (
            <NavLink key={link.name} to={link.href} className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : ""}`}>
              {link.name}
            </NavLink>
          ))}

          {/* Links para sessão TUTOR */}
          {session === 'TUTOR' && (
            <>
              <NavLink to="/" className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : ""}`}>Home</NavLink>
              <NavLink to="/search" className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : ""}`}>Buscar Pets</NavLink>
              <NavLink to="/report" className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : ""}`}>Denúncias</NavLink>
              <NavLink to="/about-us" className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : ""}`}>Sobre nós</NavLink>
            </>
          )}

          {/* Links para sessão ONG */}
          {session === 'ONG' && (
            <>
              <NavLink to="/" className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : ""}`}>Home</NavLink>
              <NavLink to="/search" className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : ""}`}>Buscar Pets</NavLink>
              <NavLink to="/register-animal" className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : ""}`}>Adicionar Pet</NavLink>
              <NavLink to="/ong/reports" className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : ""}`}>Denúncias</NavLink>
              <NavLink to="/about-us" className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : ""}`}>Sobre Nós</NavLink>
            </>
          )}
        </div>

        <div className="flex space-x-3 items-center">
          {/* Botões de Login/Registro (Sessão NONE) */}
          {session === 'NONE' && (
            <>
              <Link to="/login" className="px-4 py-2 text-sm font-semibold rounded-full !text-neutral-50 hover:!text-gray-200 bg-yellow-500 hover:bg-yellow-700 transition duration-200 no-underline">Login</Link>
              <Link to="/register" className="px-4 py-2 text-sm font-semibold rounded-full !text-neutral-50 hover:!text-gray-200 bg-yellow-500 hover:bg-yellow-700 transition duration-200 no-underline">Registre-se</Link>
            </>
          )}

          {/* Perfil Logado (TUTOR ou ONG) */}
          {session !== 'NONE' && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white text-black">
                <User className="w-5 h-5 text-black" />
                {/* Exibe o nome do usuário (ou o fallback de Perfil) */}
                <span className="text-sm font-medium">{userName || (session === 'ONG' ? 'Perfil ONG' : 'Perfil Tutor')}</span> 
              </div>
              <button onClick={handleLogout} className="px-3 py-2 rounded-md bg-transparent border border-white text-white hover:bg-white/10">Sair</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
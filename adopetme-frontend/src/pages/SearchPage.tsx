// src/pages/SearchPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Search, PawPrint, Cat, Loader2 } from "lucide-react"; // Importamos Loader2 para o loading
import Footer from "../components/Footer";
import { Pet } from "../models/PetModel";
import { searchPets } from "../mocks/api"; // Importamos a função de busca

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  // Novo estado para armazenar e exibir os resultados recentes (populados pela API)
  const [recentResults, setRecentResults] = useState<Pet[]>([]);
  const [loadingRecents, setLoadingRecents] = useState(true);

  // Efeito para carregar pets iniciais na primeira vez que a página é montada
  useEffect(() => {
    const fetchInitialPets = async () => {
      setLoadingRecents(true);
      try {
        // Busca com query vazia para retornar um subconjunto de todos os pets mockados
        const pets = await searchPets(""); 
        setRecentResults(pets.slice(0, 6)); // Limita a 6 resultados para não lotar a tela
      } catch (e) {
        console.error("Falha ao carregar pets recentes:", e);
        setRecentResults([]);
      } finally {
        setLoadingRecents(false);
      }
    };

    fetchInitialPets();
  }, []); // Array de dependência vazio: executa apenas uma vez na montagem

  function handleSearch() {
    if (searchQuery.trim() === "") return;
    console.log("Busca iniciada por:", searchQuery);
    // Redireciona para a página de resultados, que chamará a API novamente com o termo
    navigate(`/search-results?q=${encodeURIComponent(searchQuery)}`);
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSearch();
  }

  // Função para determinar o ícone baseado no tipo de pet
  const getPetIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'cachorro':
        return <PawPrint className="w-8 h-8 text-[#3b1f0e]" />;
      case 'gato':
        return <Cat className="w-8 h-8 text-[#3b1f0e]" />;
      default:
        return <PawPrint className="w-8 h-8 text-[#3b1f0e]" />;
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col bg-[#FFF8F0] overflow-x-hidden">
      <Navbar />
      <main className="flex-1 w-full flex flex-col items-center py-20">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 flex flex-col items-center">
            
            {/* Título */}
            <header className="text-center mb-10 w-full">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#3b1f0e] mb-4">
                🐾 Encontre seu novo melhor amigo
              </h1>
              <p className="text-lg text-[#7b5a3b] max-w-2xl mx-auto">
                Utilize a busca abaixo ou confira alguns dos pets disponíveis recentemente.
              </p>
            </header>

            {/* Área de busca */}
            <section className="bg-white border border-[#c4742a]/20 shadow-md rounded-2xl p-8 w-full max-w-2xl">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-3.5 text-[#c4742a]" size={22} />
                  <input
                    type="text"
                    placeholder="Digite o nome ou espécie do pet..."
                    className="w-full text-neutral-950 pl-12 pr-4 py-3 border border-[#c4742a]/30 rounded-full focus:outline-none focus:ring-2 focus:ring-[#c4742a]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  // Desabilita o botão se a busca estiver vazia (melhor UX)
                  disabled={searchQuery.trim() === ""} 
                  className="px-8 py-3 bg-[#c4742a] hover:bg-[#a75e22] text-white font-bold rounded-full transition-all duration-200 disabled:opacity-50"
                >
                  Buscar
                </button>
              </div>
            </section>

            {/* Resultados recentes */}
            <section className="mt-16 w-full max-w-6xl">
              <h2 className="text-2xl font-bold text-[#3b1f0e] mb-6">
                Pets em Destaque
              </h2>

              {loadingRecents ? (
                <div className="flex justify-center py-10">
                    <Loader2 className="w-8 h-8 text-[#c4742a] animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                  {recentResults.map((pet) => (
                    <div
                      key={pet.id}
                      onClick={() => navigate(`/pets/${pet.id}`)} // Permite clicar e ir para detalhes
                      className="bg-white border border-[#c4742a]/30 rounded-xl flex flex-col items-center justify-center p-4 text-[#3b1f0e] font-medium shadow-sm hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer h-36"
                    >
                      {getPetIcon(pet.tipo)}
                      <span className="mt-2 text-base font-semibold text-center">{pet.nome}</span>
                      <span className="text-xs text-gray-500">{pet.tipo} ({pet.idade})</span>
                    </div>
                  ))}
                </div>
              )}
              
            </section>
        </div>
      </main>

      {/* Rodapé com logo */}
      <Footer />
    </div>
  );
};

export default SearchPage;
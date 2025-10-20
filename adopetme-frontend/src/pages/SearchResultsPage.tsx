// src/pages/SearchResultsPage.tsx

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Pet } from "../models/PetModel";
import Footer from "../components/Footer";
import { searchPets } from "../mocks/api"; 
import { Image as ImageIcon, Cat, PawPrint, Home, Heart } from "lucide-react"; // Importa ícones

// Componente auxiliar para a imagem com fallback
const ResultPetImage: React.FC<{ pet: Pet }> = ({ pet }) => {
    // Tenta usar a imagem mockada/real, ou usa o place-puppy.com como fallback inicial
    const imageUrl = pet.imagem && pet.imagem.includes('placeholder')
        ? `https://place-puppy.com/200x200?image=${pet.id}` 
        : pet.imagem; 

    const [imageError, setImageError] = useState(false);
    const petIcon = pet.tipo.toLowerCase() === 'gato' ? Cat : PawPrint;

    if (imageError || !imageUrl) {
        // Fallback: Exibe um ícone genérico se a imagem falhar ou for nula/mockada
        return (
            <div className="w-full h-32 flex items-center justify-center bg-gray-200 rounded-xl mx-auto mb-3">
                <ImageIcon className="w-10 h-10 text-gray-500" />
            </div>
        );
    }

    return (
        <img
            src={imageUrl}
            alt={pet.nome}
            onError={() => setImageError(true)}
            // Garante que a imagem tenha dimensões fixas (w-full h-32 object-cover)
            className="w-full h-32 object-cover rounded-xl mx-auto mb-3"
        />
    );
};


export default function SearchResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get("q");
  const [results, setResults] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  const handleViewDetails = (petId: number) => {
    navigate(`/pets/${petId}`);
  };

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      if (!query) {
        setResults([]);
        setLoading(false);
        return;
      }
      try {
        const mockResults = await searchPets(query);
        setResults(mockResults);
      } catch (error) {
        console.error("Erro ao buscar pets:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [query]);

  return (
    <div className="min-h-screen w-screen bg-[#FFF8F0] flex flex-col">
      <Navbar />

      <main className="flex flex-col items-center p-6 text-[#3b1f0e] flex-1">
        <h1 className="text-3xl font-semibold mb-4 text-center">
          Resultados da busca por: <span className="text-[#c4742a]">{query}</span>
        </h1>

        {loading ? (
          <p className="text-lg text-gray-600">Carregando resultados...</p>
        ) : results.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-2xl text-[#3b1f0e] font-semibold mb-2">Nenhum pet encontrado para "{query}".</p>
            <p className="text-lg text-[#7b5a3b]">Tente refinar sua busca ou volte para a página inicial.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 max-w-6xl w-full">
            {results.map((pet) => (
              <div
                key={pet.id}
                className="bg-white rounded-2xl shadow-lg p-4 text-center border border-[#c4742a]/20 cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-all duration-300"
                onClick={() => handleViewDetails(pet.id)} // Torna todo o card clicável
              >
                {/* USA O COMPONENTE COM FALLBACK */}
                <ResultPetImage pet={pet} /> 
                
                <h2 className="text-2xl font-bold text-[#c4742a] mb-1">{pet.nome}</h2>
                <p className="text-sm text-[#3b1f0e] font-semibold">{pet.tipo}</p>
                
                {/* Detalhes Rápidos (Melhorando a UX) */}
                <div className="flex justify-center items-center gap-4 text-xs text-gray-600 mt-2">
                    <div className="flex items-center">
                        <Home className="w-3 h-3 mr-1" />
                        {pet.porte || 'Médio'}
                    </div>
                    <div className="flex items-center">
                        <Heart className="w-3 h-3 mr-1" />
                        {pet.genero || 'N/A'}
                    </div>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Evita que o evento de clique do card seja disparado duas vezes
                        handleViewDetails(pet.id);
                    }}
                    className="mt-4 w-full bg-[#c4742a] text-white px-4 py-2 rounded-lg hover:bg-[#a75e22] transition-all font-semibold">
                  Ver Perfil
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
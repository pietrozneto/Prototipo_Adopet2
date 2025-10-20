// src/pages/PetDetailsPage.tsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Pet } from "../models/PetModel";
import { Heart, Home, PawPrint, Calendar, Image as ImageIcon, MapPin, Loader2 } from "lucide-react";
import Footer from "../components/Footer";
import { getPetById } from "../mocks/api";

// Componente auxiliar para a imagem com fallback
const PetImage: React.FC<{ pet: Pet }> = ({ pet }) => {
    // Define a URL da imagem. Usamos o pet.id para gerar uma imagem consistente se a URL mockada não for válida.
    const imageUrl = pet.imagem && pet.imagem.includes('placeholder')
        ? `https://place-puppy.com/300x300?image=${pet.id}` // Tenta uma URL externa para pets mockados
        : pet.imagem; // Tenta usar a URL fornecida (se for real)

    const [imageError, setImageError] = useState(false);

    // Se o estado de erro for verdadeiro ou se a URL for vazia, exibe o fallback
    if (imageError || !imageUrl) {
        return (
            <div className="w-full h-auto max-w-xs rounded-2xl border-4 border-[#c4742a]/50 shadow-lg mb-6 bg-gray-200 flex flex-col items-center justify-center p-10 aspect-square">
                <ImageIcon className="w-20 h-20 text-gray-500" />
                <span className="text-sm text-gray-600 mt-2">Imagem Indisponível</span>
            </div>
        );
    }

    return (
        <img
            src={imageUrl}
            alt={pet.nome}
            onError={() => setImageError(true)}
            className="w-full h-auto max-w-xs rounded-2xl object-cover border-4 border-[#c4742a]/50 shadow-lg mb-6 aspect-square"
        />
    );
};

// Componente para a seção de detalhes (Info Grid + Descrição)
const PetDetailsInfo: React.FC<{ pet: Pet }> = ({ pet }) => (
    <div className="md:w-2/3">
        <h1 className="text-5xl font-extrabold text-[#3b1f0e] mb-2">{pet.nome}</h1>
        <p className="text-xl text-[#c4742a] font-semibold mb-6">{pet.tipo}</p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 text-lg text-[#3b1f0e] mb-8">
            <div className="flex items-center">
                <Calendar className="mr-2 text-[#c4742a]" size={20} />
                <span>**Idade:** {pet.idade}</span>
            </div>
            <div className="flex items-center">
                <Home className="mr-2 text-[#c4742a]" size={20} />
                <span>**Porte:** {pet.porte || 'Não Informado'}</span>
            </div>
            <div className="flex items-center">
                <Heart className="mr-2 text-[#c4742a]" size={20} />
                <span>**Gênero:** {pet.genero || 'Não Informado'}</span>
            </div>
            <div className="flex items-center">
                <MapPin className="mr-2 text-[#c4742a]" size={20} />
                <span>**Localização:** {pet.localizacao || '—'}</span>
            </div>
        </div>

        {/* Descrição Longa */}
        <h2 className="text-2xl font-bold text-[#3b1f0e] mb-3">Sobre {pet.nome}</h2>
        <p className="text-lg leading-relaxed text-[#7b5a3b]">
            {pet.description || (`${pet.nome} é um(a) ${pet.tipo.toLowerCase()} extremamente dócil e brincalhão(a). Adora longas caminhadas no parque e está à procura de um lar.`)}
        </p>
    </div>
);


// Componente principal
export default function PetDetailsPage() {
    const { id } = useParams<{ id: string }>();
    
    const [pet, setPet] = useState<Pet | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        
        const fetchPetDetails = async () => {
            const petId = parseInt(id || '0');
            if (petId === 0) {
                setPet(null);
                setLoading(false);
                return;
            }

            const foundPet = await getPetById(petId);
            
            setPet(foundPet);
            setLoading(false);
        };

        fetchPetDetails();
    }, [id]);

    // Trata estados de carregamento
    if (loading) {
        return (
            <div className="min-h-screen w-screen flex items-center justify-center bg-[#FFF8F0]">
                 <div className="flex items-center gap-3 text-2xl text-[#c4742a] font-semibold">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <p>Carregando detalhes do pet...</p>
                 </div>
            </div>
        );
    }

    if (!pet) {
        return (
            <div className="min-h-screen w-screen flex flex-col bg-[#FFF8F0]">
                <Navbar />
                <main className="flex-1 flex flex-col items-center justify-center p-10">
                    <h1 className="text-4xl font-bold text-[#3b1f0e] mb-4">Pet não encontrado 😢</h1>
                    <p className="text-lg text-[#7b5a3b]">Verifique o ID ou volte para a página de busca.</p>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-screen flex flex-col bg-[#FFF8F0] overflow-x-hidden">
            <Navbar />

            {/* Main usa flex-1 para empurrar o footer */}
            <main className="flex-1 w-full flex flex-col items-center py-10 px-6 sm:px-8 lg:px-10">
                <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#c4742a]/30">
                    
                    <div className="p-8 md:p-12 flex flex-col md:flex-row gap-8">
                        
                        {/* Imagem e Botões (Componente de Ação) */}
                        <div className="md:w-1/3 flex flex-col items-center">
                            <PetImage pet={pet} /> 

                            <button className="w-full max-w-xs px-8 py-3 bg-[#c4742a] hover:bg-[#a75e22] text-neutral-50 font-bold rounded-full transition-all duration-200 flex items-center justify-center mb-4">
                                <Heart className="mr-2" size={20} /> Adotar {pet.nome}
                            </button>
                            
                            <button className="w-full max-w-xs px-8 py-3 border border-[#3b1f0e] text-neutral-900 font-bold rounded-full transition-all duration-200 flex items-center justify-center hover:bg-[#3b1f0e] hover:text-white">
                                <PawPrint className="mr-2" size={20} /> Favoritar
                            </button>
                            
                            <div className="mt-6 text-center">
                                <p className="text-sm font-semibold text-[#3b1f0e]">Responsável pela Adoção:</p>
                                <p className="text-base text-[#c4742a]">{pet.ONG || 'ONG Adopet Mock'}</p>
                            </div>
                        </div>

                        {/* Detalhes do Pet (Componente de Informação) */}
                        <PetDetailsInfo pet={pet} />
                        
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
}
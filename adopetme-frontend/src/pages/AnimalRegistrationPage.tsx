// src/pages/AnimalRegistrationPage.tsx

import React, { useState, FormEvent } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { PawPrint, Upload } from 'lucide-react';
import { PetRegistrationData, PetType, PetGender, PetSize, registerPetMock } from '../mocks/api'; 
import { useNavigate } from 'react-router-dom';

const AnimalRegistrationPage: React.FC = () => {
    const [petName, setPetName] = useState('');
    const [petAge, setPetAge] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    // 👈 Definição do estado com os tipos estritos
    const [petType, setPetType] = useState<PetType>('Cachorro');
    const [petGender, setPetGender] = useState<PetGender>('Macho');
    const [petSize, setPetSize] = useState<PetSize>('Médio');
    
    const navigate = useNavigate();

    // Handlers para os selects que agora usam os tipos estritos (com type assertion)
    const handlePetTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPetType(e.target.value as PetType);
    };
    const handlePetGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPetGender(e.target.value as PetGender);
    };
    const handlePetSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPetSize(e.target.value as PetSize);
    };


    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setMessage(null);
        
        if (!petName || !petAge || !description) {
            setMessage('Por favor, preencha o Nome, Idade e Descrição.');
            return;
        }

        setLoading(true);

        (async () => {
            try {
                // Monta o objeto com o tipo PetRegistrationData (já estrito)
                const data: PetRegistrationData = {
                    nome: petName,
                    tipo: petType,
                    idade: petAge,
                    genero: petGender,
                    porte: petSize,
                    description: description,
                };

                const newPetId = await registerPetMock(data); 

                setLoading(false);
                setMessage(`🐾 ${petName} cadastrado com sucesso! Redirecionando para a página do pet...`);
                
                // Redirecionamento para a página de detalhes do pet
                setTimeout(() => {
                    navigate(`/pets/${newPetId}`); 
                }, 1500); 

            } catch (error) {
                setLoading(false);
                setMessage('Erro ao cadastrar o pet. Tente novamente.');
                console.error("Erro no cadastro:", error);
            }
        })();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setImage(file);
    };

    return (
        <div className="min-h-screen w-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow flex justify-center items-start py-12 px-4">
                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl">
                    <h1 className="text-3xl font-bold text-center text-amber-800 mb-2">
                        Cadastre um Pet para Adoção
                    </h1>
                    <p className="text-center text-neutral-600 mb-8">
                        Complete as informações para que o novo amigo encontre um lar.
                    </p>

                    {/* Mensagem de Feedback */}
                    {message && (
                        <div className={`p-4 mb-6 rounded-lg text-white font-semibold ${message.startsWith('🐾') ? 'bg-green-600' : 'bg-red-600'}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Seção de Informações Básicas */}
                        <div className="grid md:grid-cols-2 gap-6">
                            
                            {/* Nome */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-neutral-800 mb-1">Nome do Pet *</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={petName}
                                    onChange={(e) => setPetName(e.target.value)}
                                    placeholder="Ex: Rex, Luna"
                                    required
                                    className="w-full border-2 border-yellow-600/50 p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-neutral-900"
                                />
                            </div>

                            {/* Tipo (Espécie) */}
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-neutral-800 mb-1">Espécie *</label>
                                <select
                                    id="type"
                                    value={petType}
                                    onChange={handlePetTypeChange}
                                    className="w-full border-2 border-yellow-600/50 p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-neutral-900 bg-white"
                                >
                                    <option value="Cachorro">Cachorro</option>
                                    <option value="Gato">Gato</option>
                                    <option value="Outro">Outro</option>
                                </select>
                            </div>

                            {/* Idade */}
                            <div>
                                <label htmlFor="age" className="block text-sm font-medium text-neutral-800 mb-1">Idade *</label>
                                <input
                                    type="text"
                                    id="age"
                                    value={petAge}
                                    onChange={(e) => setPetAge(e.target.value)}
                                    placeholder="Ex: 2 anos, 6 meses"
                                    required
                                    className="w-full border-2 border-yellow-600/50 p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-neutral-900"
                                />
                            </div>

                            {/* Gênero */}
                            <div>
                                <label htmlFor="gender" className="block text-sm font-medium text-neutral-800 mb-1">Gênero</label>
                                <select
                                    id="gender"
                                    value={petGender}
                                    onChange={handlePetGenderChange}
                                    className="w-full border-2 border-yellow-600/50 p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-neutral-900 bg-white"
                                >
                                    <option value="Macho">Macho</option>
                                    <option value="Fêmea">Fêmea</option>
                                </select>
                            </div>

                            {/* Porte */}
                            <div className='md:col-span-2'>
                                <label htmlFor="size" className="block text-sm font-medium text-neutral-800 mb-1">Porte</label>
                                <select
                                    id="size"
                                    value={petSize}
                                    onChange={handlePetSizeChange}
                                    className="w-full border-2 border-yellow-600/50 p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-neutral-900 bg-white"
                                >
                                    <option value="Pequeno">Pequeno</option>
                                    <option value="Médio">Médio</option>
                                    <option value="Grande">Grande</option>
                                </select>
                            </div>
                        </div>

                        {/* Descrição */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-neutral-800 mb-1">Descrição e Histórico *</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Conte sobre a personalidade do pet, histórico de saúde, se é castrado, vacinado e se se dá bem com crianças/outros animais."
                                rows={4}
                                required
                                className="w-full border-2 border-yellow-600/50 p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-neutral-900"
                            />
                        </div>

                        {/* Upload de Imagem */}
                        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                            <label className="block text-sm font-medium text-neutral-800 mb-2">Fotos do Pet</label>
                            
                            <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                  const file = e.target.files ? e.target.files[0] : null;
                                  setImage(file);
                                }}
                                className="hidden"
                            />
                            
                            <label
                                htmlFor="image-upload"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-md cursor-pointer hover:bg-yellow-700 transition duration-200 shadow-md"
                            >
                                <Upload className="w-4 h-4" />
                                <span>{image ? 'Mudar Imagem' : 'Selecionar Imagem Principal'}</span>
                            </label>
                            
                            {image && (
                                <p className="mt-2 text-sm text-neutral-700 flex items-center gap-2">
                                    <PawPrint className="w-4 h-4 text-amber-700"/> Imagem selecionada: **{image.name}**
                                </p>
                            )}
                        </div>

                        {/* Botão de Envio */}
                        <button
                            type="submit"
                            className="w-full bg-amber-800 text-white font-semibold py-3 rounded-md hover:bg-amber-900 transition duration-200 disabled:opacity-60 shadow-lg"
                            disabled={loading}
                        >
                            {loading ? 'Cadastrando Pet...' : 'Registrar para Adoção'}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AnimalRegistrationPage;
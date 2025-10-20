export interface Pet {
    id: number;
    nome: string;
    tipo: 'Cachorro' | 'Gato' | 'Outro';
    idade: string;
    genero: 'Macho' | 'Fêmea';
    porte: 'Pequeno' | 'Médio' | 'Grande';
    localizacao: string;
    description: string;
    imagem: string;
    adotado: boolean;
    ONG: string;
}
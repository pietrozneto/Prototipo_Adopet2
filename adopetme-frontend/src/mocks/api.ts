// matheus-de-andrade-lourenco/prototipo_adopet/Prototipo_Adopet-83121f52595e1e8153395d49fca8b2dc2b85a109/adopetme-frontend/src/mocks/api.ts (REESCRITO)

import { Pet } from "../models/PetModel"; 
import { MOCK_PETS } from "./data"; 
import { UserRecord, AccountRole } from "../models/UserModel"; 

const delay = (ms = 500) => new Promise((res) => setTimeout(res, ms));

// --- Tipos Exportáveis para uso no Front-end ---
// Usando lookup types para derivar os tipos estritos do PetModel
export type PetType = Pet['tipo'];
export type PetGender = Pet['genero'];
export type PetSize = Pet['porte'];

// PetRegistrationData agora usa os tipos estritos do PetModel
export type PetRegistrationData = Omit<Pet, 'id' | 'localizacao' | 'imagem' | 'adotado' | 'ONG'>;

// --- Função Mock para registrar um Pet ---
export async function registerPetMock(data: PetRegistrationData): Promise<number> {
  await delay(700);

  // Lógica para gerar um ID único
  const newId = MOCK_PETS.length > 0 ? Math.max(...MOCK_PETS.map(p => p.id)) + 1 : 1;

  // CONSTRUÇÃO DO OBJETO USANDO A INTERFACE PET COMPLETA
  const newPet: Pet = {
    id: newId,
    nome: data.nome,
    tipo: data.tipo,
    idade: data.idade,
    genero: data.genero,
    porte: data.porte,
    
    // CAMPOS FIXOS (MOCKED) QUE NÃO VIERAM DO FORMULÁRIO:
    localizacao: 'São Paulo/SP', 
    description: data.description, 
    imagem: '/assets/new_pet_placeholder.jpg', 
    adotado: false,
    ONG: 'ONG Mock de Teste', 
  };

  // Adiciona o novo pet à lista em memória
  MOCK_PETS.push(newPet); 

  return newId;
}

// --- Busca de Pets (Mantida) ---
export async function searchPets(query: string): Promise<Pet[]> {
  await delay(800);
  const q = query.trim().toLowerCase();
  if (!q) return MOCK_PETS.slice(0, 6);

  const normalizedQuery = q;

  // 1. Filtrar resultados que contenham a consulta no nome ou tipo
  const results = MOCK_PETS.filter(
    (p) =>
      p.nome.toLowerCase().includes(normalizedQuery) ||
      p.tipo.toLowerCase().includes(normalizedQuery)
  );

  // 2. Lógica de Ordenação Customizada: Priorizar 'starts with'
  results.sort((a, b) => {
    const aNomeLower = a.nome.toLowerCase();
    const bNomeLower = b.nome.toLowerCase();
    const aTipoLower = a.tipo.toLowerCase();
    const bTipoLower = b.tipo.toLowerCase();

    const aStarts = aNomeLower.startsWith(normalizedQuery) || aTipoLower.startsWith(normalizedQuery);
    const bStarts = bNomeLower.startsWith(normalizedQuery) || bTipoLower.startsWith(normalizedQuery);

    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;

    if (aNomeLower < bNomeLower) return -1;
    if (aNomeLower > bNomeLower) return 1;

    return 0;
  });

  return results;
}

export async function getPetById(id: number): Promise<Pet | null> {
  await delay(600);
  return MOCK_PETS.find((p) => p.id === id) || null;
}

// --- Definição de Usuário e MOCK Store (Restante do arquivo omitido para brevidade) ---
const userStore: Record<string, UserRecord> = {
    'tutor@adopetme.com': { name: 'Tutor Mock', email: 'tutor@adopetme.com', cpf: '000.000.000-00', password: 'admin123', role: 'TUTOR' },
    'ong@adopetme.com': { name: 'ONG Mock', email: 'ong@adopetme.com', cpf: '00.000.000/0000-00', password: 'admin123', role: 'ONG' },
};

// ... (Restante das funções de autenticação e denúncia) ...

export async function registerMock(name: string, email: string, cpf: string, password: string, role: AccountRole): Promise<boolean> {
  await delay(500);

  if (userStore[email]) throw new Error('Este e-mail já está em uso.');
  const isValidEmailFormat = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!isValidEmailFormat(email)) throw new Error('Formato de e-mail inválido.');
  const isValidCPFFormat = (cpf: string) => { const numbers = cpf.replace(/[^\d]/g, ''); return numbers.length === 11; };
  if (role === 'TUTOR' && !isValidCPFFormat(cpf)) throw new Error('Formato de CPF inválido.');
  
  const newUser: UserRecord = { name, email, cpf, password, role };
  userStore[email] = newUser;
  
  return true;
}

export async function loginMock(email: string, password: string): Promise<{ token: string; user: { name: string; email: string; role: AccountRole } }>{
  await delay(700);
  
  const user = userStore[email];

  if (user && user.password === password) {
    return { 
      token: 'mock-token-123', 
      user: { 
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    };
  }

  throw new Error('Nome de usuário ou senha incorretos');
}

export async function recoverPassword(email: string): Promise<boolean> {
  await delay(500);
  return !!userStore[email];
}

export interface ReportRecord {
  protocol: string;
  type: string;
  location: string;
  description: string;
  images: string[]; 
  createdAt: string;
  status: string;
  reporterEmail?: string; 
  anonymous?: boolean;
}

const reportsStore: ReportRecord[] = [
  {
    protocol: 'RPT-0001',
    type: 'Abuso',
    location: 'Rua das Flores, 123, Centro',
    description: 'Animal amarrado em corrente sem água nem comida por vários dias.',
    images: ['', '', ''],
    createdAt: new Date().toISOString(),
    status: 'Em investigação',
    reporterEmail: 'tutor1@example.com',
    anonymous: false,
  },
  {
    protocol: 'RPT-0002',
    type: 'Abandono',
    location: 'Parque da Lagoa, ponto de ônibus',
    description: 'Cachorro idoso deixado próximo ao lago. Sem sinais de tutor.',
    images: ['', ''],
    createdAt: new Date().toISOString(),
    status: 'Recebido',
    reporterEmail: undefined,
    anonymous: true,
  },
];

export async function getReportByProtocol(protocol: string): Promise<ReportRecord | null> {
  await delay(500);
  const p = reportsStore.find((r) => r.protocol.toLowerCase() === protocol.trim().toLowerCase());
  return p || null;
}

export async function getAllReports(): Promise<ReportRecord[]> {
  await delay(400);
  return reportsStore.slice().reverse();
}

export async function searchReports(options: { protocol?: string; type?: string } = {}): Promise<ReportRecord[]> {
  await delay(300);
  let res = reportsStore.slice();
  if (options.protocol) {
    const q = options.protocol.trim().toLowerCase();
    res = res.filter((r) => r.protocol.toLowerCase().includes(q));
  }
  if (options.type) {
    const t = options.type.trim().toLowerCase();
    if (t) res = res.filter((r) => r.type.toLowerCase() === t);
  }
  return res.reverse();
}

export async function createReportMock(data: Omit<ReportRecord, 'protocol' | 'createdAt' | 'status'>): Promise<string> {
  await delay(700);
  const nextId = (reportsStore.length + 1).toString().padStart(4, '0');
  const protocol = `RPT-${nextId}`;
  const rec: ReportRecord = {
    protocol,
    createdAt: new Date().toISOString(),
    status: 'Recebido',
    ...data,
  } as ReportRecord;
  reportsStore.push(rec);
  return protocol;
}
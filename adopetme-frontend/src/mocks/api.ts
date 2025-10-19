import { Pet } from "../models/PetModel";
import { MOCK_PETS } from "./data";

const delay = (ms = 500) => new Promise((res) => setTimeout(res, ms));

export async function searchPets(query: string): Promise<Pet[]> {
  await delay(800);
  const q = query.trim().toLowerCase();
  if (!q) return MOCK_PETS.slice(0, 6);
  return MOCK_PETS.filter(
    (p) => p.nome.toLowerCase().includes(q) || p.tipo.toLowerCase().includes(q)
  );
}

export async function getPetById(id: number): Promise<Pet | null> {
  await delay(600);
  return MOCK_PETS.find((p) => p.id === id) || null;
}

// Separate in-memory user stores for ONG and TUTOR
const userStoreONG: Record<string, string> = {
  'admin@adopetme.com': 'admin123',
};
const userStoreTUTOR: Record<string, string> = {
  'admin@adopetme.com': 'admin123',
};

export type AccountRole = 'ONG' | 'TUTOR';

export async function registerMock(email: string, password: string, role: AccountRole): Promise<boolean> {
  await delay(500);
  if (!email || !password) return false;
  if (role === 'ONG') userStoreONG[email] = password;
  else userStoreTUTOR[email] = password;
  return true;
}

export async function loginMock(email: string, password: string): Promise<{ token: string; user: { email: string; role: AccountRole } }>{
  await delay(700);
  const storedOng = userStoreONG[email];
  if (storedOng && storedOng === password) return { token: 'mock-token-123', user: { email, role: 'ONG' } };

  const storedTutor = userStoreTUTOR[email];
  if (storedTutor && storedTutor === password) return { token: 'mock-token-123', user: { email, role: 'TUTOR' } };

  // not found or password mismatch
  throw new Error('Nome de usuário ou senha incorretos');
}

export async function recoverPassword(email: string): Promise<boolean> {
  await delay(500);
  // Simula sucesso sempre que o formato for de e-mail
  return /@/.test(email);
}

// --- Simple reports store for the denúncias feature (mocked) ---
export interface ReportRecord {
  protocol: string;
  type: string;
  location: string;
  description: string;
  images: string[]; // image URLs (can be empty strings when placeholder will be shown)
  createdAt: string;
  status: string;
  reporterEmail?: string; // empty or undefined when anonymous
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
  // return a copy
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
  // create protocol like RPT-00XX
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

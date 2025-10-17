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

export async function loginMock(email: string, password: string): Promise<{ token: string; user: { email: string } }>{
  await delay(700);
  // Aceita qualquer credencial para fins de desenvolvimento local
  return { token: "mock-token-123", user: { email } };
}

export async function recoverPassword(email: string): Promise<boolean> {
  await delay(500);
  // Simula sucesso sempre que o formato for de e-mail
  return /@/.test(email);
}

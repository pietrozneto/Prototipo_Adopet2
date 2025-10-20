export type AccountRole = 'ONG' | 'TUTOR';

export interface UserRecord {
    name: string;
    email: string;
    cpf: string;
    password: string;
    role: AccountRole;
}
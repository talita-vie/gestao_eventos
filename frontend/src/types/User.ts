import type { EducationLevel, UserRole } from './enums';

export interface User {
    id: number;
    name: string;
    email: string;
    cpf: string;
    role: UserRole;
    phone: string;
    last_login: string;
    institution: string;
    education_level: EducationLevel;
    address_id: number;
    email_verified_at: string;
    remember_token: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}
import { User } from "./types";

export interface AuthResponse {
    token: string;
    user: User;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    role: "user" | "admin";
    email: string;
    password: string;
    phone: string;
}
export interface User {
    id?: number,
    name: String,
    password: String,
    email: String,
    role?: 'USER' | 'ADMIN';
}
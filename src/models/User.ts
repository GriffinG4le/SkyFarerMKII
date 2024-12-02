export interface User {
    id: string;
    name: string;
    email: string;
    preferences?: {
        darkMode?: boolean;
        units?: 'imperial' | 'metric';
    };
} 
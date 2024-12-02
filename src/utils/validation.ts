export function validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

export function validatePhoneNumber(phone: string): boolean {
    const re = /^\+?[\d\s-]{10,}$/;
    return re.test(phone);
}

export function validateRequired(value: string): boolean {
    return value.trim().length > 0;
} 
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
}

export const IVA_RATE = 0.15;

export function calculateTax(subtotal: number): number {
    return subtotal * IVA_RATE;
}

export function calculateTotal(subtotal: number): number {
    return subtotal + calculateTax(subtotal);
}

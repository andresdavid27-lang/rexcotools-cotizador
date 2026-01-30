import { Client, Insert } from '@/types';

const STORAGE_KEYS = {
    CLIENTS: 'mechquote_clients',
    INSERTS: 'mechquote_inserts'
};

export class StorageService {

    static saveClients(clients: Client[]) {
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
        }
    }

    static getClients(): Client[] | null {
        if (typeof window !== 'undefined') {
            const data = localStorage.getItem(STORAGE_KEYS.CLIENTS);
            return data ? JSON.parse(data) : null;
        }
        return null;
    }

    static saveInserts(inserts: Insert[]) {
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEYS.INSERTS, JSON.stringify(inserts));
        }
    }

    static getInserts(): Insert[] | null {
        if (typeof window !== 'undefined') {
            const data = localStorage.getItem(STORAGE_KEYS.INSERTS);
            return data ? JSON.parse(data) : null;
        }
        return null;
    }

    static clearData() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEYS.CLIENTS);
            localStorage.removeItem(STORAGE_KEYS.INSERTS);
        }
    }
}

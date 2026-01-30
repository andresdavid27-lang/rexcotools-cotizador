import { Insert, Client } from '@/types';

export const MOCK_INSERTS: Insert[] = [
    {
        id: "chem-001",
        identification: {
            code_iso: "CNMG 12 04 08-PM",
            code_ansi: "CNMG 432-PM",
            description: "Inserto negativo de carburo para torneado general",
            manufacturer_code: "12345-XYZ"
        },
        commercial: {
            brand: "Sandvik Coromant",
            origin: "Sweden",
            price_usd: 12.50,
            currency: "USD",
            min_order_qty: 1
        },
        technical_specs: {
            material_grade: "GC4325",
            coating: "CVD",
            geometry: "Negative",
            usage: ["Steel", "Cast Iron"],
        },
        metadata: {
            category: "Turning",
            tags: ["roughing", "finishing", "steel"]
        }
    },
    {
        id: "chem-002",
        identification: {
            code_iso: "WNMG 08 04 08-WM",
            code_ansi: "WNMG 432-WM",
            description: "Inserto trigonal para desbaste pesado",
            manufacturer_code: "67890-ABC"
        },
        commercial: {
            brand: "Iscar",
            origin: "Israel",
            price_usd: 10.25,
            currency: "USD",
            min_order_qty: 1
        },
        technical_specs: {
            material_grade: "IC908",
            coating: "PVD",
            geometry: "Trigon",
            usage: ["Stainless Steel", "Superalloys"],
        },
        metadata: {
            category: "Turning",
            tags: ["heavy", "interrupted_cut"]
        }
    },
    {
        id: "chem-003",
        identification: {
            code_iso: "DCMT 11 T3 04-PF",
            code_ansi: "DCMT 32.51-PF",
            description: "Inserto positivo para acabado",
            manufacturer_code: "54321-DEF"
        },
        commercial: {
            brand: "Kennametal",
            origin: "USA",
            price_usd: 8.90,
            currency: "USD",
            min_order_qty: 1
        },
        technical_specs: {
            material_grade: "KC5010",
            coating: "PVD",
            geometry: "Positive",
            usage: ["Steel", "Stainless Steel"],
        },
        metadata: {
            category: "Turning",
            tags: ["finishing", "precision"]
        }
    }
];

export const MOCK_CLIENTS: Client[] = [
    {
        ruc: "1790012345001",
        razon_social: "Industrias Alfa S.A. de C.V.",
        email: "compras@alfa.com",
        address: "Av. Industrial 123, Quito",
        phone: "02-234-5678"
    },
    {
        ruc: "0990098765001",
        razon_social: "Aceros del Norte Cía. Ltda.",
        email: "logistica@acerosnorte.com",
        address: "Parque Industrial Norte, Guayaquil",
        phone: "04-987-6543"
    },
    {
        ruc: "1102345678001",
        razon_social: "Mecánica de Precisión Quito",
        email: "gerencia@mecanicaquito.com",
        address: "Calle de los Tornos N45, Quito",
        phone: "099-123-4567"
    }
];

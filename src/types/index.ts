export interface Insert {
  id: string;
  identification: {
    code_iso: string;
    code_ansi: string;
    description: string;
    manufacturer_code?: string;
  };
  commercial: {
    brand: string;
    origin: string;
    price_usd: number;
    currency: string;
    min_order_qty: number;
  };
  technical_specs: {
    material_grade: string;
    coating: string;
    geometry: string;
    usage: string[];
    cutting_edge_length_mm?: number;
    thickness_mm?: number;
    corner_radius_mm?: number;
  };
  metadata?: {
    category: string;
    tags: string[];
  };
}

export interface Client {
  ruc: string;
  razon_social: string;
  email: string;
  address?: string;
  phone?: string;
}

export interface QuoteItem {
  insert: Insert;
  quantity: number;
  unit_price: number; // Can be overridden
  total_price: number;
}

export interface Quote {
  id: string;
  client: Client;
  date: string; // ISO Date
  items: QuoteItem[];
  subtotal: number;
  tax_amount: number; // IVA 15%
  total: number;
  status: 'draft' | 'finalized';
}

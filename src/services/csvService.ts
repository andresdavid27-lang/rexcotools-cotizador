import Papa from 'papaparse';
import { Client, Insert } from '@/types';

export class CsvService {
    /**
     * Parses a CSV file containing Client data.
     * Expected columns: RUC, Razon Social, Email, Address, Phone
     */
    static parseClients(file: File): Promise<Client[]> {
        return new Promise((resolve, reject) => {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    try {
                        const clients: Client[] = results.data.map((row: any) => ({
                            ruc: row['RUC'] || row['ruc'],
                            razon_social: row['Razon Social'] || row['razon_social'],
                            email: row['Email'] || row['email'],
                            address: row['Address'] || row['address'] || '',
                            phone: row['Phone'] || row['phone'] || ''
                        })).filter(c => c.ruc && c.razon_social); // Basic validation
                        resolve(clients);
                    } catch (e) {
                        reject(e);
                    }
                },
                error: (error) => reject(error)
            });
        });
    }

    /**
     * Parses a CSV file containing Insert data.
     * Expected columns: Code ISO, Code ANSI, Description, Brand, Price, etc.
     */
    static parseInserts(file: File): Promise<Insert[]> {
        return new Promise((resolve, reject) => {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    try {
                        const inserts: Insert[] = results.data.map((row: any, index: number) => ({
                            id: `csv-${index}-${row['Code ISO'] || row['code_iso']}`, // Generate a temporary ID
                            identification: {
                                code_iso: row['Code ISO'] || row['code_iso'],
                                code_ansi: row['Code ANSI'] || row['code_ansi'] || '',
                                description: row['Description'] || row['description'],
                                manufacturer_code: row['Manufacturer Code'] || row['manufacturer_code']
                            },
                            commercial: {
                                brand: row['Brand'] || row['brand'],
                                origin: row['Origin'] || row['origin'] || 'Unknown',
                                price_usd: parseFloat(row['Price'] || row['price_usd'] || '0'),
                                currency: 'USD',
                                min_order_qty: parseInt(row['Min Qty'] || row['min_order_qty'] || '1')
                            },
                            technical_specs: {
                                // Mapping generic fields for now, can be expanded
                                material_grade: row['Grade'] || row['material_grade'] || '',
                                coating: row['Coating'] || row['coating'] || '',
                                geometry: row['Geometry'] || row['geometry'] || '',
                                usage: (row['Usage'] || row['usage'] || '').split(',').map((s: string) => s.trim())
                            }
                        })).filter(i => i.identification.code_iso); // Basic validation
                        resolve(inserts);
                    } catch (e) {
                        reject(e);
                    }
                },
                error: (error) => reject(error)
            });
        });
    }
}

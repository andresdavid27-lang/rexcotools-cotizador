'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchInput } from '@/components/SearchInput';
import { Insert, Client, QuoteItem, Quote } from '@/types';
import { MOCK_INSERTS, MOCK_CLIENTS } from '@/data/mockData';
import { calculateTotal, calculateTax, formatCurrency, cn } from '@/lib/utils';
import { Trash2, FileJson, FileSpreadsheet, Download, Settings, X } from 'lucide-react';

export function QuoteBuilder() {
    const [selectedClient, setSelectedClient] = React.useState<Client | null>(null);
    const [items, setItems] = React.useState<QuoteItem[]>([]);
    const [quoteDate, setQuoteDate] = React.useState(new Date().toISOString().split('T')[0]);

    const handleAddInsert = (insert: Insert) => {
        // Check if already exists
        const existing = items.find(i => i.insert.id === insert.id);
        if (existing) {
            // Increment quantity
            updateItem(insert.id, existing.quantity + 1);
        } else {
            // Add new
            setItems([
                ...items,
                {
                    insert,
                    quantity: 1,
                    unit_price: insert.commercial.price_usd,
                    total_price: insert.commercial.price_usd
                }
            ]);
        }
    };

    const updateItem = (insertId: string, quantity: number) => {
        if (quantity < 1) return;
        setItems(items.map(item => {
            if (item.insert.id === insertId) {
                return {
                    ...item,
                    quantity,
                    total_price: item.unit_price * quantity
                };
            }
            return item;
        }));
    };

    const removeItem = (insertId: string) => {
        setItems(items.filter(i => i.insert.id !== insertId));
    };

    const subtotal = items.reduce((sum, item) => sum + item.total_price, 0);
    const tax = calculateTax(subtotal);
    const total = calculateTotal(subtotal);

    const [clientData, setClientData] = React.useState<Client[]>(MOCK_CLIENTS);
    const [insertData, setInsertData] = React.useState<Insert[]>(MOCK_INSERTS);
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

    // Load from storage on mount
    React.useEffect(() => {
        const loadData = async () => {
            const { StorageService } = await import('@/services/storageService');
            const storedClients = StorageService.getClients();
            const storedInserts = StorageService.getInserts();

            if (storedClients) setClientData(storedClients);
            if (storedInserts) setInsertData(storedInserts);
        };
        loadData();
    }, []);

    const handleClientUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            try {
                const { CsvService } = await import('@/services/csvService');
                const { StorageService } = await import('@/services/storageService');

                const clients = await CsvService.parseClients(e.target.files[0]);
                setClientData(clients);
                StorageService.saveClients(clients);
                alert(`Clientes cargados y guardados: ${clients.length}`);
            } catch (err) {
                alert('Error parsing client CSV');
                console.error(err);
            }
        }
    };

    const handleProductUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            try {
                const { CsvService } = await import('@/services/csvService');
                const { StorageService } = await import('@/services/storageService');

                const inserts = await CsvService.parseInserts(e.target.files[0]);
                setInsertData(inserts);
                StorageService.saveInserts(inserts);
                alert(`Productos cargados y guardados: ${inserts.length}`);
            } catch (err) {
                alert('Error parsing product CSV');
                console.error(err);
            }
        }
    };

    const handleClearData = async () => {
        if (confirm("¿Estás seguro de borrar los datos personalizados y volver a los datos de prueba?")) {
            const { StorageService } = await import('@/services/storageService');
            StorageService.clearData();
            setClientData(MOCK_CLIENTS);
            setInsertData(MOCK_INSERTS);
            alert("Datos restaurados a valores por defecto.");
        }
    };

    const handleExportExcel = async () => {
        if (!selectedClient || items.length === 0) {
            alert("Seleccione un cliente y agregue items.");
            return;
        }

        const quote: Quote = {
            id: `${new Date().getFullYear()}-001`,
            client: selectedClient,
            date: quoteDate,
            items: items,
            subtotal,
            tax_amount: tax,
            total,
            status: 'draft'
        };

        try {
            const { ExportService } = await import('@/services/exportService');
            ExportService.generateExcel(quote);
        } catch (e) {
            console.error(e);
            alert("Error al exportar Excel");
        }
    };

    const handleExportPDF = async () => {
        if (!selectedClient || items.length === 0) {
            alert("Seleccione un cliente y agregue items.");
            return;
        }

        const quote: Quote = {
            id: `${new Date().getFullYear()}-001`,
            client: selectedClient,
            date: quoteDate,
            items: items,
            subtotal,
            tax_amount: tax,
            total,
            status: 'draft'
        };

        try {
            const { ExportService } = await import('@/services/exportService');
            ExportService.generatePDF(quote);
        } catch (e) {
            console.error(e);
            alert("Error al exportar PDF: " + e);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-6xl space-y-6 relative">

            {/* Admin / Settings Trigger */}
            <div className="absolute top-0 right-6 z-10">
                <Button variant="ghost" size="sm" onClick={() => setIsSettingsOpen(true)} className="gap-2">
                    <Settings className="h-4 w-4" />
                    Configuración de Datos
                </Button>
            </div>

            {/* Settings Modal */}
            {isSettingsOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <Card className="w-full max-w-lg bg-white shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2"
                            onClick={() => setIsSettingsOpen(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                        <CardHeader>
                            <CardTitle className="text-rexco-dark">Administración de Datos</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-slate-50 p-4 rounded-md border">
                                <label className="block mb-2 font-medium text-sm">Cargar Clientes (CSV):</label>
                                <Input type="file" accept=".csv" onChange={handleClientUpload} className="w-full" />
                                <p className="text-xs text-slate-500 mt-1">Col: RUC, Razon Social, Email...</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-md border">
                                <label className="block mb-2 font-medium text-sm">Cargar Productos (CSV):</label>
                                <Input type="file" accept=".csv" onChange={handleProductUpload} className="w-full" />
                                <p className="text-xs text-slate-500 mt-1">Col: Code ISO, Price, Brand, Description...</p>
                            </div>

                            <div className="pt-4 border-t">
                                <Button variant="destructive" size="sm" onClick={handleClearData} className="w-full">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Borrar datos y Restaurar demo
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Header / Client Info */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                        <CardTitle className="text-rexco-dark">Nueva Cotización</CardTitle>
                        <p className="text-sm text-slate-500">#{new Date().getFullYear()}-001</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <label className="text-sm font-medium mb-1">Fecha:</label>
                        <Input
                            type="date"
                            value={quoteDate}
                            onChange={(e) => setQuoteDate(e.target.value)}
                            className="w-[160px]"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SearchInput
                            label="Cliente"
                            placeholder="Buscar cliente por nombre o RUC..."
                            data={clientData}
                            displayValue={(c) => c.razon_social}
                            filter={(c, q) => c.razon_social.toLowerCase().includes(q.toLowerCase()) || c.ruc.includes(q)}
                            onSelect={setSelectedClient}
                        />
                        {selectedClient && (
                            <div className="bg-slate-50 p-3 rounded-md border text-sm space-y-1">
                                <p><strong>RUC:</strong> {selectedClient.ruc}</p>
                                <p><strong>Email:</strong> {selectedClient.email}</p>
                                <p><strong>Dirección:</strong> {selectedClient.address}</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Item Selection & Table */}
            <Card className="min-h-[500px] flex flex-col">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-rexco-dark">Items</CardTitle>
                    <div className="w-full max-w-2xl">
                        <SearchInput
                            placeholder="Buscar inserto (Código ISO, ANSI, Descripción)..."
                            data={insertData}
                            displayValue={(i) => `${i.identification.code_iso} - ${i.identification.description}`}
                            filter={(i, q) =>
                                i.identification.code_iso.toLowerCase().includes(q.toLowerCase()) ||
                                i.identification.code_ansi.toLowerCase().includes(q.toLowerCase()) ||
                                i.identification.description.toLowerCase().includes(q.toLowerCase())
                            }
                            onSelect={handleAddInsert}
                            className="w-full"
                        />
                    </div>
                </CardHeader>
                <CardContent className="flex-1">
                    <div className="rounded-md border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-100 text-slate-600 font-medium">
                                <tr>
                                    <th className="p-3">Código</th>
                                    <th className="p-3">Descripción</th>
                                    <th className="p-3">Marca</th>
                                    <th className="p-3 w-[100px]">Cant.</th>
                                    <th className="p-3 text-right">P. Unit</th>
                                    <th className="p-3 text-right">Total</th>
                                    <th className="p-3 w-[50px]"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-slate-400">
                                            No hay items seleccionados. Busque un inserto para comenzar.
                                        </td>
                                    </tr>
                                ) : (
                                    items.map((item) => (
                                        <tr key={item.insert.id} className="border-t hover:bg-slate-50">
                                            <td className="p-3 font-medium">{item.insert.identification.code_iso}</td>
                                            <td className="p-3 text-slate-500 truncate max-w-[200px]">{item.insert.identification.description}</td>
                                            <td className="p-3">{item.insert.commercial.brand}</td>
                                            <td className="p-3">
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => updateItem(item.insert.id, parseInt(e.target.value) || 0)}
                                                    className="h-8 w-20"
                                                />
                                            </td>
                                            <td className="p-3 text-right">{formatCurrency(item.unit_price)}</td>
                                            <td className="p-3 text-right font-medium">{formatCurrency(item.total_price)}</td>
                                            <td className="p-3 text-center">
                                                <Button variant="ghost" size="icon" onClick={() => removeItem(item.insert.id)} className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col items-end border-t bg-slate-50/50 p-6">
                    <div className="w-full max-w-[300px] space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Subtotal:</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">IVA (15%):</span>
                            <span>{formatCurrency(tax)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold pt-2 border-t">
                            <span>Total:</span>
                            <span>{formatCurrency(total)}</span>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6 w-full justify-end">
                        <Button variant="outline" onClick={handleExportExcel}>
                            <FileSpreadsheet className="mr-2 h-4 w-4" />
                            Excel
                        </Button>
                        <Button onClick={handleExportPDF}>
                            <Download className="mr-2 h-4 w-4" />
                            PDF
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

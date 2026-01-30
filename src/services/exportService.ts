import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Quote } from '@/types';
import { formatCurrency, calculateTax, calculateTotal, IVA_RATE } from '@/lib/utils';

export class ExportService {

    static generateExcel(quote: Quote) {
        const ws_data = [
            ['COTIZACIÓN TÉCNICA'],
            ['Fecha:', quote.date],
            ['Cliente:', quote.client.razon_social],
            ['RUC:', quote.client.ruc],
            [],
            ['PRODUCTOS'],
            ['Código', 'Descripción', 'Marca', 'Cantidad', 'Precio Unit.', 'Total'],
            ...quote.items.map(item => [
                item.insert.identification.code_iso,
                item.insert.identification.description,
                item.insert.commercial.brand,
                item.quantity,
                item.unit_price,
                item.total_price
            ]),
            [],
            ['', '', '', '', 'Subtotal', quote.subtotal],
            ['', '', '', '', `IVA ${IVA_RATE * 100}%`, quote.tax_amount],
            ['', '', '', '', 'TOTAL', quote.total]
        ];

        const ws = XLSX.utils.aoa_to_sheet(ws_data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Cotización");

        // Save file
        XLSX.writeFile(wb, `Cotizacion_${quote.client.razon_social.substring(0, 10)}_${quote.date}.xlsx`);
    }

    static generatePDF(quote: Quote) {
        const doc = new jsPDF();

        // Branding / Header
        doc.setFontSize(22);
        doc.text('MECHQUOTE', 14, 20);
        doc.setFontSize(12);
        doc.text('Soluciones en Mecanizado', 14, 26);

        // Client Info
        doc.setFontSize(10);
        doc.text(`Fecha: ${quote.date}`, 140, 20);
        doc.text(`Cotización #: ${quote.id}`, 140, 26);

        doc.setFillColor(241, 245, 249); // slate-100
        doc.rect(14, 35, 182, 25, 'F');
        doc.text(`Cliente: ${quote.client.razon_social}`, 18, 42);
        doc.text(`RUC: ${quote.client.ruc}`, 18, 48);
        doc.text(`Dirección: ${quote.client.address || 'N/A'}`, 18, 54);

        // Table
        const tableData = quote.items.map(item => [
            item.insert.identification.code_iso,
            item.insert.identification.description,
            item.insert.commercial.brand,
            item.quantity.toString(),
            formatCurrency(item.unit_price),
            formatCurrency(item.total_price)
        ]);

        autoTable(doc, {
            startY: 65,
            head: [['Código', 'Descripción', 'Marca', 'Cant.', 'P. Unit', 'Total']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [15, 23, 42] }, // slate-900
            styles: { fontSize: 9 },
            columnStyles: {
                5: { halign: 'right' }
            }
        });

        // Totals
        const finalY = (doc as any).lastAutoTable.finalY + 10;

        // Check page break
        if (finalY > 250) {
            doc.addPage();
        }

        doc.text(`Subtotal:`, 140, finalY);
        doc.text(formatCurrency(quote.subtotal), 195, finalY, { align: 'right' });

        doc.text(`IVA (15%):`, 140, finalY + 6);
        doc.text(formatCurrency(quote.tax_amount), 195, finalY + 6, { align: 'right' });

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`TOTAL:`, 140, finalY + 14);
        doc.text(formatCurrency(quote.total), 195, finalY + 14, { align: 'right' });

        doc.save(`Cotizacion_${quote.id}.pdf`);
    }
}

import * as XLSX from 'xlsx';
import type { BudgetData } from '../hooks/useBudgetSync';

export const exportToExcel = (budget: BudgetData) => {
    if (!budget) return;

    const { client, items, ivaRate, company, notes } = budget;

    // 1. Prepare Data for Excel
    const rows = [];

    // Company Header
    rows.push([company.name.toUpperCase()]);
    rows.push([company.address]);
    rows.push([`${company.city} - ${company.phone}`]);
    rows.push([`CIF: ${company.cif} | ${company.email}`]);
    rows.push([]);

    // Client Info
    rows.push(['DATOS DEL CLIENTE']);
    rows.push(['Nombre:', client.name]);
    rows.push(['Dirección:', client.address]);
    rows.push(['Localidad:', client.city]);
    rows.push(['DNI/CIF:', client.dni]);
    rows.push(['Fecha:', client.date]);
    rows.push(['Proyecto:', client.project]);
    rows.push([]);

    // Budget Items Header
    rows.push(['CONCEPTO / DESCRIPCIÓN', 'CANTIDAD', 'PRECIO UNIDAD', 'TOTAL']);

    // Items
    items.forEach(item => {
        rows.push([
            `${item.category}\n${item.description}`,
            item.quantity,
            item.salePrice,
            item.quantity * item.salePrice
        ]);
    });
    rows.push([]);

    // Totals
    const base = items.reduce((acc, item) => acc + (item.salePrice * item.quantity), 0);
    const iva = base * ivaRate;
    const total = base + iva;

    rows.push(['', '', 'BASE IMPONIBLE:', base]);
    rows.push(['', '', `IVA (${(ivaRate * 100).toFixed(0)}%):`, iva]);
    rows.push(['', '', 'TOTAL:', total]);
    rows.push([]);

    // Notes
    rows.push(['NOTAS Y CONDICIONES']);
    // Remove HTML tags from notes for Excel
    const cleanNotes = notes.replace(/<[^>]*>?/gm, '');
    rows.push([cleanNotes]);

    // 2. Create Workbook
    const worksheet = XLSX.utils.aoa_to_sheet(rows);

    // Set some basic column widths
    worksheet['!cols'] = [
        { wch: 60 }, // Concept
        { wch: 10 }, // Quantity
        { wch: 15 }, // Price
        { wch: 15 }, // Total
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Presupuesto");

    // 3. Download File
    const filename = `Presupuesto_${client.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, filename);
};

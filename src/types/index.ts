export type Client = {
    name: string;
    address: string;
    city: string;
    dni: string;
    phone: string;
    email: string;
    date: string;
    project: string;
};

export type CategoryItem = {
    name: string;
    defaultPrice?: number;
};

export type Group = {
    name: string;
    categories: CategoryItem[];
};

export type BudgetItem = {
    id: string;
    group: string;
    category: string;
    description: string;
    width?: number;
    height?: number; // For "metros cuadrados" or units if needed
    quantity: number; // Defaults to 1 or calculated from w*h
    costPrice: number;
    salePrice: number;
};

export type CompanyInfo = {
    name: string;
    address: string;
    city?: string;
    phone: string;
    email: string;
    cif: string;
    logo?: string; // Base64 string
    signature?: string; // Base64 string for stamp/signature
};

export type Budget = {
    id: string;
    client: Client;
    company: CompanyInfo;
    items: BudgetItem[];
    createdAt: number;
    updatedAt: number;
};

export const INITIAL_CLIENT: Client = {
    name: '',
    address: '',
    city: '',
    dni: '',
    phone: '',
    email: '',
    date: new Date().toISOString().split('T')[0],
    project: '',
};

export const INITIAL_COMPANY: CompanyInfo = {
    name: 'DLKom',
    address: 'Garaizar nº 4 - 1º',
    phone: '944 15 66 77',
    email: 'bilbao@dlkom.com',
    cif: 'B95123456',
    logo: '/DLKomPresupuesto/logo.png',
    signature: '/DLKomPresupuesto/SELLO.jpg',
};

export const DEFAULT_NOTES = `1. VALIDEZ DEL PRESUPUESTO
El presente presupuesto tiene una validez de 30 días naturales a partir de su fecha de emisión.

2. FORMA DE PAGO
- 30% A la aceptación del presupuesto.
- 40% Al inicio de las obras y recepción de materiales.
- 30% A la finalización y entrega de la obra.

3. EJECUCIÓN Y PLAZOS
El plazo estimado de ejecución se acordará de mutuo acuerdo tras la firma. Retrasos ajenos a DLKom (falta de suministro, inclemencias o cambios del cliente) no serán responsabilidad de la empresa.

4. GARANTÍAS
DLKom garantiza sus trabajos según la legislación vigente (LOE). La garantía no cubre desperfectos debidos a un uso inadecuado o falta de mantenimiento.

5. DATOS BANCARIOS
CUENTA: ES23 2100 3771 2022 0013 7681`;

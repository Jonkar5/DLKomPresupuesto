import type { Group } from '../types';

export const GROUPS: Group[] = [
    {
        name: "Obra Civil",
        categories: [
            { name: "Albañilería" },
            { name: "Carpintería" },
            { name: "Fontanería" },
            { name: "Electricidad" },
            { name: "Lucidor" },
            { name: "Pladur" },
            { name: "Pintura" },
            { name: "Metalistería" },
            { name: "Ebanistería" },
            { name: "Barnizador" },
            { name: "Lacador" },
            { name: "Acuchillador" }
        ]
    },
    {
        name: "Decoracion",
        categories: [
            { name: "Mob. Cocina" },
            { name: "Mob. Baño" },
            { name: "Gress" },
            { name: "Accesorios cocina" },
            { name: "Accesorios Baño" },
            { name: "Mob. Salon" },
            { name: "Mob. General" }
        ]
    },
    {
        name: "Varios",
        categories: [
            { name: "Transporte" },
            { name: "Desescombro" },
            { name: "Otras instalaciones" },
            { name: "Varios" }
        ]
    },
    {
        name: "Formas de Pago",
        categories: [
            { name: "Transferencia" },
            { name: "A la vista" }
        ]
    }
];

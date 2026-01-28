import { useState } from 'react';
import type { BudgetItem, Group } from '../types';
import { Button } from './ui';
import { Plus, Trash2, Calculator, ChevronDown, ListTree, Tags } from 'lucide-react';
import { ManageGroups, ManageCategories } from './DataManager';

interface BudgetBuilderProps {
    items: BudgetItem[];
    onAddItem: () => void;
    onUpdateItem: (id: string, field: keyof BudgetItem, value: any) => void;
    onRemoveItem: (id: string) => void;
    groups: Group[];
    onUpdateGroups: (groups: Group[]) => void;
}

export function BudgetBuilder({
    items,
    onAddItem,
    onUpdateItem,
    onRemoveItem,
    groups,
    onUpdateGroups
}: BudgetBuilderProps) {
    const [showGroups, setShowGroups] = useState(false);
    const [showCategories, setShowCategories] = useState(false);

    // Calculate derived values for display
    const calculateRow = (item: BudgetItem) => {
        const benefit = item.salePrice - item.costPrice;
        const total = item.salePrice * item.quantity;
        const benefitTotal = benefit * item.quantity;
        // Avoid division by zero
        const margin = item.salePrice > 0 ? ((benefit / item.salePrice) * 100).toFixed(1) : '0';
        return { benefit, total, benefitTotal, margin };
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            <div className="flex items-center justify-between no-print sticky top-20 z-20 bg-slate-50/95 backdrop-blur-sm py-4 -mx-6 px-6 border-b border-slate-100 transition-all duration-300 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-900 text-primary-500 rounded-xl shadow-xl shadow-slate-200">
                        <Calculator size={22} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none">Partidas del Presupuesto</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                            {items.length} Conceptos Añadidos
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="bg-sky-50 border-sky-100 text-sky-700 hover:bg-sky-100 rounded-xl h-11 px-4 font-bold transition-all flex items-center gap-2"
                        onClick={() => setShowGroups(true)}
                    >
                        <ListTree size={16} />
                        Gestión Grupos
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        className="bg-sky-50 border-sky-100 text-sky-700 hover:bg-sky-100 rounded-xl h-11 px-4 font-bold transition-all flex items-center gap-2"
                        onClick={() => setShowCategories(true)}
                    >
                        <Tags size={16} />
                        Gestión Categorías
                    </Button>
                    <div className="w-px h-6 bg-slate-100 mx-2"></div>
                    <Button onClick={onAddItem} className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11 px-6 shadow-xl shadow-slate-200 font-bold transition-all hover:scale-[1.02] active:scale-95 group">
                        <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                        <span className="ml-2">Añadir Concepto</span>
                    </Button>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl shadow-slate-200/50">
                <table className="w-full text-left text-[11px]">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase tracking-widest font-black">
                            <th className="px-6 py-5 min-w-[140px]">Grupo</th>
                            <th className="px-6 py-5 min-w-[140px]">Categoría</th>
                            <th className="px-6 py-5 min-w-[200px]">Descripción</th>
                            <th className="px-6 py-5 w-24 text-center">Metros 2</th>
                            <th className="px-6 py-5 w-32 text-right">Precio de Costo</th>
                            <th className="px-6 py-5 w-32 text-right">Precio de Venta</th>
                            <th className="px-6 py-5 w-32 text-right bg-slate-100/30">Total</th>
                            <th className="px-6 py-5 w-16 no-print"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {items.length === 0 && (
                            <tr>
                                <td colSpan={8} className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center gap-3 opacity-20">
                                        <Calculator size={48} className="text-slate-400" />
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">El presupuesto está vacío</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {items.map((item) => {
                            const { total, margin, benefit } = calculateRow(item);
                            const currentGroup = groups.find(g => g.name === item.group);

                            return (
                                <tr key={item.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                                    <td className="px-6 py-5 align-top">
                                        <div className="relative">
                                            <select
                                                className="w-full appearance-none bg-transparent border-b-2 border-transparent group-hover:border-slate-100 focus:border-primary-500 outline-none pb-1.5 text-slate-900 font-bold cursor-pointer transition-colors"
                                                value={item.group}
                                                onChange={(e) => onUpdateItem(item.id, 'group', e.target.value)}
                                            >
                                                <option value="" disabled>Seleccionar...</option>
                                                {groups.map(g => (
                                                    <option key={g.name} value={g.name}>{g.name}</option>
                                                ))}
                                            </select>
                                            <ChevronDown size={12} className="absolute right-0 top-1 text-slate-300 pointer-events-none group-hover:text-primary-500 transition-colors" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 align-top">
                                        <div className="relative">
                                            <select
                                                className="w-full appearance-none bg-transparent border-b-2 border-transparent group-hover:border-slate-100 focus:border-primary-500 outline-none pb-1.5 text-slate-900 font-bold cursor-pointer transition-colors"
                                                value={item.category}
                                                onChange={(e) => onUpdateItem(item.id, 'category', e.target.value)}
                                            >
                                                <option value="" disabled>-</option>
                                                {currentGroup?.categories.map(c => (
                                                    <option key={c.name} value={c.name}>{c.name}</option>
                                                ))}
                                            </select>
                                            <ChevronDown size={12} className="absolute right-0 top-1 text-slate-300 pointer-events-none group-hover:text-primary-500 transition-colors" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 align-top min-w-[320px]">
                                        <textarea
                                            className="w-full bg-slate-50 border border-transparent hover:border-slate-200 focus:border-primary-500 focus:bg-white rounded-xl p-3 resize-y min-h-[5rem] outline-none text-slate-700 leading-snug font-medium transition-all"
                                            value={item.description}
                                            onChange={(e) => onUpdateItem(item.id, 'description', e.target.value)}
                                            placeholder="Descripción detallada del trabajo..."
                                        />
                                    </td>
                                    <td className="px-6 py-5 align-top">
                                        <input
                                            type="number"
                                            className="w-full text-center bg-transparent border-b-2 border-transparent focus:border-primary-500 outline-none pb-1.5 font-black text-slate-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            value={item.quantity}
                                            onChange={(e) => onUpdateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                                        />
                                    </td>
                                    <td className="px-6 py-5 align-top">
                                        <input
                                            type="number"
                                            className="w-full text-right bg-transparent border-b-2 border-transparent focus:border-primary-500 outline-none pb-1.5 text-slate-400 font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            value={item.costPrice}
                                            onChange={(e) => onUpdateItem(item.id, 'costPrice', parseFloat(e.target.value) || 0)}
                                        />
                                    </td>
                                    <td className="px-6 py-5 align-top">
                                        <div className="flex flex-col gap-1.5">
                                            <input
                                                type="number"
                                                className="w-full text-right bg-transparent border-b-2 border-transparent focus:border-primary-500 outline-none pb-1.5 font-black text-slate-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                value={item.salePrice}
                                                onChange={(e) => onUpdateItem(item.id, 'salePrice', parseFloat(e.target.value) || 0)}
                                            />
                                            {item.salePrice > 0 && (
                                                <div className="flex justify-end">
                                                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-black border tracking-wider inline-flex items-center gap-1 ${benefit >= 0
                                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                        : 'bg-red-50 text-red-600 border-red-100'
                                                        }`}>
                                                        <div className={`w-1 h-1 rounded-full ${benefit >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                                        {margin}%
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 align-top text-right font-black text-slate-900 bg-slate-50/30 text-sm">
                                        {total.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                                    </td>
                                    <td className="px-6 py-5 align-top text-center no-print">
                                        <button
                                            onClick={() => onRemoveItem(item.id)}
                                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 hover:scale-110 active:scale-90"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {showGroups && (
                <ManageGroups
                    groups={groups}
                    onUpdateGroups={onUpdateGroups}
                    onClose={() => setShowGroups(false)}
                />
            )}

            {showCategories && (
                <ManageCategories
                    groups={groups}
                    onUpdateGroups={onUpdateGroups}
                    onClose={() => setShowCategories(false)}
                />
            )}
        </div>
    );
}


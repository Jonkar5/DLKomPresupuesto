import type { BudgetItem } from '../types';
import { Card, cn } from './ui';
import { Euro } from 'lucide-react';

import { translations } from '../i18n/locales';
import type { Language } from '../i18n/locales';

interface SummaryCardProps {
    items: BudgetItem[];
    ivaRate: number;
    onIvaChange: (rate: number) => void;
    language: Language;
}

export function SummaryCard({ items, ivaRate, onIvaChange, language }: SummaryCardProps) {
    const t = translations[language];

    // Aggregations
    const totals = items.reduce((acc, item) => {
        const itemTotal = item.salePrice * item.quantity;
        return {
            baseImponible: acc.baseImponible + itemTotal,
        };
    }, { baseImponible: 0 });

    const ivaAmount = totals.baseImponible * ivaRate;
    const finalTotal = totals.baseImponible + ivaAmount;

    const formatCurrency = (val: number) => val.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });

    return (
        <div className="space-y-4 sticky top-12">
            <Card className="bg-sky-50 border border-sky-100 shadow-xl shadow-sky-900/5 p-5 animate-in fade-in duration-700 overflow-hidden relative">
                <h3 className="text-[9px] font-black mb-4 flex items-center gap-2 text-primary-600 uppercase tracking-[0.3em]">
                    <Euro size={16} />
                    {t.summary}
                </h3>

                <div className="space-y-4">
                    <div className="flex justify-between items-end pb-2 border-b border-slate-50">
                        <span className="text-slate-400 text-[9px] uppercase font-bold tracking-widest">{t.base_imponible}</span>
                        <span className="text-base font-bold tracking-tight text-slate-800">{formatCurrency(totals.baseImponible)}</span>
                    </div>

                    <div className="flex justify-between items-center py-1">
                        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                            <button
                                onClick={() => onIvaChange(0.10)}
                                className={cn(
                                    "px-3 py-1.5 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest",
                                    ivaRate === 0.10 ? "bg-white text-primary-600 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-800"
                                )}
                            >10%</button>
                            <button
                                onClick={() => onIvaChange(0.21)}
                                className={cn(
                                    "px-3 py-1.5 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest",
                                    ivaRate === 0.21 ? "bg-white text-primary-600 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-800"
                                )}
                            >21%</button>
                        </div>
                        <div className="text-right">
                            <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{t.iva} ({(ivaRate * 100).toFixed(0)}%)</p>
                            <span className="text-xs font-bold text-slate-600 tracking-tight">{formatCurrency(ivaAmount)}</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 relative">
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="text-[9px] font-black text-primary-600 uppercase tracking-[0.25em] block mb-0.5">{t.total_budget}</span>
                                <span className="text-2xl font-black tracking-tighter leading-none text-slate-900">{formatCurrency(finalTotal)}</span>
                            </div>
                            <div className="bg-primary-50 p-2 rounded-2xl border border-primary-100">
                                <Euro size={20} className="text-primary-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

import { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { Button, cn } from './ui';
import type { PaymentTerm } from '../types';

interface PaymentTermsEditorProps {
    terms: PaymentTerm[];
    onChange: (terms: PaymentTerm[]) => void;
    isOpen: boolean;
    onClose: () => void;
}

export function PaymentTermsEditor({ terms, onChange, isOpen, onClose }: PaymentTermsEditorProps) {
    const [newLabel, setNewLabel] = useState('');
    const [newPercentage, setNewPercentage] = useState('');

    if (!isOpen) return null;

    const handleAdd = () => {
        if (!newLabel || !newPercentage) return;
        const percentage = parseFloat(newPercentage);
        if (isNaN(percentage)) return;

        const newTerm: PaymentTerm = {
            id: crypto.randomUUID(),
            label: newLabel,
            percentage
        };

        onChange([...terms, newTerm]);
        setNewLabel('');
        setNewPercentage('');
    };

    const handleDelete = (id: string) => {
        onChange(terms.filter(t => t.id !== id));
    };

    const handleUpdate = (id: string, field: 'label' | 'percentage', value: string) => {
        onChange(terms.map(t => {
            if (t.id !== id) return t;
            if (field === 'percentage') {
                const num = parseFloat(value);
                return { ...t, percentage: isNaN(num) ? 0 : num };
            }
            return { ...t, label: value };
        }));
    };

    const totalPercentage = terms.reduce((acc, t) => acc + t.percentage, 0);

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800">Configurar Formas de Pago</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    <div className="space-y-2">
                        {terms.map((term) => (
                            <div key={term.id} className="flex gap-2 items-center">
                                <input
                                    type="number"
                                    value={term.percentage}
                                    onChange={(e) => handleUpdate(term.id, 'percentage', e.target.value)}
                                    className="w-20 px-2 py-1 border border-slate-200 rounded text-sm text-center"
                                    placeholder="%"
                                />
                                <span className="text-slate-400 text-sm">%</span>
                                <input
                                    type="text"
                                    value={term.label}
                                    onChange={(e) => handleUpdate(term.id, 'label', e.target.value)}
                                    className="flex-1 px-2 py-1 border border-slate-200 rounded text-sm"
                                    placeholder="Descripción"
                                />
                                <button
                                    onClick={() => handleDelete(term.id)}
                                    className="text-red-400 hover:text-red-600 p-1"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-2">Añadir Nuevo Plazo</p>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={newPercentage}
                                onChange={(e) => setNewPercentage(e.target.value)}
                                className="w-20 px-2 py-1.5 border border-slate-200 rounded text-sm"
                                placeholder="%"
                            />
                            <input
                                type="text"
                                value={newLabel}
                                onChange={(e) => setNewLabel(e.target.value)}
                                className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-sm"
                                placeholder="Ej. A la firma..."
                            />
                            <Button onClick={handleAdd} size="sm" className="bg-slate-900 text-white shrink-0">
                                <Plus size={16} />
                            </Button>
                        </div>
                    </div>

                    <div className={cn(
                        "p-3 rounded-lg text-sm font-bold flex justify-between items-center",
                        totalPercentage === 100 ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700"
                    )}>
                        <span>Total Porcentaje:</span>
                        <span>{totalPercentage}%</span>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button onClick={onClose} variant="ghost">Cerrar</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

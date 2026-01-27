import { useState } from 'react';
import type { Group } from '../types';
import { Button } from './ui';
import { X, Plus, Trash2, ListTree, Tags, ChevronDown } from 'lucide-react';

interface ManageGroupsProps {
    groups: Group[];
    onUpdateGroups: (groups: Group[]) => void;
    onClose: () => void;
}

export function ManageGroups({ groups, onUpdateGroups, onClose }: ManageGroupsProps) {
    const [newGroupName, setNewGroupName] = useState('');

    const addGroup = () => {
        if (!newGroupName.trim()) return;
        if (groups.find(g => g.name.toLowerCase() === newGroupName.trim().toLowerCase())) {
            alert('Este grupo ya existe');
            return;
        }
        const newGroup: Group = {
            name: newGroupName.trim(),
            categories: [{ name: 'General' }]
        };
        onUpdateGroups([...groups, newGroup]);
        setNewGroupName('');
    };

    const removeGroup = (name: string) => {
        if (groups.length <= 1) {
            alert('Debe haber al menos un grupo');
            return;
        }
        if (confirm(`¿Estás seguro de que quieres eliminar el grupo "${name}" y todas sus categorías?`)) {
            onUpdateGroups(groups.filter(g => g.name !== name));
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-sky-600 text-white rounded-xl shadow-lg shadow-sky-500/20">
                            <ListTree size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 tracking-tight">Gestión de Grupos</h2>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Organiza las secciones del presupuesto</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-3 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-bold text-slate-900 text-sm"
                            placeholder="Nombre del nuevo grupo..."
                            onKeyDown={(e) => e.key === 'Enter' && addGroup()}
                        />
                        <Button onClick={addGroup} className="rounded-xl shadow-lg bg-slate-900">
                            <Plus size={20} />
                        </Button>
                    </div>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {groups.map((group) => (
                            <div key={group.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                                <span className="font-bold text-slate-700">{group.name}</span>
                                <button
                                    onClick={() => removeGroup(group.name)}
                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100">
                    <Button variant="ghost" className="w-full rounded-xl text-slate-400 hover:text-slate-900" onClick={onClose}>
                        Cerrar
                    </Button>
                </div>
            </div>
        </div>
    );
}

interface ManageCategoriesProps {
    groups: Group[];
    onUpdateGroups: (groups: Group[]) => void;
    onClose: () => void;
}

export function ManageCategories({ groups, onUpdateGroups, onClose }: ManageCategoriesProps) {
    const [selectedGroupName, setSelectedGroupName] = useState(groups[0]?.name || '');
    const [newCatName, setNewCatName] = useState('');

    const selectedGroup = groups.find(g => g.name === selectedGroupName);

    const addCategory = () => {
        if (!newCatName.trim() || !selectedGroup) return;
        if (selectedGroup.categories.find(c => c.name.toLowerCase() === newCatName.trim().toLowerCase())) {
            alert('Esta categoría ya existe en este grupo');
            return;
        }

        const updatedGroups = groups.map(g => {
            if (g.name === selectedGroupName) {
                return {
                    ...g,
                    categories: [...g.categories, { name: newCatName.trim() }]
                };
            }
            return g;
        });
        onUpdateGroups(updatedGroups);
        setNewCatName('');
    };

    const removeCategory = (catName: string) => {
        if (!selectedGroup || selectedGroup.categories.length <= 1) {
            alert('Debe haber al menos una categoría por grupo');
            return;
        }

        const updatedGroups = groups.map(g => {
            if (g.name === selectedGroupName) {
                return {
                    ...g,
                    categories: g.categories.filter(c => c.name !== catName)
                };
            }
            return g;
        });
        onUpdateGroups(updatedGroups);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/20">
                            <Tags size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 tracking-tight">Gestión de Categorías</h2>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Añade o quita conceptos de cada grupo</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Seleccionar Grupo</label>
                        <div className="relative">
                            <select
                                value={selectedGroupName}
                                onChange={(e) => setSelectedGroupName(e.target.value)}
                                className="w-full appearance-none bg-slate-50 border border-slate-100 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold text-slate-900 text-sm cursor-pointer"
                            >
                                {groups.map(g => (
                                    <option key={g.name} value={g.name}>{g.name}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newCatName}
                            onChange={(e) => setNewCatName(e.target.value)}
                            className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold text-slate-900 text-sm"
                            placeholder="Nueva categoría..."
                            onKeyDown={(e) => e.key === 'Enter' && addCategory()}
                        />
                        <Button onClick={addCategory} className="rounded-xl shadow-lg bg-slate-900">
                            <Plus size={20} />
                        </Button>
                    </div>

                    <div className="space-y-2 max-h-[250px] overflow-y-auto">
                        {selectedGroup?.categories.map((cat) => (
                            <div key={cat.name} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-50 shadow-sm group hover:border-emerald-100 transition-colors">
                                <span className="font-bold text-slate-700">{cat.name}</span>
                                <button
                                    onClick={() => removeCategory(cat.name)}
                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100">
                    <Button variant="ghost" className="w-full rounded-xl text-slate-400 hover:text-slate-900" onClick={onClose}>
                        Cerrar
                    </Button>
                </div>
            </div>
        </div>
    );
}

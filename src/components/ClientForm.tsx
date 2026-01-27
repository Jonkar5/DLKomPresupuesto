import type { Client } from '../types';
import { Card, Input, Label } from './ui';
import { User, MapPin, Phone, Mail, FileText, BadgeInfo, Briefcase, MapPinned } from 'lucide-react';

interface ClientFormProps {
    client: Client;
    onChange: (field: keyof Client, value: string) => void;
}

export function ClientForm({ client, onChange }: ClientFormProps) {
    return (
        <Card className="mb-8 overflow-hidden border-none shadow-2xl shadow-slate-200/50 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Elegant Header with curved corner style from PDF */}
            <div className="relative bg-slate-900 px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-600 text-white rounded-lg shadow-lg shadow-primary-500/20">
                        <User size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-white uppercase tracking-widest leading-none">Datos del Cliente</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Información de Facturación</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-full border border-slate-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">En Edición</span>
                </div>
            </div>

            <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8">
                    {/* Input Group: Name */}
                    <div className="space-y-2 group">
                        <div className="flex items-center gap-2">
                            <User size={14} className="text-primary-500" />
                            <Label className="uppercase text-[10px] font-bold tracking-widest text-slate-400 group-focus-within:text-primary-600 transition-colors">Nombre Completo</Label>
                        </div>
                        <Input
                            value={client.name}
                            onChange={(e) => onChange('name', e.target.value)}
                            placeholder="Ej. Juan Pérez"
                            className="border-transparent bg-slate-50 border-b-slate-200 rounded-none focus:ring-0 focus:border-b-primary-500 px-0 text-slate-900 font-bold placeholder:text-slate-300 placeholder:font-medium text-base transition-all h-auto py-1"
                        />
                    </div>

                    {/* Input Group: Address */}
                    <div className="space-y-2 group">
                        <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-primary-500" />
                            <Label className="uppercase text-[10px] font-bold tracking-widest text-slate-400 group-focus-within:text-primary-600 transition-colors">Dirección</Label>
                        </div>
                        <Input
                            value={client.address}
                            onChange={(e) => onChange('address', e.target.value)}
                            placeholder="Ej. Av. Libertad 123"
                            className="border-transparent bg-slate-50 border-b-slate-200 rounded-none focus:ring-0 focus:border-b-primary-500 px-0 text-slate-900 font-bold placeholder:text-slate-300 placeholder:font-medium text-base transition-all h-auto py-1"
                        />
                    </div>

                    {/* Input Group: City/Población */}
                    <div className="space-y-2 group">
                        <div className="flex items-center gap-2">
                            <MapPinned size={14} className="text-primary-500" />
                            <Label className="uppercase text-[10px] font-bold tracking-widest text-slate-400 group-focus-within:text-primary-600 transition-colors">Población</Label>
                        </div>
                        <Input
                            value={client.city}
                            onChange={(e) => onChange('city', e.target.value)}
                            placeholder="Ej. Bilbao"
                            className="border-transparent bg-slate-50 border-b-slate-200 rounded-none focus:ring-0 focus:border-b-primary-500 px-0 text-slate-900 font-bold placeholder:text-slate-300 placeholder:font-medium text-base transition-all h-auto py-1"
                        />
                    </div>

                    {/* Input Group: DNI */}
                    <div className="space-y-2 group">
                        <div className="flex items-center gap-2">
                            <BadgeInfo size={14} className="text-primary-500" />
                            <Label className="uppercase text-[10px] font-bold tracking-widest text-slate-400 group-focus-within:text-primary-600 transition-colors">D.N.I. / C.I.F.</Label>
                        </div>
                        <Input
                            value={client.dni}
                            onChange={(e) => onChange('dni', e.target.value)}
                            placeholder="12345678A"
                            className="border-transparent bg-slate-50 border-b-slate-200 rounded-none focus:ring-0 focus:border-b-primary-500 px-0 text-slate-900 font-bold placeholder:text-slate-300 placeholder:font-medium text-base transition-all h-auto py-1"
                        />
                    </div>

                    {/* Input Group: Phone */}
                    <div className="space-y-2 group">
                        <div className="flex items-center gap-2">
                            <Phone size={14} className="text-primary-500" />
                            <Label className="uppercase text-[10px] font-bold tracking-widest text-slate-400 group-focus-within:text-primary-600 transition-colors">Teléfono</Label>
                        </div>
                        <Input
                            value={client.phone}
                            onChange={(e) => onChange('phone', e.target.value)}
                            placeholder="+34 600 000 000"
                            className="border-transparent bg-slate-50 border-b-slate-200 rounded-none focus:ring-0 focus:border-b-primary-500 px-0 text-slate-900 font-bold placeholder:text-slate-300 placeholder:font-medium text-base transition-all h-auto py-1"
                        />
                    </div>

                    {/* Input Group: Email */}
                    <div className="space-y-2 group">
                        <div className="flex items-center gap-2">
                            <Mail size={14} className="text-primary-500" />
                            <Label className="uppercase text-[10px] font-bold tracking-widest text-slate-400 group-focus-within:text-primary-600 transition-colors">Email</Label>
                        </div>
                        <Input
                            value={client.email}
                            onChange={(e) => onChange('email', e.target.value)}
                            placeholder="cliente@email.com"
                            className="border-transparent bg-slate-50 border-b-slate-200 rounded-none focus:ring-0 focus:border-b-primary-500 px-0 text-slate-900 font-bold placeholder:text-slate-300 placeholder:font-medium text-base transition-all h-auto py-1"
                        />
                    </div>

                    {/* Input Group: Date */}
                    <div className="space-y-2 group">
                        <div className="flex items-center gap-2">
                            <FileText size={14} className="text-primary-500" />
                            <Label className="uppercase text-[10px] font-bold tracking-widest text-slate-400 group-focus-within:text-primary-600 transition-colors">Fecha</Label>
                        </div>
                        <Input
                            type="date"
                            value={client.date}
                            onChange={(e) => onChange('date', e.target.value)}
                            className="border-transparent bg-slate-50 border-b-slate-200 rounded-none focus:ring-0 focus:border-b-primary-500 px-0 text-slate-900 font-bold text-base transition-all h-auto py-1"
                        />
                    </div>

                    {/* Input Group: Project */}
                    <div className="space-y-2 group">
                        <div className="flex items-center gap-2">
                            <Briefcase size={14} className="text-primary-500" />
                            <Label className="uppercase text-[10px] font-bold tracking-widest text-slate-400 group-focus-within:text-primary-600 transition-colors">Proyecto</Label>
                        </div>
                        <Input
                            value={client.project}
                            onChange={(e) => onChange('project', e.target.value)}
                            placeholder="Ej. ARRIGORRIAGA_LUCIDO"
                            className="border-transparent bg-slate-50 border-b-slate-200 rounded-none focus:ring-0 focus:border-b-primary-500 px-0 text-slate-900 font-bold placeholder:text-slate-300 placeholder:font-medium text-base transition-all h-auto py-1"
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
}

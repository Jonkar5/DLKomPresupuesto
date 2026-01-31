import type { Client } from '../types';
import { Card, Input, Label } from './ui';
import { User, MapPin, Phone, Mail, FileText, BadgeInfo, Briefcase, MapPinned, CheckCircle2, XCircle } from 'lucide-react';
import { validateNIFOrCIF, validateSpanishPhone } from '../utils/validation';
import { translations } from '../i18n/locales';
import type { Language } from '../i18n/locales';

interface ClientFormProps {
    client: Client;
    onChange: (field: keyof Client, value: string) => void;
    language: Language;
}

export function ClientForm({ client, onChange, language }: ClientFormProps) {
    const t = translations[language];
    return (
        <Card className="mb-8 overflow-hidden border-none shadow-2xl shadow-slate-200/50 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Elegant Header with curved corner style from PDF */}
            <div className="relative bg-slate-900 px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-600 text-white rounded-lg shadow-lg shadow-primary-500/20">
                        <User size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-white uppercase tracking-widest leading-none">{t.client_data}</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Información</p>
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
                            <Label className="uppercase text-[10px] font-bold tracking-widest text-slate-400 group-focus-within:text-primary-600 transition-colors">{t.client_name}</Label>
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
                            <Label className="uppercase text-[10px] font-bold tracking-widest text-slate-400 group-focus-within:text-primary-600 transition-colors">{t.address}</Label>
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
                            <Label className="uppercase text-[10px] font-bold tracking-widest text-slate-400 group-focus-within:text-primary-600 transition-colors">{t.city}</Label>
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
                            <Label className="uppercase text-[10px] font-bold tracking-widest text-slate-400 group-focus-within:text-primary-600 transition-colors">{t.dni_cif}</Label>
                            {client.dni && (
                                validateNIFOrCIF(client.dni) ? (
                                    <CheckCircle2 size={14} className="text-emerald-500 ml-auto" />
                                ) : (
                                    <XCircle size={14} className="text-red-500 ml-auto" />
                                )
                            )}
                        </div>
                        <Input
                            value={client.dni}
                            onChange={(e) => onChange('dni', e.target.value.toUpperCase())}
                            placeholder="12345678A o B12345678"
                            className={`border-transparent bg-slate-50 border-b-2 rounded-none focus:ring-0 px-0 text-slate-900 font-bold placeholder:text-slate-300 placeholder:font-medium text-base transition-all h-auto py-1 ${client.dni ? (validateNIFOrCIF(client.dni) ? 'border-b-emerald-500 focus:border-b-emerald-600' : 'border-b-red-500 focus:border-b-red-600') : 'border-b-slate-200 focus:border-b-primary-500'
                                }`}
                        />
                        {client.dni && !validateNIFOrCIF(client.dni) && (
                            <p className="text-[10px] text-red-500 font-medium mt-1">Formato inválido. Ej: 12345678Z o B12345678</p>
                        )}
                    </div>

                    {/* Input Group: Phone */}
                    <div className="space-y-2 group">
                        <div className="flex items-center gap-2">
                            <Phone size={14} className="text-primary-500" />
                            <Label className="uppercase text-[10px] font-bold tracking-widest text-slate-400 group-focus-within:text-primary-600 transition-colors">{t.phone}</Label>
                            {client.phone && (
                                validateSpanishPhone(client.phone) ? (
                                    <CheckCircle2 size={14} className="text-emerald-500 ml-auto" />
                                ) : (
                                    <XCircle size={14} className="text-red-500 ml-auto" />
                                )
                            )}
                        </div>
                        <Input
                            value={client.phone}
                            onChange={(e) => {
                                let value = e.target.value;
                                if (!value.startsWith('+34 ')) {
                                    value = value.replace(/^\+?34\s?/, '');
                                    value = '+34 ' + value;
                                }
                                onChange('phone', value);
                            }}
                            onFocus={(e) => {
                                if (!e.target.value) {
                                    onChange('phone', '+34 ');
                                }
                            }}
                            placeholder="+34 600 000 000"
                            type="tel"
                            className={`border-transparent bg-slate-50 border-b-2 rounded-none focus:ring-0 px-0 text-slate-900 font-bold placeholder:text-slate-300 placeholder:font-medium text-base transition-all h-auto py-1 ${client.phone ? (validateSpanishPhone(client.phone) ? 'border-b-emerald-500 focus:border-b-emerald-600' : 'border-b-red-500 focus:border-b-red-600') : 'border-b-slate-200 focus:border-b-primary-500'
                                }`}
                        />
                        {client.phone && !validateSpanishPhone(client.phone) && (
                            <p className="text-[10px] text-red-500 font-medium mt-1">Formato inválido. Ej: +34 600 000 000 o 600000000</p>
                        )}
                    </div>

                    {/* Input Group: Email */}
                    <div className="space-y-2 group">
                        <div className="flex items-center gap-2">
                            <Mail size={14} className="text-primary-500" />
                            <Label className="uppercase text-[10px] font-bold tracking-widest text-slate-400 group-focus-within:text-primary-600 transition-colors">{t.email}</Label>
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
                            <Label className="uppercase text-[10px] font-bold tracking-widest text-slate-400 group-focus-within:text-primary-600 transition-colors">{t.date}</Label>
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
                            <Label className="uppercase text-[10px] font-bold tracking-widest text-slate-400 group-focus-within:text-primary-600 transition-colors">{t.project}</Label>
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

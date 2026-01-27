import { useState, useEffect } from 'react';
import type { Client, BudgetItem } from './types';
import { INITIAL_CLIENT } from './types';
import { ClientForm } from './components/ClientForm';
import { BudgetBuilder } from './components/BudgetBuilder';
import { SummaryCard } from './components/SummaryCard';
import { AreaCalculator } from './components/AreaCalculator';
import { Button, cn } from './components/ui';
import { Save, Trash2, Printer, Plus, Upload, Building2, FileText, Eye, EyeOff, Calculator } from 'lucide-react';
import { GROUPS } from './data/categories';
import { INITIAL_COMPANY, DEFAULT_NOTES } from './types';
import type { CompanyInfo, Group } from './types';
import { Lock, Unlock } from 'lucide-react';

function App() {
  const [company, setCompany] = useState<CompanyInfo>(() => {
    const saved = localStorage.getItem('budget_company');
    return saved ? JSON.parse(saved) : INITIAL_COMPANY;
  });

  const [ivaRate, setIvaRate] = useState<number>(() => {
    const saved = localStorage.getItem('budget_iva');
    return saved ? parseFloat(saved) : 0.21;
  });

  const [showPrices, setShowPrices] = useState<boolean>(() => {
    const saved = localStorage.getItem('budget_show_prices');
    return saved ? JSON.parse(saved) : true;
  });

  const [notes, setNotes] = useState<string>(() => {
    const saved = localStorage.getItem('budget_notes');
    return saved || DEFAULT_NOTES;
  });
  const [client, setClient] = useState<Client>(() => {
    const saved = localStorage.getItem('budget_client');
    return saved ? JSON.parse(saved) : INITIAL_CLIENT;
  });

  const [items, setItems] = useState<BudgetItem[]>(() => {
    const saved = localStorage.getItem('budget_items');
    return saved ? JSON.parse(saved) : [];
  });

  const [showCalculator, setShowCalculator] = useState(false);
  const [companyLocked, setCompanyLocked] = useState<boolean>(() => {
    const saved = localStorage.getItem('budget_company_locked');
    return saved ? JSON.parse(saved) : true;
  });

  const [dynamicGroups, setDynamicGroups] = useState<Group[]>(() => {
    const saved = localStorage.getItem('budget_groups');
    return saved ? JSON.parse(saved) : GROUPS;
  });

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('budget_client', JSON.stringify(client));
  }, [client]);

  useEffect(() => {
    localStorage.setItem('budget_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('budget_company', JSON.stringify(company));
  }, [company]);

  useEffect(() => {
    localStorage.setItem('budget_iva', ivaRate.toString());
  }, [ivaRate]);

  useEffect(() => {
    localStorage.setItem('budget_notes', notes);
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('budget_show_prices', JSON.stringify(showPrices));
  }, [showPrices]);

  useEffect(() => {
    localStorage.setItem('budget_company_locked', JSON.stringify(companyLocked));
  }, [companyLocked]);

  useEffect(() => {
    localStorage.setItem('budget_groups', JSON.stringify(dynamicGroups));
  }, [dynamicGroups]);

  const handleClientChange = (field: keyof Client, value: string) => {
    setClient(prev => ({ ...prev, [field]: value }));
  };

  const addItem = () => {
    const defaultGroup = dynamicGroups[0] || GROUPS[0];
    const newItem: BudgetItem = {
      id: crypto.randomUUID(),
      group: defaultGroup.name,
      category: defaultGroup.categories[0].name,
      description: '',
      quantity: 1,
      costPrice: 0,
      salePrice: 0
    };
    setItems(prev => [...prev, newItem]);
  };

  const updateItem = (id: string, field: keyof BudgetItem, value: any) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };

        // Auto-update category if group changes
        if (field === 'group') {
          const group = dynamicGroups.find(g => g.name === value) || GROUPS.find(g => g.name === value);
          if (group && group.categories.length > 0) {
            updatedItem.category = group.categories[0].name;
          }
        }

        return updatedItem;
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta partida?')) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const resetBudget = () => {
    if (confirm('¿Estás seguro de que quieres borrar todo el presupuesto?')) {
      setClient(INITIAL_CLIENT);
      setItems([]);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompany(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-sky-50 border-b border-sky-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group">
              {company.logo ? (
                <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-100 group-hover:scale-105 transition-transform duration-300">
                  <img src={company.logo} alt="Logo" className="h-12 w-auto object-contain" />
                </div>
              ) : (
                <div className="bg-primary-600 p-2.5 rounded-xl text-white shadow-xl shadow-primary-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Building2 size={28} />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-slate-900 leading-none">PRESUPUESTO <span className="text-primary-600 tracking-normal font-extrabold ml-1">{company.name}</span></h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={resetBudget} className="text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all rounded-xl h-11 px-5 border border-transparent hover:border-red-500/20">
              <Trash2 size={18} />
              <span className="hidden md:inline font-bold ml-2">Reiniciar</span>
            </Button>
            <div className="w-px h-8 bg-slate-800 mx-2 hidden md:block"></div>
            <Button
              variant="secondary"
              onClick={() => setShowCalculator(true)}
              className="bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-primary-600 rounded-xl h-11 px-6 shadow-sm transition-all font-bold group"
            >
              <Calculator size={18} className="group-hover:rotate-12 transition-transform" />
              <span className="hidden md:inline ml-2">Calculadora m²</span>
            </Button>
            <div className="w-px h-8 bg-slate-200 mx-2 hidden md:block"></div>
            <Button
              variant="secondary"
              onClick={() => setShowPrices(!showPrices)}
              className={cn(
                "rounded-xl h-11 px-6 shadow-xl transition-all font-bold border",
                showPrices ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700" : "bg-primary-600 border-primary-500 text-white hover:bg-primary-500"
              )}
            >
              {showPrices ? <Eye size={18} /> : <EyeOff size={18} />}
              <span className="hidden md:inline ml-2">{showPrices ? 'Mostrar Precios' : 'Ocultar Precios'}</span>
            </Button>
            <Button variant="secondary" onClick={handlePrint} className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white rounded-xl h-11 px-6 shadow-xl transition-all font-bold">
              <Printer size={18} />
              <span className="hidden md:inline ml-2">Vista PDF</span>
            </Button>
            <Button className="bg-primary-600 hover:bg-primary-500 text-white rounded-xl h-11 px-6 shadow-xl shadow-primary-500/30 font-bold transition-all hover:scale-[1.02] active:scale-95 group">
              <Save size={18} className="group-hover:rotate-12 transition-transform" />
              <span className="hidden md:inline ml-2">Guardar Cambios</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-full mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-10 space-y-8">
            <div className="no-print">
              <ClientForm client={client} onChange={handleClientChange} />
            </div>
            <div className="no-print">
              <BudgetBuilder
                items={items}
                onAddItem={addItem}
                onUpdateItem={updateItem}
                onRemoveItem={removeItem}
                groups={dynamicGroups}
                onUpdateGroups={setDynamicGroups}
              />
            </div>

            <section className="mt-12 bg-white p-8 rounded-xl border border-slate-200 shadow-sm no-print">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Save size={16} /> Notas y Condiciones del Presupuesto
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full min-h-[300px] p-4 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-serif text-sm leading-relaxed text-slate-600"
                placeholder="Escribe aquí las condiciones legales, plazos, formas de pago..."
              />
              <p className="text-[10px] text-slate-400 mt-2 italic">Estas notas se imprimirán en una página aparte al final del presupuesto.</p>
            </section>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-2 space-y-6 no-print">
            <SummaryCard items={items} ivaRate={ivaRate} onIvaChange={setIvaRate} />

            <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm no-print space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Building2 size={14} /> Datos de Empresa
                </h3>
                <button
                  onClick={() => setCompanyLocked(!companyLocked)}
                  className={cn(
                    "p-1.5 rounded-lg transition-all",
                    companyLocked ? "text-emerald-500 bg-emerald-50" : "text-amber-500 bg-amber-50"
                  )}
                >
                  {companyLocked ? <Lock size={14} /> : <Unlock size={14} />}
                </button>
              </div>

              <div className="flex flex-col items-center gap-4 pb-4 border-b border-slate-50">
                {company.logo && (
                  <img src={company.logo} alt="Preview" className="w-24 h-auto object-contain p-2 rounded-lg border border-slate-100" />
                )}
                {!companyLocked && (
                  <label className="w-full">
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    <div className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-slate-200 hover:border-primary-400 hover:bg-primary-50 rounded-lg cursor-pointer transition-all text-slate-500 hover:text-primary-600 font-medium text-[10px] uppercase tracking-wider">
                      <Upload size={14} />
                      {company.logo ? 'Cambiar Logo' : 'Subir Logo'}
                    </div>
                  </label>
                )}
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Nombre Comercial</label>
                  <input
                    type="text"
                    value={company.name}
                    disabled={companyLocked}
                    onChange={(e) => setCompany({ ...company, name: e.target.value })}
                    className="w-full text-sm font-black text-slate-900 bg-slate-50 border-none rounded-lg p-2 focus:ring-2 focus:ring-primary-500/20 disabled:opacity-75"
                    placeholder="Nombre Empresa"
                  />
                </div>
                {/* Repetir disabled={companyLocked} para el resto de inputs si es necesario, o agruparlos */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Dirección</label>
                  <input
                    type="text"
                    value={company.address}
                    disabled={companyLocked}
                    onChange={(e) => setCompany({ ...company, address: e.target.value })}
                    className="w-full text-xs text-slate-600 bg-slate-50 border-none rounded-lg p-2 focus:ring-2 focus:ring-primary-500/20 disabled:opacity-75"
                    placeholder="Dirección"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Localidad</label>
                  <input
                    type="text"
                    value={company.city || ''}
                    disabled={companyLocked}
                    onChange={(e) => setCompany({ ...company, city: e.target.value })}
                    className="w-full text-xs text-slate-600 bg-slate-50 border-none rounded-lg p-2 focus:ring-2 focus:ring-primary-500/20 disabled:opacity-75"
                    placeholder="Localidad"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Teléfono</label>
                    <input
                      type="text"
                      value={company.phone}
                      disabled={companyLocked}
                      onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                      className="w-full text-xs text-slate-600 bg-slate-50 border-none rounded-lg p-2 focus:ring-2 focus:ring-primary-500/20 disabled:opacity-75"
                      placeholder="Teléfono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">CIF / NIF</label>
                    <input
                      type="text"
                      value={company.cif}
                      disabled={companyLocked}
                      onChange={(e) => setCompany({ ...company, cif: e.target.value })}
                      className="w-full text-xs text-slate-600 bg-slate-50 border-none rounded-lg p-2 focus:ring-2 focus:ring-primary-500/20 disabled:opacity-75"
                      placeholder="CIF"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Email</label>
                  <input
                    type="text"
                    value={company.email}
                    disabled={companyLocked}
                    onChange={(e) => setCompany({ ...company, email: e.target.value })}
                    className="w-full text-xs text-slate-600 bg-slate-50 border-none rounded-lg p-2 focus:ring-2 focus:ring-primary-500/20 disabled:opacity-75"
                    placeholder="Email"
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer for mobile/bottom actions */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 lg:hidden z-40 no-print">
        <Button size="lg" className="rounded-full shadow-2xl h-14 px-8 text-lg font-bold">
          <Plus size={24} />
          Nueva Partida
        </Button>
      </div>

      {/* Print-only Layout */}
      <div className="hidden print:block font-sans text-slate-900 bg-white min-h-screen">
        <div className="print-container p-[15mm]">
          {/* Repeating Budget Content Container */}
          <table className="w-full">
            <thead>
              <tr>
                <th className="border-0 font-normal py-4">
                  <div className="grid grid-cols-2 gap-8 items-start text-left">
                    {/* Client Info (Left) */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Datos del Cliente</p>
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-900 leading-none mb-1">{client.name}</p>
                          <p className="text-[10px] text-slate-600 leading-tight">{client.address}</p>
                          <p className="text-[10px] text-slate-600 leading-tight">{client.city}</p>
                          <p className="text-[10px] text-slate-600">NIF/CIF: {client.dni}</p>
                          <p className="text-[10px] text-slate-600 mt-2">FECHA: {client.date}</p>
                          <p className="text-[10px] text-slate-600">PROYECTO: {client.project}</p>
                        </div>
                      </div>
                    </div>

                    {/* Company Info (Right) */}
                    <div className="text-right">
                      <div className="flex flex-col items-end gap-2 mb-4">
                        {company.logo ? (
                          <img src={company.logo} alt="Logo" className="h-16 w-auto object-contain" />
                        ) : (
                          <div className="text-2xl font-black text-slate-900 tracking-tighter">{company.name}</div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">{company.name}</p>
                        <div className="text-[10px] text-slate-500 space-y-0.5">
                          <p>{company.address}</p>
                          <p>{company.city}</p>
                          <p>{company.phone} | {company.email}</p>
                          <p>CIF: {company.cif}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="pt-4 border-0">
                  <h1 className="text-xl font-black text-center mb-8 uppercase text-slate-900 border-none px-0 tracking-[0.1em]">PRESUPUESTO</h1>

                  {/* Budget Items Table */}
                  <table className="w-full mt-4">
                    <thead>
                      <tr className="border-b-2 border-slate-900 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <th className="py-4 text-left px-2">Descripción / Concepto</th>
                        {showPrices && (
                          <th className="py-4 text-right w-32">Total</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {items.map((item) => (
                        <tr key={item.id} className="text-[11px]">
                          <td className="py-4 px-2">
                            <p className="font-bold text-slate-900 mb-1">{item.category}</p>
                            <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">{item.description}</p>
                          </td>
                          {showPrices && (
                            <td className="py-4 text-right text-slate-900 font-bold whitespace-nowrap">{(item.salePrice * item.quantity).toLocaleString('es-ES')} €</td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Totals & Payments Section */}
                  <div className="mt-10 pt-8 border-t border-slate-200">
                    <div className="grid grid-cols-2 gap-12 items-start">
                      {/* Payment Terms (Left) */}
                      <div className="space-y-6">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">FORMA DE PAGO</p>
                          <div className="text-[11px] space-y-3 text-slate-600">
                            <p className="flex justify-between border-b border-slate-50 pb-1">
                              <span>30% A la firma del contrato:</span>
                              <span className="font-bold text-slate-900 whitespace-nowrap">{(items.reduce((acc, item) => acc + (item.salePrice * item.quantity), 0) * (1 + ivaRate) * 0.3).toLocaleString('es-ES')} €</span>
                            </p>
                            <p className="flex justify-between border-b border-slate-50 pb-1">
                              <span>40% Al comienzo de la obra:</span>
                              <span className="font-bold text-slate-900 whitespace-nowrap">{(items.reduce((acc, item) => acc + (item.salePrice * item.quantity), 0) * (1 + ivaRate) * 0.4).toLocaleString('es-ES')} €</span>
                            </p>
                            <p className="flex justify-between border-b border-slate-50 pb-1">
                              <span>30% A la finalización:</span>
                              <span className="font-bold text-slate-900 whitespace-nowrap">{(items.reduce((acc, item) => acc + (item.salePrice * item.quantity), 0) * (1 + ivaRate) * 0.3).toLocaleString('es-ES')} €</span>
                            </p>
                          </div>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl">
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Nº DE CUENTA (LA CAIXA)</p>
                          <p className="text-xs font-bold text-slate-900 tracking-wider font-mono">ES23 2100 3771 2022 0013 7681</p>
                        </div>

                        <div className="pt-4">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">FIRMA CLIENTE</p>
                          <div className="h-20 border border-slate-200 rounded-lg relative overflow-hidden bg-slate-50/10">
                            <div className="absolute bottom-4 left-0 right-0 border-t border-slate-200 mx-8"></div>
                            <span className="absolute bottom-1 left-8 text-[8px] text-slate-300 font-bold uppercase tracking-widest">Firma Autorizada</span>
                          </div>
                        </div>
                      </div>

                      {/* Totals Breakdown (Right) */}
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-bold uppercase tracking-widest">Base Imponible</span>
                            <span className="text-slate-900 font-black text-lg">
                              {items.reduce((acc, item) => acc + (item.salePrice * item.quantity), 0).toLocaleString('es-ES')} €
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-bold uppercase tracking-widest">IVA ({(ivaRate * 100).toFixed(0)}%)</span>
                            <span className="text-slate-900 font-black text-lg">
                              {(items.reduce((acc, item) => acc + (item.salePrice * item.quantity), 0) * ivaRate).toLocaleString('es-ES')} €
                            </span>
                          </div>
                          <div className="pt-6 border-t-2 border-slate-900 flex justify-between items-center">
                            <span className="text-[12px] font-black text-primary-600 uppercase tracking-[0.2em]">TOTAL</span>
                            <span className="text-3xl font-black text-primary-600 tracking-tight whitespace-nowrap">
                              {(items.reduce((acc, item) => acc + (item.salePrice * item.quantity), 0) * (1 + ivaRate)).toLocaleString('es-ES')} €
                            </span>
                          </div>
                        </div>
                        <p className="text-[9px] text-slate-400 text-right italic leading-tight">
                          Este presupuesto tiene una validez de 15 días.<br />
                          Todos los precios incluyen materiales y mano de obra.
                        </p>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Notes Section - Outside the repeating header table */}
          <div className="mt-12 page-no-break pt-8">
            <div className="flex items-center gap-3 mb-6 pb-2 border-b-2 border-slate-900">
              <FileText className="text-primary-600" size={20} />
              <h2 className="text-base font-black text-slate-900 uppercase tracking-widest">Condiciones Generales y Notas</h2>
            </div>
            <div className="text-[11px] text-slate-800 space-y-4 leading-relaxed font-serif p-8 bg-slate-50/20 rounded-xl border border-slate-100">
              {notes.split('.').filter(p => p.trim()).map((point, i) => (
                <p key={i}>
                  <span className="text-primary-600 font-bold mr-2">{i + 1}.</span>
                  {point.trim()}.
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>


      {showCalculator && <AreaCalculator onClose={() => setShowCalculator(false)} />}

      <style>{`
        @media print {
          @page {
            size: auto;
            margin: 0;
          }
          header, .no-print, button, .sticky, textarea::placeholder, .fixed, .max-w-7xl + div {
            display: none !important;
          }
          body {
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
            font-size: 10pt;
            color: #1e293b !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print-container {
            width: 100%;
            overflow: visible;
          }
          .page-break-before {
            page-break-before: always;
          }
          .page-no-break {
            page-break-inside: avoid;
          }
          .max-w-full {
             max-width: 100% !important;
             padding: 0 !important;
          }
          .grid {
            display: grid !important;
          }
          .grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          table {
            width: 100% !important;
            border-collapse: collapse !important;
            margin-top: 0;
            page-break-inside: auto;
          }
          thead {
            display: table-header-group;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          th {
            background-color: transparent !important;
            color: #64748b !important;
            border-bottom: 2px solid #1e293b !important;
            padding: 12px 8px !important;
            font-size: 8px !important;
            text-transform: uppercase !important;
            letter-spacing: 0.1em !important;
            font-weight: 700 !important;
          }
          td {
            padding: 14px 8px !important;
            border-bottom: 1px solid #f1f5f9 !important;
            vertical-align: top !important;
            color: #334155 !important;
          }
          .bg-slate-50\/50, .bg-slate-100\/50 {
            background-color: transparent !important;
          }
          .text-primary-600 {
            color: #0284c7 !important;
          }
          textarea {
            border: none !important;
            padding: 0 !important;
            min-height: auto !important;
            overflow: visible !important;
            display: block !important;
            white-space: pre-wrap !important;
            color: #334155 !important;
          }
          .shadow-lg, .shadow-sm, .shadow-xl, .shadow-2xl {
            box-shadow: none !important;
            border: none !important;
          }
          .rounded-xl {
             border-radius: 0 !important;
          }
          .border {
            border-color: #e2e8f0 !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;

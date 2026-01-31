import { useState } from 'react';
import type { Client, BudgetItem } from './types';
import { INITIAL_CLIENT } from './types';
import { ClientForm } from './components/ClientForm';
import { BudgetBuilder } from './components/BudgetBuilder';
import { SummaryCard } from './components/SummaryCard';
import { AreaCalculator } from './components/AreaCalculator';
import { RichTextEditor } from './components/RichTextEditor';
import { Button, cn } from './components/ui';
import { Save, Trash2, Printer, Plus, Upload, Building2, FileText, Eye, EyeOff, Calculator, Lock, Unlock, Check, Settings, Loader2, Cloud, FileSpreadsheet, Languages, PenTool } from 'lucide-react';
import { GROUPS } from './data/categories';
import { INITIAL_COMPANY, DEFAULT_NOTES, INITIAL_PAYMENT_TERMS } from './types';
import { PaymentTermsEditor } from './components/PaymentTermsEditor';
import { useBudgetSync, type BudgetData } from './hooks/useBudgetSync';
import { exportToExcel } from './utils/exportToExcel';
import { translations } from './i18n/locales';
import { SignatureDialog } from './components/SignatureDialog';

function App() {
  const { budget, updateBudget, loading, isSaving } = useBudgetSync();
  const [showCalculator, setShowCalculator] = useState(false);
  const [showPaymentEditor, setShowPaymentEditor] = useState(false);
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);

  const language = budget?.language || 'eu';
  const t = translations[language];

  // Derive state from budget or use defaults
  const company = budget?.company || INITIAL_COMPANY;
  const ivaRate = budget?.ivaRate ?? 0.21;
  const showPrices = budget?.showPrices ?? true;
  const notes = budget?.notes || DEFAULT_NOTES;
  const client = budget?.client || INITIAL_CLIENT;
  const items = budget?.items || [];
  const companyLocked = budget?.companyLocked ?? true;
  const notesLocked = budget?.notesLocked ?? true;
  const paymentTerms = budget?.paymentTerms || INITIAL_PAYMENT_TERMS;
  const dynamicGroups = budget?.dynamicGroups || GROUPS;

  const toggleLanguage = () => {
    updateBudget({ language: language === 'eu' ? 'es' : 'eu' });
  };

  const handleClientChange = (field: keyof Client, value: string) => {
    updateBudget({ client: { ...client, [field]: value } });
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
    updateBudget({ items: [...items, newItem] });
  };

  const updateItem = (id: string, field: keyof BudgetItem, value: any) => {
    const newItems = items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'group') {
          const group = dynamicGroups.find(g => g.name === value) || GROUPS.find(g => g.name === value);
          if (group && group.categories.length > 0) {
            updatedItem.category = group.categories[0].name;
          }
        }
        return updatedItem;
      }
      return item;
    });
    updateBudget({ items: newItems });
  };

  const removeItem = (id: string) => {
    if (confirm(t.remove_item)) {
      updateBudget({ items: items.filter(item => item.id !== id) });
    }
  };

  const resetBudget = () => {
    if (confirm(t.confirm_reset)) {
      updateBudget({
        client: INITIAL_CLIENT,
        items: []
      });
    }
  };

  const [saveStatus, setSaveStatus] = useState<boolean>(false);

  const handleManualSave = async () => {
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 2000);
    await exportBudget();
  };

  const exportBudget = async () => {
    const data = {
      client,
      items,
      notes,
      ivaRate,
      company,
      dynamicGroups,
      version: '1.0'
    };
    const content = JSON.stringify(data, null, 2);
    const filename = `Presupuesto_${client.name || 'SinNombre'}_${new Date().toISOString().split('T')[0]}.json`;

    if ('showSaveFilePicker' in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: filename,
          types: [{
            description: 'Archivo de Presupuesto',
            accept: { 'application/json': ['.json'] },
          }],
        });
        const writable = await handle.createWritable();
        await writable.write(content);
        await writable.close();
        return;
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
      }
    }

    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importBudget = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        const update: Partial<BudgetData> = {};
        if (data.client) update.client = data.client;
        if (data.items) update.items = data.items;
        if (data.notes) update.notes = data.notes;
        if (data.ivaRate) update.ivaRate = data.ivaRate;
        if (data.company) update.company = data.company;
        if (data.dynamicGroups) update.dynamicGroups = data.dynamicGroups;
        updateBudget(update);
        alert('Ok');
      } catch (err) {
        alert('Error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateBudget({ company: { ...company, logo: reader.result as string } });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateBudget({ company: { ...company, signature: reader.result as string } });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClientSignatureSave = (signature: string) => {
    updateBudget({ client: { ...client, signature } });
  };

  const totals = {
    base: items.reduce((acc, item) => acc + (item.salePrice * item.quantity), 0),
    get iva() { return this.base * ivaRate; },
    get total() { return this.base * (1 + ivaRate); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary-600 mx-auto" />
          <p className="text-slate-500 font-medium">Sincronizando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <header className="bg-sky-50 border-b border-sky-100 sticky top-0 z-30 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Top Row: Branding & Primary Status */}
          <div className="h-14 flex items-center justify-between border-b border-sky-100/50">
            <div className="flex items-center gap-3">
              <div className="relative group">
                {company.logo ? (
                  <div className="bg-white p-1 rounded-lg shadow-sm border border-slate-100">
                    <img src={company.logo} alt="Logo" className="w-10 h-10 object-contain" />
                  </div>
                ) : (
                  <div className="bg-primary-600 p-2 rounded-lg text-white shadow-md">
                    <Building2 size={20} />
                  </div>
                )}
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base font-black tracking-tighter text-slate-800 leading-none flex items-center gap-1">
                  DLKom <span className="text-primary-600 font-extrabold">{t.budget}</span>
                </h1>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 italic">{company.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all shadow-sm",
                isSaving ? "bg-sky-50 border-sky-200" : "bg-emerald-50 border-emerald-200"
              )} title={isSaving ? t.syncing : t.synced}>
                {isSaving ? (
                  <Loader2 size={12} className="animate-spin text-sky-500" />
                ) : (
                  <Cloud size={12} className="text-emerald-500" />
                )}
                <span className={cn(
                  "text-[10px] uppercase font-black tracking-widest",
                  isSaving ? "text-sky-600" : "text-emerald-600"
                )}>
                  {isSaving ? '...' : t.synced}
                </span>
              </div>

              <Button variant="ghost" size="sm" onClick={toggleLanguage} className="h-9 px-3 text-slate-500 hover:bg-slate-200 rounded-xl font-bold border border-slate-200/50 text-[10px] gap-1.5">
                <Languages size={14} />
                {language === 'eu' ? 'EUS' : 'ES'}
              </Button>

              <div className="w-px h-6 bg-sky-100 mx-1"></div>

              <Button
                variant="ghost"
                size="sm"
                onClick={resetBudget}
                className="h-9 px-3 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-xl font-black text-[10px] gap-2 border border-rose-100"
              >
                <Trash2 size={14} />
                <span className="hidden sm:inline uppercase">{t.reset}</span>
              </Button>
            </div>
          </div>

          {/* Bottom Row: Action Toolbar */}
          <div className="h-14 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar scroll-smooth py-2">
            {/* View Group */}
            <div className="flex items-center gap-1 bg-white/40 p-1 rounded-xl border border-sky-100/50 shadow-inner">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCalculator(true)}
                className="h-9 px-3 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all font-bold text-[10px] gap-1.5"
                title={t.calculator}
              >
                <Calculator size={14} className="text-indigo-500" />
                <span className="hidden lg:inline">{t.calculator}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateBudget({ showPrices: !showPrices })}
                className={cn(
                  "h-9 px-3 rounded-lg transition-all font-bold text-[10px] gap-1.5",
                  showPrices ? "text-amber-600 hover:bg-amber-50" : "bg-amber-600 text-white hover:bg-amber-700"
                )}
              >
                {showPrices ? <Eye size={14} className={showPrices ? "text-amber-500" : "text-white"} /> : <EyeOff size={14} />}
                <span className="hidden lg:inline">{showPrices ? t.show_prices : t.hide_prices}</span>
              </Button>
            </div>

            {/* Export Group */}
            <div className="flex items-center gap-1.5">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => window.open('https://1drv.ms/f/c/060cce5bcedbb8f0/IgAZgXpF6QNMTJQZANaTV12vASPiVH4DIKCJdamBZn2jVhY?e=y5JYsY', '_blank')}
                className="h-10 px-4 rounded-xl border-sky-200 bg-white text-sky-600 hover:bg-sky-50 shadow-sm font-bold text-[10px] gap-2"
              >
                <Cloud size={16} className="text-sky-500" />
                <span className="hidden md:inline">{t.onedrive}</span>
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => exportToExcel(budget as BudgetData)}
                className="h-10 px-4 rounded-xl border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 shadow-sm font-bold text-[10px] gap-2"
              >
                <FileSpreadsheet size={16} className="text-emerald-500" />
                <span className="hidden md:inline">Excel</span>
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={handlePrint}
                className="h-10 px-4 rounded-xl border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 shadow-sm font-bold text-[10px] gap-2"
              >
                <Printer size={16} className="text-rose-500" />
                <span className="hidden md:inline">{t.view_pdf}</span>
              </Button>
            </div>

            {/* File Group */}
            <div className="flex items-center gap-1.5">
              <label className="cursor-pointer group">
                <input type="file" accept=".json" onChange={importBudget} className="hidden" />
                <div className="flex items-center h-10 px-3 bg-white border border-slate-200 text-violet-600 hover:text-violet-700 hover:bg-violet-50 hover:border-violet-200 rounded-xl transition-all font-bold text-[10px] gap-2 shadow-sm" title={t.import}>
                  <Upload size={14} className="text-violet-500 group-hover:-translate-y-0.5 transition-transform" />
                  <span className="hidden xl:inline">{t.import}</span>
                </div>
              </label>

              <Button
                size="sm"
                onClick={handleManualSave}
                className={cn(
                  "h-10 px-4 rounded-xl font-bold transition-all text-[10px] gap-2 shadow-sm",
                  saveStatus ? "bg-emerald-600 text-white hover:bg-emerald-500" : "bg-primary-600 text-white hover:bg-primary-700"
                )}
              >
                {saveStatus ? <Check size={16} /> : <Save size={16} className="text-white/80" />}
                <span className="hidden sm:inline">{saveStatus ? 'OK' : t.save_pc}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-full mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-10 space-y-8">
            <div className="no-print">
              <ClientForm client={client} onChange={handleClientChange} language={language} />
            </div>
            <div className="no-print">
              <BudgetBuilder
                items={items}
                onAddItem={addItem}
                onUpdateItem={updateItem}
                onRemoveItem={removeItem}
                groups={dynamicGroups}
                onUpdateGroups={(newGroups) => updateBudget({ dynamicGroups: newGroups })}
                language={language}
              />
            </div>

            <section className="mt-12 bg-white p-8 rounded-xl border border-slate-200 shadow-sm no-print">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Save size={16} /> {t.notes_title}
                </h3>
                <button
                  onClick={() => updateBudget({ notesLocked: !notesLocked })}
                  className={cn(
                    "p-1.5 rounded-lg transition-all flex items-center gap-2 px-3 text-[10px] font-bold uppercase tracking-wider",
                    notesLocked ? "text-emerald-500 bg-emerald-50 border border-emerald-100" : "text-amber-500 bg-amber-50 border border-amber-100"
                  )}
                >
                  {notesLocked ? <Lock size={14} /> : <Unlock size={14} />}
                  {notesLocked ? t.lock_data : t.unlock_data}
                </button>
              </div>
              <RichTextEditor
                value={notes}
                onChange={(newNotes) => updateBudget({ notes: newNotes })}
                placeholder={t.notes_placeholder}
                className="w-full"
                readOnly={notesLocked}
              />
              <p className="text-[10px] text-slate-400 mt-2 italic">{t.notes_print_notice}</p>
            </section>

            <section className="mt-8 bg-white p-8 rounded-xl border border-slate-200 shadow-sm no-print">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-6">
                <PenTool size={16} /> {t.client_signature}
              </h3>

              <div
                className="group relative cursor-pointer"
                onClick={() => setShowSignatureDialog(true)}
              >
                <div className="border-2 border-dashed border-slate-200 rounded-2xl h-40 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 hover:border-primary-300 transition-all overflow-hidden">
                  {client.signature ? (
                    <img
                      src={client.signature}
                      alt="Firma"
                      className="h-full w-full object-contain p-4"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <div className="p-4 bg-white rounded-full shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                        <PenTool size={24} className="text-primary-500" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest">{t.draw_signature}</p>
                    </div>
                  )}
                </div>
                {client.signature && (
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-primary-600 text-white text-[9px] font-bold px-3 py-1 rounded-full shadow-lg">
                      {t.draw_signature}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-slate-400 mt-4 italic text-center italic leading-relaxed">
                {t.accept_conditions}
              </p>
            </section>
          </div>

          <div className="lg:col-span-2 space-y-6 no-print">
            <SummaryCard items={items} ivaRate={ivaRate} onIvaChange={(rate) => updateBudget({ ivaRate: rate })} language={language} />

            <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm no-print space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Building2 size={14} /> {t.company_data}
                </h3>
                <button
                  onClick={() => updateBudget({ companyLocked: !companyLocked })}
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
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <label className="w-full">
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                      <div className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-slate-200 hover:border-primary-400 hover:bg-primary-50 rounded-lg cursor-pointer transition-all text-slate-500 hover:text-primary-600 font-medium text-[10px] uppercase tracking-wider text-center h-full">
                        <Upload size={14} />
                        {company.logo ? 'Logo' : t.upload_logo}
                      </div>
                    </label>
                    <label className="w-full">
                      <input type="file" accept="image/*" onChange={handleSignatureUpload} className="hidden" />
                      <div className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-slate-200 hover:border-primary-400 hover:bg-primary-50 rounded-lg cursor-pointer transition-all text-slate-500 hover:text-primary-600 font-medium text-[10px] uppercase tracking-wider text-center h-full">
                        <Upload size={14} />
                        {company.signature ? t.save : t.upload_stamp}
                      </div>
                    </label>
                  </div>
                )}
                {company.signature && (
                  <div className="text-center w-full">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">Sello/Firma Actual</p>
                    <img src={company.signature} alt="Signature Preview" className="w-32 h-auto object-contain mx-auto p-2 rounded-lg border border-slate-100 bg-white mix-blend-multiply" />
                  </div>
                )}
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => !companyLocked && setShowPaymentEditor(true)}
                  disabled={companyLocked}
                  variant="secondary"
                  className="w-full bg-slate-50 border-slate-100 text-slate-600 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 text-[10px] font-bold uppercase tracking-widest h-10 shadow-sm transition-all disabled:opacity-50"
                >
                  <Settings size={14} />
                  {t.configure_payments}
                </Button>
              </div>

              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{t.commercial_name}</label>
                  <input
                    type="text"
                    value={company.name}
                    disabled={companyLocked}
                    onChange={(e) => updateBudget({ company: { ...company, name: e.target.value } })}
                    className="w-full text-sm font-black text-slate-900 bg-slate-50 border-none rounded-lg p-2 focus:ring-2 focus:ring-primary-500/20 disabled:opacity-75"
                    placeholder={t.commercial_name}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{t.address}</label>
                  <input
                    type="text"
                    value={company.address}
                    disabled={companyLocked}
                    onChange={(e) => updateBudget({ company: { ...company, address: e.target.value } })}
                    className="w-full text-xs text-slate-600 bg-slate-50 border-none rounded-lg p-2 focus:ring-2 focus:ring-primary-500/20 disabled:opacity-75"
                    placeholder={t.address}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{t.city}</label>
                  <input
                    type="text"
                    value={company.city || ''}
                    disabled={companyLocked}
                    onChange={(e) => updateBudget({ company: { ...company, city: e.target.value } })}
                    className="w-full text-xs text-slate-600 bg-slate-50 border-none rounded-lg p-2 focus:ring-2 focus:ring-primary-500/20 disabled:opacity-75"
                    placeholder={t.city}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{t.phone}</label>
                    <input
                      type="text"
                      value={company.phone}
                      disabled={companyLocked}
                      onChange={(e) => updateBudget({ company: { ...company, phone: e.target.value } })}
                      className="w-full text-xs text-slate-600 bg-slate-50 border-none rounded-lg p-2 focus:ring-2 focus:ring-primary-500/20 disabled:opacity-75"
                      placeholder={t.phone}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{t.dni_cif}</label>
                    <input
                      type="text"
                      value={company.cif}
                      disabled={companyLocked}
                      onChange={(e) => updateBudget({ company: { ...company, cif: e.target.value } })}
                      className="w-full text-xs text-slate-600 bg-slate-50 border-none rounded-lg p-2 focus:ring-2 focus:ring-primary-500/20 disabled:opacity-75"
                      placeholder={t.dni_cif}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{t.email}</label>
                  <input
                    type="text"
                    value={company.email}
                    disabled={companyLocked}
                    onChange={(e) => updateBudget({ company: { ...company, email: e.target.value } })}
                    className="w-full text-xs text-slate-600 bg-slate-50 border-none rounded-lg p-2 focus:ring-2 focus:ring-primary-500/20 disabled:opacity-75"
                    placeholder={t.email}
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 lg:hidden z-40 no-print">
        <Button size="lg" className="rounded-full shadow-2xl h-14 px-8 text-lg font-bold" onClick={addItem}>
          <Plus size={24} />
          {t.add_item}
        </Button>
      </div>

      {/* Print View Bilingual */}
      <div className="hidden print:block font-sans text-slate-900 bg-white w-full h-auto overflow-hidden">
        <div className="print-container p-[10mm] max-w-full">
          <table className="w-full">
            <thead>
              <tr>
                <th className="border-0 font-normal py-4">
                  <div className="grid grid-cols-2 gap-8 items-start text-left">
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                          {translations.eu.client_data} / {translations.es.client_data}
                        </p>
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-900 leading-none mb-1">{client.name}</p>
                          <p className="text-[10px] text-slate-600 leading-tight">{client.address}</p>
                          <p className="text-[10px] text-slate-600 leading-tight">{client.city}</p>
                          <p className="text-[10px] text-slate-600">NIF/CIF: {client.dni}</p>
                          <p className="text-[10px] text-slate-600 mt-2">
                            {translations.eu.date} / {translations.es.date.toUpperCase()}: {client.date}
                          </p>
                          <p className="text-[10px] text-slate-600">
                            {translations.eu.project} / {translations.es.project.toUpperCase()}: {client.project}
                          </p>
                        </div>
                      </div>
                    </div>
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
                  <h1 className="text-xl font-black text-center mb-8 uppercase text-slate-900 border-none px-0 tracking-[0.1em]">
                    {translations.eu.budget} / {translations.es.budget}
                  </h1>
                  <table className="w-full mt-4">
                    <thead>
                      <tr className="border-b-2 border-slate-900 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <th className="py-4 text-left px-2">
                          {translations.eu.concept} / {translations.es.concept}
                        </th>
                        {showPrices && (
                          <th className="py-4 text-right w-32">
                            {translations.eu.total} / {translations.es.total}
                          </th>
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

                  <div className="mt-4 pt-2 border-t border-slate-200 page-no-break">
                    <div className="grid grid-cols-2 gap-4 items-start">
                      <div className="space-y-3">
                        <div>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                            {translations.eu.payment_method} / {translations.es.payment_method}
                          </p>
                          <div className="text-[9px] text-slate-600 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
                            {paymentTerms.map((term) => (
                              <div key={term.id} className="contents border-b border-slate-50">
                                <span className="whitespace-nowrap pb-0.5 border-b border-slate-50/50">{term.percentage}% {term.label}:</span>
                                <span className="font-bold text-slate-900 whitespace-nowrap text-right pb-0.5 border-b border-slate-50/50">
                                  {(totals.total * (term.percentage / 100)).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                          <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                            {translations.eu.account_number} / {translations.es.account_number}
                          </p>
                          <p className="text-[10px] font-bold text-slate-900 tracking-wider font-mono">ES23 2100 3771 2022 0013 7681</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[8px]">
                            <span className="text-slate-500 font-bold uppercase tracking-widest">
                              {translations.eu.base_imponible} / {translations.es.base_imponible}
                            </span>
                            <span className="text-slate-900 font-bold text-sm">
                              {totals.base.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-[8px]">
                            <span className="text-slate-500 font-bold uppercase tracking-widest">
                              {translations.eu.iva} / {translations.es.iva} ({(ivaRate * 100).toFixed(0)}%)
                            </span>
                            <span className="text-slate-900 font-bold text-sm">
                              {totals.iva.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                            </span>
                          </div>
                          <div className="pt-2 border-t border-slate-900 flex justify-between items-center">
                            <span className="text-[9px] font-black text-primary-600 uppercase tracking-[0.2em]">
                              {translations.eu.total_budget} / {translations.es.total_budget}
                            </span>
                            <span className="text-xl font-black text-primary-600 tracking-tight whitespace-nowrap">
                              {totals.total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                            </span>
                          </div>
                        </div>
                        <p className="text-[7px] text-slate-400 text-right italic leading-tight">
                          {translations.eu.validity_notice} / {translations.es.validity_notice} <br />
                          {translations.eu.materials_notice} / {translations.es.materials_notice}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-row justify-between items-end w-full gap-8">
                      <div className="flex-1 max-w-[45%]">
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1 pl-2">
                          {translations.eu.client_signature} / {translations.es.client_signature}
                        </p>
                        <div
                          className="h-20 border border-slate-200 rounded-lg relative overflow-hidden bg-slate-50/5 w-full cursor-pointer no-print-bg"
                          onClick={() => setShowSignatureDialog(true)}
                        >
                          {client.signature ? (
                            <img src={client.signature} alt="Client Signature" className="h-full w-full object-contain" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center opacity-20">
                              <PenTool size={20} className="text-slate-400" />
                            </div>
                          )}
                          <div className="absolute bottom-4 left-0 right-0 border-t border-slate-200 mx-4"></div>
                          <span className="absolute bottom-1 left-4 text-[6px] text-slate-400 font-bold uppercase tracking-widest italic">
                            {translations.eu.accept_conditions} / {translations.es.accept_conditions}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col items-end">
                        <div className="h-16 w-full relative flex items-center justify-end">
                          {company.signature ? (
                            <img src={company.signature} alt="Firma Empresa" className="h-full object-contain mix-blend-multiply opacity-95 rotate-[-1deg] mr-4" style={{ maxWidth: '100%' }} />
                          ) : (
                            <div className="w-24 h-16 border border-dashed border-slate-200 rounded flex items-center justify-center">
                              <span className="text-[7px] text-slate-300 uppercase">Sin Sello</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-12 pt-8 page-break-before page-no-break">
            <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-slate-900">
              <FileText className="text-primary-600" size={20} />
              <h2 className="text-base font-black text-slate-900 uppercase tracking-widest">
                {translations.eu.general_conditions} / {translations.es.general_conditions}
              </h2>
            </div>
            <div
              className="text-[10px] text-slate-800 leading-snug font-serif p-4 bg-slate-50/20 rounded-xl border border-slate-100 editor-print-content"
              dangerouslySetInnerHTML={{ __html: notes }}
            />
          </div>
        </div>
      </div>

      {showCalculator && <AreaCalculator onClose={() => setShowCalculator(false)} />}
      <SignatureDialog
        isOpen={showSignatureDialog}
        onClose={() => setShowSignatureDialog(false)}
        onSave={handleClientSignatureSave}
        language={language}
      />

      <style>{`
        @media print {
          @page { size: auto; margin: 0 !important; }
          header, .no-print, button, .sticky, textarea::placeholder, .fixed, .max-w-7xl + div { display: none !important; }
          html, body { margin: 0 !important; padding: 0 !important; height: auto !important; }
          body {
            background: white !important;
            padding: 10mm 15mm !important;
            font-size: 10pt;
            color: #1e293b !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            overflow: visible !important;
          }
          .print-container { width: 100% !important; height: auto !important; overflow: visible !important; padding: 0 !important; }
          .page-break-before { page-break-before: always; }
          .page-no-break { page-break-inside: avoid !important; break-inside: avoid !important; display: block !important; }
          .max-w-full { max-width: 100% !important; padding: 0 !important; }
          .grid { display: grid !important; }
          .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          table { width: 100% !important; border-collapse: collapse !important; margin-top: 0; page-break-inside: auto; }
          thead { display: table-header-group; }
          tr { page-break-inside: avoid; page-break-after: auto; }
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
          td { padding: 14px 8px !important; border-bottom: 1px solid #f1f5f9 !important; vertical-align: top !important; color: #334155 !important; }
          .editor-print-content font[size="1"] { font-size: 8pt !important; }
          .editor-print-content font[size="2"] { font-size: 9pt !important; }
          .editor-print-content font[size="3"] { font-size: 10pt !important; }
          .editor-print-content font[size="4"] { font-size: 12pt !important; }
          .editor-print-content font[size="5"] { font-size: 14pt !important; }
          .editor-print-content b, .editor-print-content strong { font-weight: 800 !important; }
          .editor-print-content i, .editor-print-content em { font-style: italic !important; }
          .editor-print-content p, .editor-print-content div { margin-bottom: 0.5em !important; }
        }
      `}</style>
      <PaymentTermsEditor
        terms={paymentTerms}
        onChange={(newTerms) => updateBudget({ paymentTerms: newTerms })}
        isOpen={showPaymentEditor}
        onClose={() => setShowPaymentEditor(false)}
      />
    </div >
  );
}

export default App;

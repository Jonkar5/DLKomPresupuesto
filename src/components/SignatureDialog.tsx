import { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from './ui';
import { X, Check } from 'lucide-react';
import { translations } from '../i18n/locales';
import type { Language } from '../i18n/locales';

interface SignatureDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (dataUrl: string) => void;
    language: Language;
}

export const SignatureDialog = ({ isOpen, onClose, onSave, language }: SignatureDialogProps) => {
    const sigCanvas = useRef<SignatureCanvas>(null);
    const t = translations[language];

    if (!isOpen) return null;

    const handleSave = () => {
        if (sigCanvas.current) {
            if (sigCanvas.current.isEmpty()) {
                alert(t.draw_signature);
                return;
            }
            onSave(sigCanvas.current.getTrimmedCanvas().toDataURL('image/png'));
            onClose();
        }
    };

    const handleClear = () => {
        if (sigCanvas.current) {
            sigCanvas.current.clear();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <h3 className="text-lg font-bold text-slate-800">{t.client_signature}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-white transition-all shadow-sm">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 overflow-hidden relative group">
                        <SignatureCanvas
                            ref={sigCanvas}
                            penColor="#000"
                            canvasProps={{
                                className: "w-full h-64 cursor-crosshair",
                                style: { width: '100%', height: '256px' }
                            }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 group-hover:opacity-10 transition-opacity">
                            <p className="text-slate-400 font-medium uppercase tracking-widest text-sm">{t.draw_signature}</p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-between gap-3">
                        <Button
                            variant="ghost"
                            onClick={handleClear}
                            className="text-slate-500 hover:bg-slate-100 h-12 px-6 rounded-xl font-bold"
                        >
                            {t.clear}
                        </Button>

                        <div className="flex gap-3">
                            <Button
                                variant="ghost"
                                onClick={onClose}
                                className="text-slate-400 h-12 px-6 rounded-xl font-bold"
                            >
                                {t.close}
                            </Button>
                            <Button
                                onClick={handleSave}
                                className="bg-primary-600 hover:bg-primary-500 text-white h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary-500/30 flex items-center gap-2"
                            >
                                <Check size={18} />
                                {t.save}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

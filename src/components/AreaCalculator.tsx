import { useState } from 'react';
import { Button } from './ui';
import { X, Calculator, Square, Maximize } from 'lucide-react';

interface AreaCalculatorProps {
    onClose: () => void;
}

export function AreaCalculator({ onClose }: AreaCalculatorProps) {
    const [mode, setMode] = useState<'walls' | 'surface'>('walls');

    // Wall state
    const [l1, setL1] = useState<string>('');
    const [l2, setL2] = useState<string>('');
    const [w1, setW1] = useState<string>('');
    const [w2, setW2] = useState<string>('');
    const [height, setHeight] = useState<string>('');

    // Surface state
    const [surfaceWidth, setSurfaceWidth] = useState<string>('');
    const [surfaceLength, setSurfaceLength] = useState<string>('');

    const calculateWalls = () => {
        const sum = parseFloat(l1) + parseFloat(l2) + parseFloat(w1) + parseFloat(w2);
        const h = parseFloat(height);
        return (sum * h).toFixed(2);
    };

    const calculateSurface = () => {
        return (parseFloat(surfaceWidth) * parseFloat(surfaceLength)).toFixed(2);
    };

    const isWallsValid = l1 && l2 && w1 && w2 && height;
    const isSurfaceValid = surfaceWidth && surfaceLength;

    const handleCopy = (value: string) => {
        navigator.clipboard.writeText(value);
        alert('Resultado copiado al portapapeles: ' + value + ' m²');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-600 text-white rounded-xl shadow-lg shadow-primary-500/20">
                            <Calculator size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 tracking-tight">Calculadora de Superficie</h2>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Metros Cuadrados (m²)</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                        <X size={20} />
                    </button>
                </div>

                {/* Mode Selector */}
                <div className="p-2 bg-slate-100 mx-6 mt-6 rounded-2xl flex gap-1 border border-slate-200">
                    <button
                        onClick={() => setMode('walls')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'walls' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <Maximize size={14} />
                        Paredes
                    </button>
                    <button
                        onClick={() => setMode('surface')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'surface' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <Square size={14} />
                        Suelo / Techo
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {mode === 'walls' ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Largo Derecha (m)</label>
                                    <input
                                        type="number"
                                        value={l1}
                                        onChange={(e) => setL1(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-bold text-slate-900"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Largo Izquierda (m)</label>
                                    <input
                                        type="number"
                                        value={l2}
                                        onChange={(e) => setL2(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-bold text-slate-900"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Ancho Derecha (m)</label>
                                    <input
                                        type="number"
                                        value={w1}
                                        onChange={(e) => setW1(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-bold text-slate-900"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Ancho Izquierda (m)</label>
                                    <input
                                        type="number"
                                        value={w2}
                                        onChange={(e) => setW2(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-bold text-slate-900"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Altura (m)</label>
                                <input
                                    type="number"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-bold text-slate-900"
                                    placeholder="0.00"
                                />
                            </div>

                            {isWallsValid && (
                                <div className="bg-primary-50 p-4 rounded-2xl border border-primary-100 flex items-center justify-between">
                                    <div>
                                        <label className="text-[8px] font-black text-primary-400 uppercase tracking-widest block">Total Paredes</label>
                                        <span className="text-2xl font-black text-primary-700">{calculateWalls()} m²</span>
                                    </div>
                                    <Button onClick={() => handleCopy(calculateWalls())} size="sm" className="rounded-xl shadow-lg shadow-primary-500/20">
                                        Copiar
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Ancho (m)</label>
                                    <input
                                        type="number"
                                        value={surfaceWidth}
                                        onChange={(e) => setSurfaceWidth(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-bold text-slate-900"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Largo (m)</label>
                                    <input
                                        type="number"
                                        value={surfaceLength}
                                        onChange={(e) => setSurfaceLength(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-bold text-slate-900"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            {isSurfaceValid && (
                                <div className="bg-primary-50 p-4 rounded-2xl border border-primary-100 flex items-center justify-between">
                                    <div>
                                        <label className="text-[8px] font-black text-primary-400 uppercase tracking-widest block">Total Superficie</label>
                                        <span className="text-2xl font-black text-primary-700">{calculateSurface()} m²</span>
                                    </div>
                                    <Button onClick={() => handleCopy(calculateSurface())} size="sm" className="rounded-xl shadow-lg shadow-primary-500/20">
                                        Copiar
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                    <Button variant="ghost" className="flex-1 rounded-xl text-slate-400 hover:text-slate-900" onClick={onClose}>
                        Cerrar
                    </Button>
                </div>
            </div>
        </div>
    );
}

import { useRef, useEffect, useState } from 'react';
import { Bold, Italic, Type, Minus, Plus } from 'lucide-react';
import { Button } from './ui';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className = '' }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    // Sync external value changes to editor content
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            // Only update if content is effectively different to avoid cursor jumps
            // This is a simple check, could be more robust
            if (!isFocused) {
                editorRef.current.innerHTML = value;
            }
        }
    }, [value, isFocused]);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const execCommand = (command: string, value: string | undefined = undefined) => {
        document.execCommand(command, false, value);
        if (editorRef.current) {
            // Keep focus on editor
            editorRef.current.focus();
            handleInput();
        }
    };

    return (
        <div className={`overflow-hidden rounded-lg border bg-slate-50 transition-colors ${isFocused ? 'border-primary-500 ring-1 ring-primary-500/20' : 'border-slate-200'} ${className}`}>
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 border-b border-slate-200 bg-slate-100/50">
                <Button
                    variant="ghost"
                    size="sm"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        execCommand('bold');
                    }}
                    className="h-8 w-8 p-0 text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                    title="Negrita (Ctrl+B)"
                >
                    <Bold size={16} />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        execCommand('italic');
                    }}
                    className="h-8 w-8 p-0 text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                    title="Cursiva (Ctrl+I)"
                >
                    <Italic size={16} />
                </Button>

                <div className="w-px h-5 bg-slate-300 mx-1"></div>

                <Button
                    variant="ghost"
                    size="sm"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        execCommand('fontSize', '1');
                    }}
                    className="h-8 w-8 p-0 text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                    title="Texto Pequeño"
                >
                    <Minus size={14} />
                    <Type size={10} className="ml-0.5" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        execCommand('fontSize', '3');
                    }}
                    className="h-8 w-8 p-0 text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                    title="Texto Normal"
                >
                    <Type size={14} />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        execCommand('fontSize', '5');
                    }}
                    className="h-8 w-8 p-0 text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                    title="Texto Grande"
                >
                    <Plus size={10} className="mr-0.5" />
                    <Type size={16} />
                </Button>
            </div>

            {/* Editor Area */}
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="min-h-[300px] p-4 outline-none font-serif text-sm leading-relaxed text-slate-700 editor-content"
                style={{ overflowY: 'auto' }}
            />

            {/* Placeholder simulation (simple css approach usually better, but for now just validation) */}
            {!value && !isFocused && (
                <div className="absolute top-[3.5rem] left-4 text-slate-400 pointer-events-none text-sm font-serif italic">
                    {placeholder}
                </div>
            )}

            <style>{`
                .editor-content font[size="1"] { font-size: 0.75rem !important; }
                .editor-content font[size="2"] { font-size: 0.875rem !important; }
                .editor-content font[size="3"] { font-size: 1rem !important; } /* Default */
                .editor-content font[size="4"] { font-size: 1.125rem !important; }
                .editor-content font[size="5"] { font-size: 1.25rem !important; }
                .editor-content font[size="6"] { font-size: 1.5rem !important; }
                .editor-content font[size="7"] { font-size: 2rem !important; }
                
                .editor-content b, .editor-content strong { font-weight: 800; }
                .editor-content i, .editor-content em { font-style: italic; }
            `}</style>
        </div>
    );
}

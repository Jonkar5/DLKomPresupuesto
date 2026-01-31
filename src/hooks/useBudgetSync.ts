import { useState, useEffect, useRef, useCallback } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import {
    INITIAL_CLIENT, INITIAL_COMPANY, DEFAULT_NOTES, INITIAL_PAYMENT_TERMS
} from '../types';
import type {
    Client, BudgetItem, CompanyInfo, Group, PaymentTerm
} from '../types';
import type { Language } from '../i18n/locales';
import { GROUPS } from '../data/categories';

// Define the shape of our synced data
export interface BudgetData {
    client: Client;
    items: BudgetItem[];
    notes: string;
    ivaRate: number;
    company: CompanyInfo;
    dynamicGroups: Group[];
    paymentTerms: PaymentTerm[];
    showPrices: boolean;
    companyLocked: boolean;
    notesLocked: boolean;
    language: Language;
}

const DEFAULT_BUDGET: BudgetData = {
    client: INITIAL_CLIENT,
    items: [],
    notes: DEFAULT_NOTES,
    ivaRate: 0.21,
    company: INITIAL_COMPANY,
    dynamicGroups: GROUPS,
    paymentTerms: INITIAL_PAYMENT_TERMS,
    showPrices: true,
    companyLocked: true,
    notesLocked: true,
    language: 'eu',
};

export function useBudgetSync() {
    const [budgetId, setBudgetId] = useState<string | null>(null);
    const [budget, setBudget] = useState<BudgetData>(DEFAULT_BUDGET);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Use a ref to track if the last update came from remote to avoid loops
    const ignoreNextLocalUpdate = useRef(false);
    // Use a ref to track if we have successfully loaded data from Firestore at least once
    const hasLoadedRemote = useRef(false);

    // 1. Initialize ID (fixed global ID)
    useEffect(() => {
        // We use a fixed ID for global synchronization
        const GLOBAL_ID = 'global-shared-budget-v1';
        setBudgetId(GLOBAL_ID);
    }, []);

    // 2. Subscribe to Firestore
    useEffect(() => {
        if (!budgetId) return;

        setLoading(true);
        const docRef = doc(db, 'budgets', budgetId);

        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data() as Partial<BudgetData>;
                // Merge with defaults to ensure all fields exist
                const mergedData = { ...DEFAULT_BUDGET, ...data };

                ignoreNextLocalUpdate.current = true;
                hasLoadedRemote.current = true; // Mark as loaded
                setBudget(mergedData);
            } else {
                // Document doesn't exist yet, mark as loaded so we can create it
                hasLoadedRemote.current = true;
            }
            setLoading(false);
        }, (error) => {
            console.error("Sync error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [budgetId]);

    // 3. Debounced Save Function
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

    const saveToFirestore = useCallback(async (data: BudgetData) => {
        if (!budgetId) return;

        setIsSaving(true);
        try {
            await setDoc(doc(db, 'budgets', budgetId), data, { merge: true });
        } catch (error) {
            console.error("Error saving to Firestore:", error);
        } finally {
            setIsSaving(false);
        }
    }, [budgetId]);

    // 4. Update Handler
    const updateBudget = useCallback((partialData: Partial<BudgetData>) => {
        setBudget(prev => {
            const newData = { ...prev, ...partialData };

            // IMPORTANT: Only save if we have successfully loaded from remote
            // This prevents overwriting cloud data with local defaults on startup
            if (hasLoadedRemote.current) {
                // Save to Firestore (Debounced)
                if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

                saveTimeoutRef.current = setTimeout(() => {
                    saveToFirestore(newData);
                }, 1000); // 1 second debounce
            }

            return newData;
        });
    }, [saveToFirestore]);

    return {
        budget,
        updateBudget,
        loading,
        isSaving,
        budgetId
    };
}

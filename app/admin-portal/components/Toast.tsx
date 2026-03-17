'use client';

import { useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

export interface ToastState {
  show: boolean;
  message: string;
  isError: boolean;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', isError: false });

  function showToast(message: string, isError = false) {
    setToast({ show: true, message, isError });
    setTimeout(() => setToast({ show: false, message: '', isError: false }), 3500);
  }

  return { toast, showToast };
}

export function Toast({ toast }: { toast: ToastState }) {
  if (!toast.show) return null;
  return (
    <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-sm font-sans font-semibold animate-in fade-in slide-in-from-top-4 duration-300 ${toast.isError ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
      {toast.isError ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
      {toast.message}
    </div>
  );
}

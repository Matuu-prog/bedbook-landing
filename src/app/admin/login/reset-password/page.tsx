"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, CheckCircle, Loader2, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const router = useRouter();

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setStatus({ type: 'error', text: "Las contraseñas no coinciden." });
            return;
        }

        if (password.length < 6) {
            setStatus({ type: 'error', text: "La contraseña debe tener al menos 6 caracteres." });
            return;
        }

        setLoading(true);
        setStatus(null);

        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            setStatus({ type: 'error', text: error.message });
        } else {
            setStatus({ type: 'success', text: "¡Contraseña actualizada con éxito! Redirigiendo al login..." });
            setTimeout(() => {
                router.push("/admin/login");
            }, 3000);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="bg-primary p-8 text-center text-white">
                    <div className="w-16 h-16 mx-auto mb-4 bg-white/10 flex items-center justify-center rounded-2xl border border-white/20">
                        <Lock className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold">Nueva Contraseña</h2>
                    <p className="text-slate-300 text-sm mt-2">Ingresá tu nueva clave de acceso gerencial.</p>
                </div>

                <form onSubmit={handlePasswordUpdate} className="p-8 space-y-6">
                    {status && (
                        <div className={`p-4 rounded-xl text-sm text-center border flex items-center justify-center gap-2 ${
                            status.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                        }`}>
                            {status.type === 'success' && <CheckCircle className="w-4 h-4" />}
                            {status.text}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Nueva Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-900"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Confirmar Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-900"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || status?.type === 'success'}
                        className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-accent/20 disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Guardar Nueva Contraseña</>}
                    </button>
                </form>
            </div>
        </div>
    );
}

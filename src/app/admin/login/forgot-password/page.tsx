"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft, Loader2, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const router = useRouter();

    const handleResetRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/admin/login/reset-password`,
        });

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({ type: 'success', text: "Se ha enviado un correo con las instrucciones para restablecer tu contraseña." });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="bg-primary p-8 text-center text-white">
                    <div className="w-16 h-16 mx-auto mb-4 bg-white/10 flex items-center justify-center rounded-2xl border border-white/20">
                        <Mail className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold">Recuperar Acceso</h2>
                    <p className="text-slate-300 text-sm mt-2">Enviaremos un link a tu correo para que puedas cambiar tu contraseña.</p>
                </div>

                <form onSubmit={handleResetRequest} className="p-8 space-y-6">
                    {message && (
                        <div className={`p-4 rounded-xl text-sm text-center border ${
                            message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                        }`}>
                            {message.text}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Correo Electrónico</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-900"
                                placeholder="tu-email@ejemplo.com"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || (message?.type === 'success')}
                        className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-accent/20 disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> Enviar Instrucciones</>}
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push("/admin/login")}
                        className="w-full flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Volver al Login
                    </button>
                </form>
            </div>
        </div>
    );
}

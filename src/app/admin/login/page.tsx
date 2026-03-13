"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true); // Arrancamos en true hasta verificar sesión
    const router = useRouter();

    useEffect(() => {
        const checkAutoLogin = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                router.push("/admin");
            } else {
                setLoading(false); // Liberamos el renderizado del form
            }
        };
        checkAutoLogin();
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(false);
        setLoading(true);

        const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            setError(true);
            setLoading(false);
        } else {
            router.push("/admin");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="bg-primary p-8 text-center">
                    <div className="w-20 mx-auto mb-6 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20">
                        <Lock className="w-12 h-12 text-white" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Acceso Gerencial</h2>
                    <p className="text-slate-300 text-sm font-light">Panel de Control & Analytics</p>
                </div>

                <form onSubmit={handleLogin} className="p-8 space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm text-center border border-red-100">
                            Credenciales incorrectas. Verifique e intente nuevamente.
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Correo Electrónico</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-900"
                                    placeholder="gerencia@bedbook.com.ar"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-900"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-accent/20 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Ingresar al Panel"}
                        {!loading && <ArrowRight className="w-5 h-5" />}
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push("/")}
                        className="w-full text-center text-sm text-slate-500 hover:text-primary transition-colors mt-4 block"
                    >
                        Volver a la web pública
                    </button>
                </form>
            </div>
        </div>
    );
}

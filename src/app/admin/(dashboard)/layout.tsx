"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, LayoutGrid, MessageSquare, Settings, LogOut, Home, Image as ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    const navItems = [
        { name: "Analytics", href: "/admin", icon: BarChart3 },
        { name: "Inventario", href: "/admin/inventory", icon: LayoutGrid },
        { name: "Reseñas", href: "/admin/reviews", icon: MessageSquare },
        { name: "Galería Central", href: "/admin/gallery", icon: ImageIcon },
        { name: "Configuración", href: "/admin/settings", icon: Settings },
    ];

    useEffect(() => {
        const checkSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error || !session) {
                    router.push("/admin/login");
                } else {
                    setIsLoading(false);
                }
            } catch (err) {
                router.push("/admin/login");
            }
        };
        checkSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                router.push('/admin/login');
            }
        });

        return () => {
            authListener?.subscription?.unsubscribe();
        };
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <p className="text-slate-400 font-light animate-pulse flex items-center gap-2">Verificando credenciales...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex fixed h-full z-20">
                <div className="p-6 border-b border-white/10">
                    <h1 className="text-xl font-bold text-white tracking-wide">Bedbook CMS</h1>
                    <p className="text-xs text-slate-400 mt-1">Panel Gerencial v1.0</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? "bg-accent/10 text-accent font-medium border border-accent/20"
                                    : "hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10 space-y-2">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all text-sm"
                    >
                        <Home className="w-4 h-4" />
                        Sitio Público
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all text-sm text-slate-400 text-left"
                    >
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 p-8 w-full max-w-7xl mx-auto overflow-x-hidden">
                {children}
            </main>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Save, Loader2, Info } from "lucide-react";

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const [settings, setSettings] = useState({
        properties_count: 50,
        happy_guests: 10000,
        return_rate: 98,
    });

    useEffect(() => {
        async function fetchSettings() {
            setLoading(true);
            const { data } = await supabase.from('site_settings').select('*').single();
            if (data) {
                setSettings({
                    properties_count: data.properties_count,
                    happy_guests: data.happy_guests,
                    return_rate: data.return_rate
                });
            }
            setLoading(false);
        }
        fetchSettings();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: parseInt(value) || 0
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        setSuccessMessage("");
        const { error } = await supabase
            .from('site_settings')
            .update(settings)
            .eq('id', 1);

        setSaving(false);
        if (!error) {
            setSuccessMessage("¡Contadores actualizados exitosamente en la web pública!");
            setTimeout(() => setSuccessMessage(""), 5000);
        }
    };

    if (loading) {
        return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>;
    }

    return (
        <div className="space-y-8 max-w-2xl animate-in fade-in duration-500">
            <div className="border-b border-white/10 pb-6">
                <h2 className="text-3xl font-bold text-white tracking-tight">Estadísticas y Confianza</h2>
                <p className="text-slate-400 mt-2 text-sm">Modificá los números que se muestran en el bloque dorado de la página principal para generar confianza.</p>
            </div>

            <div className="bg-slate-900 p-8 rounded-3xl shadow-xl border border-white/10 flex flex-col space-y-6 hover:border-white/20 transition-colors">

                <div className="bg-slate-950 text-slate-300 p-4 rounded-xl text-sm border border-white/5 flex items-start gap-4 mb-2 shadow-inner">
                    <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-accent" />
                    <p className="mt-0.5 text-slate-400 leading-relaxed">
                        Estos valores alimentan el contador animado que ven las visitas debajo del mapa. Actualizalos periódicamente a medida que Bedbook crece.
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Propiedades Gestionadas</label>
                        <input
                            type="number"
                            name="properties_count"
                            value={settings.properties_count}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all text-white font-medium shadow-inner"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Huéspedes Felices Aprox.</label>
                        <input
                            type="number"
                            name="happy_guests"
                            value={settings.happy_guests}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all text-white font-medium shadow-inner"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Tasa de Retorno de Clientes (%)</label>
                        <input
                            type="number"
                            name="return_rate"
                            value={settings.return_rate}
                            onChange={handleChange}
                            max={100}
                            className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all text-white font-medium shadow-inner"
                        />
                    </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-white/10">
                    <p className="text-emerald-400 text-sm font-medium">{successMessage}</p>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-accent hover:bg-accent/90 text-white font-medium py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-70 shadow-lg shadow-accent/20"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Trash2, Check, X, MessageSquare, Plus } from "lucide-react";

interface Review {
    id: string;
    name: string;
    body: string;
    rating: number;
    is_approved: boolean;
    created_at: string;
}

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    // Novedad state
    const [isCreating, setIsCreating] = useState(false);
    const [newReview, setNewReview] = useState<{ name: string, body: string, rating: number }>({ name: "", body: "", rating: 5 });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, []);

    async function fetchReviews() {
        setLoading(true);
        const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
        if (data) setReviews(data);
        setLoading(false);
    }

    const toggleApproval = async (id: string, currentStatus: boolean) => {
        await supabase.from('reviews').update({ is_approved: !currentStatus }).eq('id', id);
        fetchReviews();
    };

    const handleDelete = async (id: string) => {
        if (confirm("¿Estás seguro de eliminar esta reseña para siempre?")) {
            await supabase.from('reviews').delete().eq('id', id);
            fetchReviews();
        }
    };

    const handleCreate = async () => {
        if (!newReview.name || !newReview.body) {
            alert("El nombre y el comentario son requeridos");
            return;
        }
        setSaving(true);
        const { error } = await supabase.from('reviews').insert([{
            name: newReview.name,
            body: newReview.body,
            rating: newReview.rating,
            is_approved: true // Por defecto aprobadas si las carga gerencia
        }]);

        setSaving(false);
        if (!error) {
            setIsCreating(false);
            setNewReview({ name: "", body: "", rating: 5 });
            fetchReviews();
        } else {
            alert("Error al guardar reseña: " + error.message);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Moderar Reseñas</h2>
                    <p className="text-slate-400 mt-2 text-sm">Ingresá manualmente los testimonios de WhatsApp y controlá su visibilidad web.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="bg-accent hover:bg-accent/90 text-white font-medium py-2.5 px-6 rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-accent/20"
                >
                    <Plus className="w-5 h-5" /> Nueva Reseña
                </button>
            </div>

            {/* Listado de Reseñas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((rev) => (
                    <div key={rev.id} className={`bg-slate-900 p-6 rounded-3xl shadow-xl border ${rev.is_approved ? 'border-white/10' : 'border-white/5 opacity-60 bg-slate-950'} flex flex-col justify-between hover:border-white/20 transition-colors`}>
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                                        {rev.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white leading-tight">{rev.name}</h3>
                                        <div className="flex text-accent text-xs mt-0.5">
                                            {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                                        </div>
                                    </div>
                                </div>
                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${rev.is_approved ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-400 border-white/5'}`}>
                                    {rev.is_approved ? 'Online' : 'Oculta'}
                                </span>
                            </div>
                            <p className="text-slate-300 text-sm italic mt-4 leading-relaxed">"{rev.body}"</p>
                        </div>

                        <div className="flex justify-between mt-6 pt-4 border-t border-white/5">
                            <button
                                onClick={() => toggleApproval(rev.id, rev.is_approved)}
                                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${rev.is_approved ? 'text-amber-400 hover:text-amber-300' : 'text-emerald-400 hover:text-emerald-300'}`}
                            >
                                {rev.is_approved ? <><X className="w-4 h-4" /> Ocultar</> : <><Check className="w-4 h-4" /> Publicar</>}
                            </button>

                            <button onClick={() => handleDelete(rev.id)} className="text-slate-500 hover:text-red-400 transition-colors p-1">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Nueva Reseña */}
            {isCreating && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                    <div className="bg-slate-900 rounded-3xl w-full max-w-lg p-6 overflow-hidden shadow-2xl border border-white/10">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2"><MessageSquare className="w-5 h-5 text-accent" /> Agregar Testimonio</h3>
                            <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-white transition-colors">✕</button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2">Nombre del Huésped</label>
                                <input type="text" value={newReview.name} onChange={(e) => setNewReview({ ...newReview, name: e.target.value })} placeholder="Ej: María José..." className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-accent text-white font-medium placeholder:text-slate-500 shadow-inner" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2">Mensaje de WhatsApp (Textual)</label>
                                <textarea rows={4} value={newReview.body} onChange={(e) => setNewReview({ ...newReview, body: e.target.value })} placeholder="Increíble fin de semana en Cafayate, super recomendado..." className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-accent text-white font-medium placeholder:text-slate-500 shadow-inner resize-none"></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2">Estrellas</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <button key={num} onClick={() => setNewReview({ ...newReview, rating: num })} className={`text-2xl transition-colors ${num <= newReview.rating ? 'text-accent drop-shadow-md' : 'text-slate-700'}`}>
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-3">
                            <button onClick={() => setIsCreating(false)} className="px-6 py-2.5 text-slate-400 font-medium hover:bg-white/5 rounded-xl transition-colors">Cancelar</button>
                            <button onClick={handleCreate} disabled={saving} className="bg-accent hover:bg-accent/90 text-white font-medium px-6 py-2.5 rounded-xl transition-colors min-w-[120px] flex justify-center shadow-lg shadow-accent/20">
                                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Publicar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Image as ImageIcon, Camera, Check } from "lucide-react";

interface SiteImage {
    id: string;
    url: string;
    title: string | null;
    description: string | null;
}

export default function GalleryPage() {
    const [images, setImages] = useState<SiteImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploadingId, setUploadingId] = useState<string | null>(null);

    // Categories mapping for UI grouping
    const categories = {
        hero: ['hero-1', 'hero-2'],
        salta: ['salta-vertical', 'salta-horizontal', 'salta-cuadrada', 'salta-imperdible-1', 'salta-imperdible-2', 'salta-imperdible-3']
    };

    useEffect(() => {
        fetchImages();
    }, []);

    async function fetchImages() {
        setLoading(true);
        const { data } = await supabase.from('site_images').select('*');
        if (data) setImages(data);
        setLoading(false);
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploadingId(id);
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${id}-${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file);

        if (!uploadError) {
            const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName);
            // Update DB
            await supabase.from('site_images').upsert({ id: id, url: urlData.publicUrl });
            fetchImages();
        } else {
            alert('Error subiendo imagen. Verifica el bucket.');
        }
        setUploadingId(null);
    };

    const handleTextChange = async (id: string, field: 'title' | 'description', value: string) => {
        // Optimistic update
        setImages(images.map(img => img.id === id ? { ...img, [field]: value } : img));
    };

    const saveText = async (id: string, img: SiteImage) => {
        await supabase.from('site_images').upsert({ id: id, title: img.title, description: img.description });
        // Mostrar mini feedback si tuvieramos state
    };

    const renderImageCard = (id: string, label: string, withText: boolean = false) => {
        const imgDef = images.find(img => img.id === id) || { id, url: '', title: '', description: '' };
        const isUploading = uploadingId === id;

        return (
            <div key={id} className="bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-white/10 flex flex-col hover:border-white/20 transition-colors">
                <div className="h-56 w-full relative bg-slate-950 group border-b border-white/10">
                    {imgDef.url ? (
                        <img src={imgDef.url} alt={label} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-700">
                            <ImageIcon className="w-12 h-12" />
                        </div>
                    )}

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4 text-center">
                        <Camera className="w-8 h-8 mb-2 text-white/80" />
                        <span className="font-medium text-sm">Cambiar Foto</span>
                        <span className="text-xs text-white/60 mt-1">Recomendado: webp o jpg</span>
                    </div>

                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, id)} disabled={isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />

                    {isUploading && (
                        <div className="absolute inset-0 z-20 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                    )}
                </div>

                <div className="p-5 flex-1 flex flex-col gap-4">
                    <h3 className="font-bold text-white flex items-center justify-between">
                        {label}
                        <span className="text-[10px] font-mono bg-slate-800 border border-white/5 text-slate-400 px-2.5 py-1 rounded-md">{id}</span>
                    </h3>

                    {withText && (
                        <div className="space-y-3">
                            <div>
                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Título</label>
                                <input type="text" value={imgDef.title || ''} onBlur={() => saveText(id, imgDef)} onChange={(e) => handleTextChange(id, 'title', e.target.value)} placeholder="Ej: Tren a las Nubes" className="w-full px-3 py-2 text-sm bg-slate-950 border border-white/10 rounded-lg outline-none focus:ring-1 focus:ring-accent focus:border-accent text-white font-medium placeholder:text-slate-600 shadow-inner" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Descripción</label>
                                <textarea rows={2} value={imgDef.description || ''} onBlur={() => saveText(id, imgDef)} onChange={(e) => handleTextChange(id, 'description', e.target.value)} placeholder="Breve texto inmersivo..." className="w-full px-3 py-2 text-sm bg-slate-950 border border-white/10 rounded-lg outline-none focus:ring-1 focus:ring-accent focus:border-accent text-white font-medium placeholder:text-slate-600 shadow-inner resize-none"></textarea>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>;

    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            <div className="border-b border-white/10 pb-6">
                <h2 className="text-3xl font-bold text-white tracking-tight">Galería Central</h2>
                <p className="text-slate-400 mt-2 text-sm">Administrá las fotografías estructurales de las secciones estáticas de Bedbook.</p>
            </div>

            {/* Grupo: Hero */}
            <section className="space-y-6">
                <div>
                    <h3 className="text-xl font-bold text-white">Cabecera Principal (Hero)</h3>
                    <p className="text-sm text-slate-400 mt-1">Fotos panorámicas que alternan al abrir la web.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {renderImageCard('hero-1', 'Foto 1 (Principal)')}
                    {renderImageCard('hero-2', 'Foto 2 (Alternativa)')}
                </div>
            </section>

            <hr className="border-white/10" />

            {/* Grupo: Salta Experience */}
            <section className="space-y-6">
                <div>
                    <h3 className="text-xl font-bold text-white">Sección Salta Experience</h3>
                    <p className="text-sm text-slate-400 mt-1">Composición visual asimétrica e "Imperdibles" del Modal.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {renderImageCard('salta-vertical', 'Foto Base (Izquierda, Alta)')}
                    {renderImageCard('salta-horizontal', 'Foto Derecha (Baja)')}
                    {renderImageCard('salta-cuadrada', 'Foto Derecha (Alta)')}
                    {renderImageCard('salta-imperdible-1', 'Imperdible #1 (Modal)', true)}
                    {renderImageCard('salta-imperdible-2', 'Imperdible #2 (Modal)', true)}
                    {renderImageCard('salta-imperdible-3', 'Imperdible #3 (Modal)', true)}
                </div>
            </section>
        </div>
    );
}

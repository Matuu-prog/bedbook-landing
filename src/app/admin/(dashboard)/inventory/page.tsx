"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Edit2, Trash2, Loader2, Image as ImageIcon, MapPin } from "lucide-react";

interface Apartment {
    id: string;
    name: string;
    description: string;
    image_url: string;
    lat: number;
    lng: number;
    is_active: boolean;
    display_order: number;
}

export default function InventoryPage() {
    const [apartments, setApartments] = useState<Apartment[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal ABM state
    const [isEditing, setIsEditing] = useState(false);
    const [currentApt, setCurrentApt] = useState<Partial<Apartment>>({});
    const [uploadingImage, setUploadingImage] = useState(false);

    useEffect(() => {
        fetchApartments();
    }, []);

    async function fetchApartments() {
        setLoading(true);
        const { data } = await supabase.from('apartments').select('*').order('display_order', { ascending: true });
        if (data) setApartments(data);
        setLoading(false);
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploadingImage(true);
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);

        if (!uploadError) {
            const { data: urlData } = supabase.storage.from('images').getPublicUrl(filePath);
            setCurrentApt({ ...currentApt, image_url: urlData.publicUrl });
        } else {
            alert('Error subiendo imagen. Verifica que el Bucket "images" sea Público.');
        }
        setUploadingImage(false);
    };

    const handleSave = async () => {
        if (!currentApt.id || !currentApt.name || !currentApt.image_url) {
            alert("El ID, Nombre e Imagen son obligatorios");
            return;
        }

        const aptData = {
            id: currentApt.id.toLowerCase().replace(/\s+/g, '-'),
            name: currentApt.name,
            description: currentApt.description || null,
            image_url: currentApt.image_url,
            lat: currentApt.lat || null,
            lng: currentApt.lng || null,
            is_active: currentApt.is_active ?? true,
            display_order: currentApt.display_order || 0
        };

        const { error } = await supabase.from('apartments').upsert(aptData);

        if (!error) {
            setIsEditing(false);
            fetchApartments();
        } else {
            alert("Error al guardar: " + error.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("¿Estás seguro de eliminar este departamento? Desaparecerá del carrusel y el mapa.")) {
            await supabase.from('apartments').delete().eq('id', id);
            fetchApartments();
        }
    };

    const openCreateModal = () => {
        setCurrentApt({ is_active: true, display_order: apartments.length + 1 });
        setIsEditing(true);
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 relative pb-12">
            <div className="flex justify-between items-end border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Inventario de Departamentos</h2>
                    <p className="text-slate-400 mt-2 text-sm">Gesti&oacute;n del Carrusel Central y el Mapa Libre.</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="bg-accent hover:bg-accent/90 text-white font-medium py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40"
                >
                    <Plus className="w-5 h-5" /> Nuevo Depto
                </button>
            </div>

            {/* Listado Grilla Bento - Dark Mode */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {apartments.map((apt) => (
                    <div key={apt.id} className={`bg-slate-900 rounded-3xl overflow-hidden shadow-xl border ${apt.is_active ? 'border-white/10' : 'border-red-900/50 opacity-70'} flex flex-col group hover:border-white/20 transition-colors`}>
                        <div className="h-56 w-full relative bg-slate-800 overflow-hidden">
                            <img src={apt.image_url} alt={apt.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                            {!apt.is_active && <div className="absolute inset-0 bg-red-900/60 flex items-center justify-center backdrop-blur-sm"><span className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-full font-bold tracking-widest uppercase border border-red-400">Inactivo</span></div>}
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-between z-10 -mt-8">
                            <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-lg">
                                <h3 className="text-xl font-bold text-white mb-1">{apt.name}</h3>
                                {apt.lat && apt.lng ? (
                                    <p className="text-xs text-slate-400 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-accent" /> {apt.lat}, {apt.lng}</p>
                                ) : (
                                    <p className="text-xs text-amber-500/90 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Sin ubicación</p>
                                )}
                            </div>
                            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-white/5">
                                <button onClick={() => { setCurrentApt(apt); setIsEditing(true); }} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors hover:bg-white/10 rounded-lg flex items-center gap-2">
                                    <Edit2 className="w-4 h-4" /> Editar
                                </button>
                                <button onClick={() => handleDelete(apt.id)} className="p-2 text-slate-500 hover:text-red-400 transition-colors hover:bg-red-500/10 rounded-lg">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal ABM - Dark Mode */}
            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-800/50">
                            <h3 className="text-xl font-bold text-white">{currentApt.id ? 'Editar Departamento' : 'Nuevo Departamento'}</h3>
                            <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors">✕</button>
                        </div>
                        <div className="p-6 overflow-y-auto space-y-6">

                            {/* Upload Image Area */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Foto Principal</label>
                                <div className="w-full flex items-center justify-center border-2 border-dashed border-slate-700 hover:border-accent/50 transition-colors rounded-2xl h-48 bg-slate-800/50 relative overflow-hidden group">
                                    {currentApt.image_url ? (
                                        <>
                                            <img src={currentApt.image_url} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                                <span className="text-white text-sm font-medium px-4 py-2 bg-white/10 rounded-lg border border-white/20">Cambiar Fotografía</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            {uploadingImage ? <Loader2 className="w-8 h-8 mb-2 animate-spin text-accent" /> : <ImageIcon className="w-8 h-8 mb-2 opacity-50" />}
                                            <span className="text-sm">Click para subir foto (JPG/WEBP)</span>
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Internal ID</label>
                                    <input type="text" value={currentApt.id || ''} onChange={(e) => setCurrentApt({ ...currentApt, id: e.target.value })} disabled={!!currentApt.name && !!currentApt.id} placeholder="ej: departamento-alfa" className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl focus:ring-1 focus:ring-accent outline-none disabled:opacity-50 text-white font-medium placeholder:text-slate-600 shadow-inner" />
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Nombre Público</label>
                                    <input type="text" value={currentApt.name || ''} onChange={(e) => {
                                        const val = e.target.value;
                                        setCurrentApt({ ...currentApt, name: val, id: currentApt.id ? currentApt.id : val })
                                    }} placeholder="ej: Alfa Suites" className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl focus:ring-1 focus:ring-accent outline-none text-white font-medium placeholder:text-slate-600 shadow-inner" />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Breve Descripción (Popup Mapa)</label>
                                    <input type="text" value={currentApt.description || ''} onChange={(e) => setCurrentApt({ ...currentApt, description: e.target.value })} placeholder="Departamento luminoso en pleno centro..." className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl focus:ring-1 focus:ring-accent outline-none text-white font-medium placeholder:text-slate-600 shadow-inner" />
                                </div>

                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Latitud (G. Maps)</label>
                                    <input type="number" step="any" value={currentApt.lat || ''} onChange={(e) => setCurrentApt({ ...currentApt, lat: parseFloat(e.target.value) })} placeholder="-24.7821" className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl focus:ring-1 focus:ring-accent outline-none text-white font-medium placeholder:text-slate-600 shadow-inner" />
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Longitud (G. Maps)</label>
                                    <input type="number" step="any" value={currentApt.lng || ''} onChange={(e) => setCurrentApt({ ...currentApt, lng: parseFloat(e.target.value) })} placeholder="-65.4232" className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl focus:ring-1 focus:ring-accent outline-none text-white font-medium placeholder:text-slate-600 shadow-inner" />
                                </div>

                                <div className="col-span-2 flex items-center justify-between mt-2 p-5 bg-slate-800/50 rounded-xl border border-white/5">
                                    <div>
                                        <p className="text-sm font-medium text-white">Estado Visible</p>
                                        <p className="text-xs text-slate-400 mt-0.5">¿Está disponible para alquilar actualmente?</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={currentApt.is_active} onChange={(e) => setCurrentApt({ ...currentApt, is_active: e.target.checked })} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-white/10 bg-slate-800/80 flex justify-end gap-3 rounded-b-3xl">
                            <button onClick={() => setIsEditing(false)} className="px-6 py-2.5 text-slate-300 font-medium hover:bg-white/10 rounded-xl transition-colors">Cancelar</button>
                            <button onClick={handleSave} disabled={uploadingImage} className="bg-accent hover:bg-accent/80 text-white font-medium px-8 py-2.5 rounded-xl transition-colors shadow-[0_0_20px_rgba(163,138,94,0.3)] disabled:opacity-50">Guardar Depto</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

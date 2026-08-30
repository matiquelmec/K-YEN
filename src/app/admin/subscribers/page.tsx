'use client';

import { useEffect, useState } from 'react';
import { Mail, Calendar, Search } from 'lucide-react';

export default function SubscribersPage() {
    const [subscribers, setSubscribers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const fetchSubscribers = async () => {
        try {
            const res = await fetch('/api/subscribers');
            if (!res.ok) throw new Error('Error al cargar suscriptores');
            const data = await res.json();
            setSubscribers(data || []);
        } catch (error) {
            console.error('Error fetching subscribers:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredSubscribers = subscribers.filter(sub =>
        sub.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-4 border-earth-200 border-t-earth-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-stone-500 block mb-1">
                    CASA AIRA • COMUNIDAD
                </span>
                <h1
                    className="font-serif text-3xl md:text-4xl font-normal text-[#181716] tracking-tight"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                    Club Casa Aira • Suscriptoras
                </h1>
                <p className="text-stone-500 font-light text-sm mt-1">
                    Clientas registradas para recibir avisos de prelanzamiento y curaduría exclusiva.
                </p>
            </div>

            <div className="bg-white border border-stone-200/80 shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="p-5 border-b border-stone-100 flex gap-4 bg-stone-50/50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
                        <input
                            type="text"
                            name="search"
                            autoComplete="off"
                            placeholder="Buscar por email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 text-xs text-stone-900 tracking-wide placeholder:text-stone-400 focus:outline-none focus:border-calypso-600 transition-colors"
                        />
                    </div>
                </div>

                {/* Table */}
                {filteredSubscribers.length === 0 ? (
                    <div className="p-16 text-center text-stone-400 font-light text-xs">
                        {searchTerm ? 'No se encontraron suscriptoras coincidentes.' : 'Aún no hay suscriptoras registradas.'}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-stone-50 text-stone-500 text-[10px] font-semibold uppercase tracking-[0.25em] border-b border-stone-100">
                                <tr>
                                    <th className="px-6 py-3.5">Email de la Clienta</th>
                                    <th className="px-6 py-3.5">Fecha de Ingreso</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {filteredSubscribers.map((sub, idx) => (
                                    <tr key={sub.email || idx} className="hover:bg-stone-50/60 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2.5 text-[#181716] font-medium">
                                                <Mail className="w-3.5 h-3.5 text-calypso-600" />
                                                <span>{sub.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-stone-500 font-light flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5 text-stone-400" />
                                            <span>
                                                {new Date(sub.created_at).toLocaleDateString('es-CL', {
                                                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

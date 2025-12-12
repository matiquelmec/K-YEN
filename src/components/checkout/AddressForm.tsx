'use client';

import { useState, useEffect } from 'react';
import { regionesYComunas } from '@/lib/chile-data';

interface AddressFormProps {
    onSubmit: (data: any) => void;
}

export default function AddressForm({ onSubmit }: AddressFormProps) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        region: '',
        commune: '',
        address: '',
        number: '',
        dept: '',
    });

    const [availableCommunes, setAvailableCommunes] = useState<string[]>([]);

    useEffect(() => {
        if (formData.region) {
            const regionData = regionesYComunas.find((r) => r.region === formData.region);
            setAvailableCommunes(regionData ? regionData.comunas : []);
            setFormData((prev) => ({ ...prev, commune: '' })); // Reset commune on region change
        } else {
            setAvailableCommunes([]);
        }
    }, [formData.region]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-display font-bold text-earth-900 mb-4">Datos de Contacto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sensual-500 focus:border-transparent outline-none transition-all"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                        <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sensual-500 focus:border-transparent outline-none transition-all"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sensual-500 focus:border-transparent outline-none transition-all"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                        <input
                            type="tel"
                            name="phone"
                            id="phone"
                            placeholder="+56 9 ..."
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sensual-500 focus:border-transparent outline-none transition-all"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-display font-bold text-earth-900 mb-4">Dirección de Envío</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">Región</label>
                        <select
                            name="region"
                            id="region"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sensual-500 focus:border-transparent outline-none transition-all"
                            value={formData.region}
                            onChange={handleChange}
                        >
                            <option value="">Selecciona una región</option>
                            {regionesYComunas.map((r) => (
                                <option key={r.region} value={r.region}>{r.region}</option>
                            ))}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="commune" className="block text-sm font-medium text-gray-700 mb-1">Comuna</label>
                        <select
                            name="commune"
                            id="commune"
                            required
                            disabled={!formData.region}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sensual-500 focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400"
                            value={formData.commune}
                            onChange={handleChange}
                        >
                            <option value="">Selecciona una comuna</option>
                            {availableCommunes.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Calle</label>
                        <input
                            type="text"
                            name="address"
                            id="address"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sensual-500 focus:border-transparent outline-none transition-all"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                        <input
                            type="text"
                            name="number"
                            id="number"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sensual-500 focus:border-transparent outline-none transition-all"
                            value={formData.number}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="dept" className="block text-sm font-medium text-gray-700 mb-1">Depto / Casa (Opcional)</label>
                        <input
                            type="text"
                            name="dept"
                            id="dept"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sensual-500 focus:border-transparent outline-none transition-all"
                            value={formData.dept}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>

            {/* Hidden submit button to be triggered from parent if needed, or we just rely on parent's button */}
        </form>
    );
}

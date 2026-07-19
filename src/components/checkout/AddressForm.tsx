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

    const inputClasses = "w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-bone-100 placeholder-bone-500 focus:border-sensual-500 outline-none transition-all duration-300";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
                <h3 className="text-xl font-display font-bold text-bone-100 mb-4">Datos de Contacto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-bone-300 mb-1">Nombre</label>
                        <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            required
                            className={inputClasses}
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-bone-300 mb-1">Apellido</label>
                        <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            required
                            className={inputClasses}
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="email" className="block text-sm font-medium text-bone-300 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            required
                            className={inputClasses}
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="phone" className="block text-sm font-medium text-bone-300 mb-1">Teléfono</label>
                        <input
                            type="tel"
                            name="phone"
                            id="phone"
                            placeholder="+56 9 ..."
                            required
                            className={inputClasses}
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
                <h3 className="text-xl font-display font-bold text-bone-100 mb-4">Dirección de Despacho</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="region" className="block text-sm font-medium text-bone-300 mb-1">Región</label>
                        <select
                            name="region"
                            id="region"
                            required
                            className={inputClasses}
                            value={formData.region}
                            onChange={handleChange}
                        >
                            <option value="" disabled className="bg-earth-950">Selecciona Región</option>
                            {regionesYComunas.map((reg) => (
                                <option key={reg.region} value={reg.region} className="bg-earth-950">
                                    {reg.region}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="commune" className="block text-sm font-medium text-bone-300 mb-1">Comuna</label>
                        <select
                            name="commune"
                            id="commune"
                            required
                            disabled={!formData.region}
                            className={`${inputClasses} disabled:opacity-50`}
                            value={formData.commune}
                            onChange={handleChange}
                        >
                            <option value="" disabled className="bg-earth-950">Selecciona Comuna</option>
                            {availableCommunes.map((com) => (
                                <option key={com} value={com} className="bg-earth-950">
                                    {com}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-bone-300 mb-1">Calle / Avenida</label>
                        <input
                            type="text"
                            name="address"
                            id="address"
                            placeholder="Ej: Av. Presidente Ibáñez"
                            required
                            className={inputClasses}
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="number" className="block text-sm font-medium text-bone-300 mb-1">Número</label>
                        <input
                            type="text"
                            name="number"
                            id="number"
                            placeholder="Ej: 1420"
                            required
                            className={inputClasses}
                            value={formData.number}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="dept" className="block text-sm font-medium text-bone-300 mb-1">Dpto / Oficina (Opcional)</label>
                        <input
                            type="text"
                            name="dept"
                            id="dept"
                            placeholder="Ej: Depto 402"
                            className={inputClasses}
                            value={formData.dept}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>
        </form>
    );
}

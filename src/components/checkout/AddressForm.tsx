'use client';

import { useState, useEffect } from 'react';
import { regionesYComunas } from '@/lib/chile-data';
import { User, MapPin } from 'lucide-react';

interface AddressFormProps {
    onSubmit: (_data: any) => void;
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

    const inputClasses = "w-full bg-[#FAF8F5] border border-stone-300 px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition-all text-sm font-light";

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. Datos de Contacto */}
            <div className="bg-white p-6 sm:p-8 border border-stone-200 shadow-sm">
                <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-stone-100">
                    <User className="w-5 h-5 text-calypso-700 stroke-[1.5]" />
                    <h3
                        className="text-lg sm:text-xl font-serif text-[#181716] font-normal"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                        1. Datos de Contacto
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label htmlFor="firstName" className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">
                            Nombre *
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            autoComplete="given-name"
                            required
                            placeholder="Tu nombre"
                            className={inputClasses}
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">
                            Apellido *
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            autoComplete="family-name"
                            required
                            placeholder="Tu apellido"
                            className={inputClasses}
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="email" className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">
                            Correo Electrónico (para confirmación y boleta) *
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            autoComplete="email"
                            required
                            placeholder="ejemplo@correo.com"
                            className={inputClasses}
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="phone" className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">
                            Teléfono / WhatsApp (para seguimiento de Starken/Chilexpress) *
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            id="phone"
                            autoComplete="tel"
                            placeholder="+56 9 1234 5678"
                            required
                            className={inputClasses}
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>

            {/* 2. Dirección de Despacho */}
            <div className="bg-white p-6 sm:p-8 border border-stone-200 shadow-sm">
                <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-stone-100">
                    <MapPin className="w-5 h-5 text-calypso-700 stroke-[1.5]" />
                    <h3
                        className="text-lg sm:text-xl font-serif text-[#181716] font-normal"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                        2. Dirección de Despacho
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label htmlFor="region" className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">
                            Región *
                        </label>
                        <select
                            name="region"
                            id="region"
                            autoComplete="address-level1"
                            required
                            className={inputClasses}
                            value={formData.region}
                            onChange={handleChange}
                        >
                            <option value="" disabled className="text-stone-400">Selecciona Región</option>
                            {regionesYComunas.map((reg) => (
                                <option key={reg.region} value={reg.region} className="text-stone-900 bg-white">
                                    {reg.region}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="commune" className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">
                            Comuna *
                        </label>
                        <select
                            name="commune"
                            id="commune"
                            autoComplete="address-level2"
                            required
                            disabled={!formData.region}
                            className={`${inputClasses} disabled:opacity-50 disabled:cursor-not-allowed`}
                            value={formData.commune}
                            onChange={handleChange}
                        >
                            <option value="" disabled className="text-stone-400">
                                {formData.region ? 'Selecciona Comuna' : 'Primero selecciona una región'}
                            </option>
                            {availableCommunes.map((com) => (
                                <option key={com} value={com} className="text-stone-900 bg-white">
                                    {com}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="address" className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">
                            Calle / Avenida / Pasaje *
                        </label>
                        <input
                            type="text"
                            name="address"
                            id="address"
                            autoComplete="street-address"
                            placeholder="Ej: Av. Las Condes / Los Alerces"
                            required
                            className={inputClasses}
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="number" className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">
                            Número de Casa / Edificio *
                        </label>
                        <input
                            type="text"
                            name="number"
                            id="number"
                            autoComplete="address-line2"
                            placeholder="Ej: 1420"
                            required
                            className={inputClasses}
                            value={formData.number}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="dept" className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1.5">
                            Dpto / Oficina / Torre (Opcional)
                        </label>
                        <input
                            type="text"
                            name="dept"
                            id="dept"
                            autoComplete="address-line3"
                            placeholder="Ej: Depto 402, Torre B"
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

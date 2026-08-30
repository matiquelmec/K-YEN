'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import CasaAiraLogo from '@/components/ui/CasaAiraLogo';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Credenciales no válidas');
            }

            router.push('/admin/products');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#141312] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Velo de luz orgánico */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-calypso-900/30 via-gold-900/20 to-transparent rounded-full blur-3xl pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white p-8 sm:p-12 max-w-md w-full relative z-10 shadow-2xl border border-stone-200"
            >
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-6">
                        <CasaAiraLogo variant="icon" size="lg" animated={true} />
                    </div>
                    <span className="text-[10px] tracking-[0.35em] uppercase font-semibold text-stone-500 block mb-2">
                        GESTIÓN & CURADURÍA
                    </span>
                    <h1
                        className="font-serif text-3xl text-[#181716] font-normal"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                        Casa Aira Boutique
                    </h1>
                    <p className="text-stone-500 text-xs font-light mt-1">
                        Acceso exclusivo para administración
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-stone-700 mb-2">
                            Correo Electrónico
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
                            <input
                                type="email"
                                name="email"
                                id="email"
                                autoComplete="username"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 text-xs text-stone-900 tracking-wide placeholder:text-stone-400 focus:outline-none focus:border-calypso-600 transition-colors"
                                placeholder="admin@casaaira.cl"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-stone-700 mb-2">
                            Contraseña
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
                            <input
                                type="password"
                                name="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 text-xs text-stone-900 tracking-wide placeholder:text-stone-400 focus:outline-none focus:border-calypso-600 transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center font-medium">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-[#181716] text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-calypso-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4 shadow-sm"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Accediendo...</span>
                            </>
                        ) : (
                            <>
                                <span>Ingresar al Panel</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-stone-100 text-center">
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest font-light">
                        Casa Aira Boutique • Panel Seguro
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

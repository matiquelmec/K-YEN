'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import { ShieldCheck, FileText, RefreshCw, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type TabType = 'privacidad' | 'terminos' | 'devoluciones';

function PoliticasContent() {
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<TabType>('privacidad');

    useEffect(() => {
        const tab = searchParams.get('tab') as TabType;
        if (tab === 'privacidad' || tab === 'terminos' || tab === 'devoluciones') {
            setActiveTab(tab);
        }
    }, [searchParams]);

    const tabs = [
        { id: 'privacidad' as TabType, label: 'Política de Privacidad', icon: ShieldCheck },
        { id: 'terminos' as TabType, label: 'Términos y Condiciones', icon: FileText },
        { id: 'devoluciones' as TabType, label: 'Cambios y Devoluciones', icon: RefreshCw },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-earth-900 via-earth-800 to-gothic-900 text-bone-100 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
            <Header />
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-bone-100">Información Legal</h1>
                    <p className="text-terra-400 font-cursive text-lg mt-2">Transparencia y políticas de nuestra boutique KÜYEN</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Navigation Sidebar */}
                    <div className="md:col-span-1 flex flex-col gap-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center justify-between p-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                                        isActive
                                            ? 'bg-gradient-to-r from-sensual-600 to-sensual-700 text-white shadow-lg shadow-sensual-600/10'
                                            : 'bg-white/5 hover:bg-white/10 text-bone-300 hover:text-white border border-white/5'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Icon className="w-4 h-4 flex-shrink-0" />
                                        <span className="text-left leading-tight">{tab.label}</span>
                                    </div>
                                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'rotate-90' : 'opacity-50'}`} />
                                </button>
                            );
                        })}
                    </div>

                    {/* Content Area */}
                    <div className="md:col-span-3 bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-xl space-y-6">
                        <AnimatePresence mode="wait">
                            {activeTab === 'privacidad' && (
                                <motion.div
                                    key="privacidad"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-4"
                                >
                                    <h2 className="text-2xl font-display font-bold text-bone-100 flex items-center gap-2 border-b border-white/10 pb-3">
                                        <ShieldCheck className="text-terra-400" />
                                        Política de Privacidad
                                    </h2>
                                    <p className="text-sm text-bone-300 leading-relaxed">
                                        En **KÜYEN** nos tomamos muy en serio la seguridad y privacidad de tus datos personales. De acuerdo con la legislación vigente en Chile (Ley Nº 19.628 sobre protección de la vida privada), te informamos sobre el tratamiento de tus datos:
                                    </p>
                                    <h3 className="text-base font-semibold text-bone-200 mt-4">1. Recolección de Información</h3>
                                    <p className="text-sm text-bone-300 leading-relaxed">
                                        Recopilamos información personal necesaria para procesar tus compras (como tu nombre, RUT, correo electrónico, número telefónico, dirección de envío y facturación). En ningún caso almacenamos detalles bancarios ni números de tarjetas de crédito.
                                    </p>
                                    <h3 className="text-base font-semibold text-bone-200 mt-4">2. Uso de los Datos</h3>
                                    <p className="text-sm text-bone-300 leading-relaxed">
                                        Tus datos serán utilizados única y exclusivamente para:
                                    </p>
                                    <ul className="list-disc pl-5 text-sm text-bone-300 space-y-2">
                                        <li>Procesar tus transacciones e iniciar el envío a domicilio.</li>
                                        <li>Enviarte actualizaciones del estado de tu pedido.</li>
                                        <li>Suscripciones voluntarias a nuestro boletín de novedades y colecciones exclusivas.</li>
                                    </ul>
                                    <h3 className="text-base font-semibold text-bone-200 mt-4">3. Compartir con Terceros</h3>
                                    <p className="text-sm text-bone-300 leading-relaxed">
                                        No vendemos, alquilamos ni divulgamos tu información personal a terceros. Compartimos únicamente la información indispensable de dirección y contacto con las empresas de logística asociadas (Starken y Chilexpress) para garantizar la entrega de tu pedido.
                                    </p>
                                </motion.div>
                            )}

                            {activeTab === 'terminos' && (
                                <motion.div
                                    key="terminos"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-4"
                                >
                                    <h2 className="text-2xl font-display font-bold text-bone-100 flex items-center gap-2 border-b border-white/10 pb-3">
                                        <FileText className="text-terra-400" />
                                        Términos y Condiciones
                                    </h2>
                                    <p className="text-sm text-bone-300 leading-relaxed">
                                        Bienvenida a **KÜYEN**. Al utilizar nuestro sitio web, aceptas cumplir y estar sujeta a los siguientes términos y condiciones de uso:
                                    </p>
                                    <h3 className="text-base font-semibold text-bone-200 mt-4">1. Propiedad Intelectual</h3>
                                    <p className="text-sm text-bone-300 leading-relaxed">
                                        Todo el contenido que ves en este sitio web (incluidos textos, imágenes, fotografías de vestidos, logotipos y diseños) es propiedad exclusiva de KÜYEN o se utiliza con las licencias correspondientes. Queda prohibida la reproducción parcial o total sin autorización previa por escrito.
                                    </p>
                                    <h3 className="text-base font-semibold text-bone-200 mt-4">2. Stock e Información de Productos</h3>
                                    <p className="text-sm text-bone-300 leading-relaxed">
                                        Nos esforzamos por mantener nuestro inventario actualizado. Sin embargo, en ocasiones el stock real de vestidos o accesorios podría presentar discrepancias mínimos. En caso de no contar con el stock de una orden pagada, te contactaremos de inmediato para ofrecerte un cambio o el reembolso íntegro.
                                    </p>
                                    <h3 className="text-base font-semibold text-bone-200 mt-4">3. Métodos de Envío</h3>
                                    <p className="text-sm text-bone-300 leading-relaxed">
                                        Los despachos son enviados a través de Starken o Chilexpress bajo la modalidad de Envío &quot;Por Pagar&quot;, donde el cliente debe abonar el costo del envío al momento de retirar en sucursal o recibir en su domicilio. Los plazos de entrega estimados comienzan a regir desde que el paquete es entregado al transporte.
                                    </p>
                                </motion.div>
                            )}

                            {activeTab === 'devoluciones' && (
                                <motion.div
                                    key="devoluciones"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-4"
                                >
                                    <h2 className="text-2xl font-display font-bold text-bone-100 flex items-center gap-2 border-b border-white/10 pb-3">
                                        <RefreshCw className="text-terra-400" />
                                        Cambios y Devoluciones
                                    </h2>
                                    <p className="text-sm text-bone-300 leading-relaxed">
                                        En **KÜYEN** queremos que te sientas completamente satisfecha y empoderada con tu vestido. Si necesitas realizar un cambio o devolución, te ofrecemos las siguientes facilidades:
                                    </p>
                                    <h3 className="text-base font-semibold text-bone-200 mt-4">1. Plazos</h3>
                                    <p className="text-sm text-bone-300 leading-relaxed">
                                        Tienes un plazo de **30 días de corrido** a contar de la fecha de entrega del producto para realizar cambios de talla, color o modelo. Para devoluciones de dinero por insatisfacción, el plazo es de **10 días**.
                                    </p>
                                    <h3 className="text-base font-semibold text-bone-200 mt-4">2. Condiciones del Producto</h3>
                                    <p className="text-sm text-bone-300 leading-relaxed">
                                        Para que podamos procesar el cambio o devolución, el artículo debe cumplir las siguientes condiciones:
                                    </p>
                                    <ul className="list-disc pl-5 text-sm text-bone-300 space-y-2">
                                        <li>Estar en perfectas condiciones, limpio, sin uso, perfume ni alteraciones de costura.</li>
                                        <li>Mantener sus etiquetas originales puestas.</li>
                                    </ul>
                                    <h3 className="text-base font-semibold text-bone-200 mt-4">3. Proceso y Costos de Envío</h3>
                                    <p className="text-sm text-bone-300 leading-relaxed">
                                        Los envíos asociados a cambios o devoluciones son de cargo del cliente, a menos que el cambio se deba a una falla de confección o error de despacho por nuestra parte. Escríbenos a nuestro contacto oficial para guiarte en el proceso.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PoliticasPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-earth-900 flex items-center justify-center">
                <div className="animate-pulse text-earth-200">Cargando...</div>
            </div>
        }>
            <PoliticasContent />
        </Suspense>
    );
}

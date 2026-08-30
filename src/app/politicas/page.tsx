'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
        <div className="min-h-screen bg-[#FAF8F5] text-[#181716] pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <Header />
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-stone-500 block mb-2">
                        TRANSPARENCIA & COMPROMISO
                    </span>
                    <h1
                        className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#181716] font-normal"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                        Políticas y Términos
                    </h1>
                    <p className="text-stone-600 font-light text-sm sm:text-base mt-2">
                        Información clara sobre compras, despachos y garantías en Casa Aira
                    </p>
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
                                    className={`flex items-center justify-between p-3.5 border transition-all duration-300 text-xs uppercase tracking-wider font-medium ${
                                        isActive
                                            ? 'bg-[#181716] text-white border-[#181716] shadow-sm'
                                            : 'bg-white hover:bg-stone-50 text-stone-700 hover:text-[#181716] border-stone-200'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-calypso-300' : 'text-stone-500'}`} />
                                        <span className="text-left leading-tight">{tab.label}</span>
                                    </div>
                                    <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-300 ${isActive ? 'rotate-90 text-white' : 'opacity-40'}`} />
                                </button>
                            );
                        })}
                    </div>

                    {/* Content Area */}
                    <div className="md:col-span-3 bg-white p-8 sm:p-10 border border-stone-200 shadow-sm space-y-6">
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
                                    <h2
                                        className="text-xl sm:text-2xl font-serif text-[#181716] flex items-center gap-2 border-b border-stone-200 pb-3 font-normal"
                                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                                    >
                                        <ShieldCheck className="text-calypso-700 w-5 h-5" />
                                        Política de Privacidad
                                    </h2>
                                    <p className="text-sm text-stone-600 leading-relaxed font-light">
                                        En **Casa Aira** cuidamos y respetamos tu información personal. En cumplimiento con la legislación chilena (Ley Nº 19.628 sobre protección de la vida privada), te explicamos de forma transparente cómo tratamos tus datos:
                                    </p>
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-900 mt-5">1. Recolección de Información</h3>
                                    <p className="text-sm text-stone-600 leading-relaxed font-light">
                                        Recopilamos únicamente los datos indispensables para procesar tu pedido (nombre, RUT, correo, teléfono y dirección de envío). Por tu seguridad, los pagos con tarjeta se procesan en pasarelas cifradas externas y nunca guardamos datos bancarios.
                                    </p>
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-900 mt-5">2. Uso de tus Datos</h3>
                                    <p className="text-sm text-stone-600 leading-relaxed font-light">
                                        Utilizamos tu información exclusivamente para:
                                    </p>
                                    <ul className="list-disc pl-5 text-sm text-stone-600 space-y-1.5 font-light">
                                        <li>Procesar tu compra y coordinar el despacho a tu domicilio o sucursal.</li>
                                        <li>Enviarte el número de seguimiento de Starken o Chilexpress por WhatsApp o email.</li>
                                        <li>Informarte de nuevas llegadas o promociones del Club Casa Aira si te has suscrito.</li>
                                    </ul>
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-900 mt-5">3. Envíos y Terceros</h3>
                                    <p className="text-sm text-stone-600 leading-relaxed font-light">
                                        No vendemos ni compartimos tus datos con terceros para publicidad. Solo entregamos los datos de entrega indispensables al servicio de mensajería para que tu paquete llegue a destino sin problemas.
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
                                    <h2
                                        className="text-xl sm:text-2xl font-serif text-[#181716] flex items-center gap-2 border-b border-stone-200 pb-3 font-normal"
                                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                                    >
                                        <FileText className="text-calypso-700 w-5 h-5" />
                                        Términos y Condiciones
                                    </h2>
                                    <p className="text-sm text-stone-600 leading-relaxed font-light">
                                        Bienvenida a **Casa Aira Boutique**. Al comprar en nuestra tienda en línea, aceptas las siguientes condiciones sencillas:
                                    </p>
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-900 mt-5">1. Disponibilidad y Stock</h3>
                                    <p className="text-sm text-stone-600 leading-relaxed font-light">
                                        Mantenemos un stock seleccionado con pocas unidades por diseño. En el caso improbable de que una prenda quede sin stock simultáneo, nos comunicaremos contigo de inmediato por WhatsApp para ofrecerte una alternativa de tu agrado o la devolución total de tu dinero.
                                    </p>
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-900 mt-5">2. Despachos y Plazos</h3>
                                    <p className="text-sm text-stone-600 leading-relaxed font-light">
                                        Los envíos se realizan a todo Chile a través de Starken o Chilexpress. Te proporcionamos tu comprobante de seguimiento para que puedas monitorear el paquete hasta que lo recibas.
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
                                    <h2
                                        className="text-xl sm:text-2xl font-serif text-[#181716] flex items-center gap-2 border-b border-stone-200 pb-3 font-normal"
                                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                                    >
                                        <RefreshCw className="text-calypso-700 w-5 h-5" />
                                        Cambios y Devoluciones
                                    </h2>
                                    <p className="text-sm text-stone-600 leading-relaxed font-light">
                                        Queremos que ames cómo te queda tu vestido. Si necesitas cambiar la talla, el color o el modelo, te damos todas las facilidades:
                                    </p>
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-900 mt-5">1. Plazos para Cambios</h3>
                                    <p className="text-sm text-stone-600 leading-relaxed font-light">
                                        Tienes un plazo de **30 días corridos** desde que recibes el pedido para solicitar un cambio de talla o modelo. Para devoluciones de dinero por insatisfacción, el plazo es de **10 días**.
                                    </p>
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-900 mt-5">2. Estado de la Prenda</h3>
                                    <p className="text-sm text-stone-600 leading-relaxed font-light">
                                        La prenda debe estar sin uso, con sus etiquetas puestas y en perfectas condiciones higiénicas.
                                    </p>
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-900 mt-5">3. ¿Cómo Solicitarlo?</h3>
                                    <p className="text-sm text-stone-600 leading-relaxed font-light">
                                        Solo escríbenos a nuestro WhatsApp oficial con tu número de pedido y te guiaremos paso a paso de forma rápida y personalizada.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            <div className="mt-20">
                <Footer />
            </div>
        </div>
    );
}

export default function PoliticasPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
                <div className="animate-pulse text-stone-400 font-serif text-lg">Cargando Casa Aira...</div>
            </div>
        }>
            <PoliticasContent />
        </Suspense>
    );
}


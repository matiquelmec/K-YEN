'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    LogOut,
    Menu,
    X,
    Package,
    Tag,
    Bell,
    ExternalLink
} from 'lucide-react';
import CasaAiraLogo from '@/components/ui/CasaAiraLogo';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    // Skip layout for login page
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
            });
        } catch (error) {
            console.error('Error logging out:', error);
        } finally {
            router.push('/admin/login');
            router.refresh();
        }
    };

    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Catálogo & Vestidos', href: '/admin/products', icon: Package },
        { name: 'Pedidos Boutique', href: '/admin/orders', icon: ShoppingBag },
        { name: 'Cupones & Cortesías', href: '/admin/coupons', icon: Tag },
        { name: 'Club Casa Aira', href: '/admin/subscribers', icon: Users },
    ];

    return (
        <div className="min-h-screen bg-[#FAF8F5] flex font-sans selection:bg-calypso-100 selection:text-calypso-900">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-[#141312]/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 w-72 bg-[#141312] text-[#FAF8F5] border-r border-stone-800/80 transform transition-all duration-500 ease-in-out z-50 shadow-2xl lg:shadow-none ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                <div className="p-8 flex flex-col h-full">
                    {/* Logo */}
                    <div className="mb-10 flex items-center justify-between pb-6 border-b border-stone-800/60">
                        <Link href="/admin" className="hover:opacity-90 transition-opacity">
                            <CasaAiraLogo variant="full" size="md" theme="dark" />
                        </Link>
                        <button
                            className="lg:hidden p-2 text-stone-400 hover:text-white transition-colors"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2">
                        <div className="text-[10px] font-semibold text-stone-500 uppercase tracking-[0.3em] mb-4 px-4">
                            GESTIÓN & CURADURÍA
                        </div>
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`group flex items-center gap-3.5 px-4 py-3 rounded-none border-l-2 transition-all duration-300 text-xs tracking-wider uppercase font-medium ${
                                        isActive
                                            ? 'bg-stone-800/70 text-white border-calypso-400 shadow-sm translate-x-1'
                                            : 'text-stone-400 hover:text-white hover:bg-stone-900/60 border-transparent'
                                    }`}
                                >
                                    <item.icon className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${
                                        isActive ? 'text-calypso-400' : 'text-stone-500'
                                    }`} />
                                    <span>{item.name}</span>
                                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer Actions */}
                    <div className="pt-6 border-t border-stone-800/60 space-y-2">
                        <Link
                            href="/"
                            target="_blank"
                            className="flex items-center gap-3 px-4 py-2.5 text-stone-400 hover:text-white hover:bg-stone-900/60 transition-all text-xs tracking-wider uppercase font-medium group"
                        >
                            <ExternalLink className="w-4 h-4 text-stone-500 group-hover:rotate-12 transition-transform" />
                            Ver Tienda Online
                        </Link>

                        <button
                            onClick={() => setShowLogoutConfirm(true)}
                            className="flex items-center gap-3 px-4 py-2.5 w-full text-rose-400/80 hover:bg-rose-950/20 hover:text-rose-300 transition-all text-xs tracking-wider uppercase font-medium group"
                        >
                            <LogOut className="w-4 h-4 text-rose-400/60 group-hover:-translate-x-1 transition-transform" />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Desktop Header */}
                <header className="hidden lg:flex h-20 items-center justify-end px-10 gap-6 bg-white/70 backdrop-blur-md border-b border-stone-200/80 sticky top-0 z-30">
                    <button className="p-2 text-stone-400 hover:text-stone-800 transition-colors relative" title="Notificaciones">
                        <Bell className="w-4 h-4" />
                        <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-gold-500 rounded-full" />
                    </button>
                    <div className="w-px h-6 bg-stone-200" />
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-xs font-semibold text-[#181716] tracking-tight">Casa Aira Boutique</p>
                            <p className="text-[9px] font-medium text-stone-400 uppercase tracking-widest">Panel de Administración</p>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-calypso-50 border border-calypso-200/60 flex items-center justify-center text-calypso-700 font-serif font-semibold text-xs shadow-sm">
                            CA
                        </div>
                    </div>
                </header>

                {/* Mobile Header */}
                <header className="lg:hidden bg-white/90 backdrop-blur-md border-b border-stone-200/80 p-4 flex items-center justify-between sticky top-0 z-30">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 text-stone-700 hover:bg-stone-100 transition-all"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="scale-90">
                        <CasaAiraLogo variant="full" size="sm" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-calypso-50 border border-calypso-200/60 flex items-center justify-center text-calypso-700 font-serif font-semibold text-xs">
                        CA
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-6 md:p-10 lg:p-12 relative">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>

                {/* Subtle Background Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-calypso-100/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-100/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
            </main>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-[#141312]/60 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)} />
                    <div className="bg-white p-8 sm:p-10 max-w-sm w-full relative shadow-2xl border border-stone-200 text-center animate-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-5 border border-rose-100">
                            <LogOut className="w-7 h-7" />
                        </div>
                        <h3
                            className="text-2xl font-serif text-[#181716] font-normal mb-2"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                        >
                            ¿Cerrar Sesión?
                        </h3>
                        <p className="text-stone-500 text-xs font-light mb-8 leading-relaxed">
                            ¿Estás segura de que deseas salir del panel de administración de Casa Aira?
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleLogout}
                                className="w-full py-3.5 bg-[#181716] text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-rose-700 transition-colors"
                            >
                                Sí, cerrar sesión
                            </button>
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="w-full py-3 bg-stone-100 text-stone-700 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-stone-200 transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

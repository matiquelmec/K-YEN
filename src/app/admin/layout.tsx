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

    Bell,
    ExternalLink
} from 'lucide-react';
import KuyenLogo from '@/components/ui/KuyenLogo';

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
        { name: 'Catálogo', href: '/admin/products', icon: Package },
        { name: 'Pedidos', href: '/admin/orders', icon: ShoppingBag },
        { name: 'Comunidad', href: '/admin/subscribers', icon: Users },

    ];

    return (
        <div className="min-h-screen bg-[#fcfcfb] flex font-sans selection:bg-earth-100 selection:text-earth-900">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-earth-950/40 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 w-72 bg-earth-950 text-white transform transition-all duration-500 ease-in-out z-50 shadow-2xl lg:shadow-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                <div className="p-8 flex flex-col h-full">
                    {/* Logo */}
                    <div className="mb-12 flex items-center justify-between">
                        <Link href="/" className="hover:opacity-80 transition-opacity">
                            <div className="scale-90 origin-left">
                                <KuyenLogo variant="full" />
                            </div>
                        </Link>
                        <button
                            className="lg:hidden p-2 text-earth-400 hover:text-white transition-colors"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2">
                        <div className="text-[10px] font-bold text-earth-500 uppercase tracking-[0.2em] mb-4 px-4">Administración</div>
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${isActive
                                        ? 'bg-earth-800 text-white shadow-lg shadow-earth-900/40 translate-x-1'
                                        : 'text-earth-400 hover:text-earth-100 hover:bg-white/5'
                                        }`}
                                >
                                    <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-earth-500'}`} />
                                    <span className="font-bold text-sm tracking-tight">{item.name}</span>
                                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer Actions */}
                    <div className="pt-8 border-t border-white/5 space-y-2">
                        <Link
                            href="/"
                            target="_blank"
                            className="flex items-center gap-4 px-4 py-3 text-earth-400 hover:text-earth-100 hover:bg-white/5 rounded-2xl transition-all text-sm font-bold group"
                        >
                            <ExternalLink className="w-5 h-5 text-earth-500 group-hover:rotate-12 transition-transform" />
                            Ver Tienda
                        </Link>

                        <button
                            onClick={() => setShowLogoutConfirm(true)}
                            className="flex items-center gap-4 px-4 py-3 w-full rounded-2xl text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-all text-sm font-bold group"
                        >
                            <LogOut className="w-5 h-5 text-red-500/50 group-hover:-translate-x-1 transition-transform" />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Desktop Header */}
                <header className="hidden lg:flex h-20 items-center justify-end px-10 gap-6 bg-white/50 backdrop-blur-md border-b border-earth-100/50 sticky top-0 z-30">
                    <button className="p-2 text-earth-400 hover:text-earth-800 transition-colors relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full border-2 border-white" />
                    </button>
                    <div className="w-px h-6 bg-earth-200" />
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-xs font-bold text-gray-900 tracking-tight">KÜYEN Admin</p>
                            <p className="text-[10px] font-bold text-earth-500 uppercase tracking-widest">Editora principal</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-earth-100 border border-earth-200 flex items-center justify-center text-earth-700 font-bold overflow-hidden shadow-inner">
                            K
                        </div>
                    </div>
                </header>

                {/* Mobile Header */}
                <header className="lg:hidden bg-white/80 backdrop-blur-md border-b border-gray-100 p-5 flex items-center justify-between sticky top-0 z-30">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 text-earth-600 hover:bg-earth-50 rounded-xl transition-all"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="scale-75">
                        <KuyenLogo variant="full" />
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-earth-50 flex items-center justify-center text-earth-700 font-bold text-xs">
                        K
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-6 md:p-10 lg:p-12 relative">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>

                {/* Subtle Background Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-earth-100/30 rounded-full blur-[120px] -z-10 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-50/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
            </main>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-earth-950/60 backdrop-blur-md" onClick={() => setShowLogoutConfirm(false)} />
                    <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full relative shadow-2xl border border-earth-100 text-center animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <LogOut className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">¿Cerrar Sesión?</h3>
                        <p className="text-gray-500 font-medium mb-10 leading-relaxed">¿Estás segura de que deseas salir del panel de administración?</p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleLogout}
                                className="w-full py-4 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 active:scale-95"
                            >
                                Sí, cerrar sesión
                            </button>
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="w-full py-4 bg-gray-50 text-gray-500 font-bold rounded-2xl hover:bg-gray-100 transition-all active:scale-95"
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

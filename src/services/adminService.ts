export interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    recentOrders: any[];
}

export const adminService = {
    async getDashboardStats(): Promise<DashboardStats> {
        const res = await fetch('/api/admin/stats');
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Error al obtener estadísticas del dashboard');
        }
        return res.json();
    }
};

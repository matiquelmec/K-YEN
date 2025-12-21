import { supabase } from '@/lib/supabase/client';

export interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    recentOrders: any[];
}

export const adminService = {
    async getDashboardStats(): Promise<DashboardStats> {
        try {
            // 1. Fetch Orders 
            const { data: orders, error: ordersError } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (ordersError) throw ordersError;

            // 2. Fetch Products Count
            const { count: productsCount, error: productsError } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true });

            if (productsError) throw productsError;

            // Calculate Stats
            const totalRevenue = orders?.reduce((sum, order) => {
                const val = order.total !== undefined ? order.total : order.total_amount;
                return sum + (Number(val) || 0);
            }, 0) || 0;

            return {
                totalRevenue,
                totalOrders: orders?.length || 0,
                totalProducts: productsCount || 0,
                recentOrders: orders?.slice(0, 5) || []
            };
        } catch (error) {
            console.error('Error in getDashboardStats:', error);
            throw error;
        }
    },

    async getOrders(limit = 50) {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data || [];
    },

    async updateOrderStatus(orderId: number, status: string) {
        const { data, error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', orderId);

        if (error) throw error;
        return data;
    }
};

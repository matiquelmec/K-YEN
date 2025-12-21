import { supabase } from '@/lib/supabase/client';
import { Product } from '@/types';

export interface GetProductsOptions {
    category?: string;
    limit?: number;
    search?: string;
    sortBy?: 'price_asc' | 'price_desc' | 'newest';
}

export const productService = {
    async getProducts(options: GetProductsOptions = {}): Promise<Product[]> {
        let query = supabase.from('products').select('*');

        // Apply filters
        if (options.category && options.category !== 'all') {
            query = query.eq('category', options.category);
        }

        if (options.search) {
            query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%`);
        }

        // Apply sorting
        switch (options.sortBy) {
            case 'price_asc':
                query = query.order('price', { ascending: true });
                break;
            case 'price_desc':
                query = query.order('price', { ascending: false });
                break;
            case 'newest':
                query = query.order('created_at', { ascending: false });
                break;

            default:
                query = query.order('created_at', { ascending: false });
        }

        // Apply limit
        if (options.limit) {
            query = query.limit(options.limit);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data || [];
    },

    async getProductById(id: number): Promise<Product | null> {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async createProduct(product: Partial<Product>): Promise<Product> {
        const { data, error } = await supabase
            .from('products')
            .insert(product)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
        const { data, error } = await supabase
            .from('products')
            .update(product)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteProduct(id: number): Promise<void> {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    async uploadProductImage(file: File | Blob, path: string): Promise<string> {
        const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(path, file, {
                upsert: true,
                contentType: file instanceof File ? file.type : 'image/webp'
            });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('product-images')
            .getPublicUrl(path);

        return data.publicUrl;
    }
};

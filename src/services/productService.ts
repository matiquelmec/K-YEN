import { Product } from '@/types';

export interface GetProductsOptions {
    category?: string;
    limit?: number;
    search?: string;
    sortBy?: 'price_asc' | 'price_desc' | 'newest';
}

export const productService = {
    async getProducts(options: GetProductsOptions = {}): Promise<Product[]> {
        const queryParams = new URLSearchParams();
        if (options.category) queryParams.append('category', options.category);
        if (options.search) queryParams.append('search', options.search);
        if (options.sortBy) queryParams.append('sortBy', options.sortBy);
        if (options.limit) queryParams.append('limit', String(options.limit));

        const res = await fetch(`/api/products?${queryParams.toString()}`);
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Error al obtener productos');
        }
        return res.json();
    },

    async getProductById(id: string | number): Promise<Product | null> {
        const res = await fetch(`/api/products/${id}`);
        if (res.status === 404) return null;
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Error al obtener producto');
        }
        return res.json();
    },

    async createProduct(product: Partial<Product>): Promise<Product> {
        const res = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
        });
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Error al crear producto');
        }
        return res.json();
    },

    async updateProduct(id: string | number, product: Partial<Product>): Promise<Product> {
        const res = await fetch(`/api/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
        });
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Error al actualizar producto');
        }
        return res.json();
    },

    async deleteProduct(id: string | number): Promise<void> {
        const res = await fetch(`/api/products/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Error al eliminar producto');
        }
    },

    async uploadProductImage(file: File | Blob, fileName?: string, category: string = 'otros'): Promise<string> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category);
        if (fileName) {
            formData.append('fileName', fileName);
        }

        const res = await fetch('/api/products/upload', {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Error al subir la imagen');
        }

        const data = await res.json();
        return data.publicUrl;
    }
};

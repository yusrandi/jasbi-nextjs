import { Product } from "prisma/prisma-client";

export const ProductService = {
    async getData() {
        return await fetch('/api/product', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json());
    },
    async getDataById(id: string) {
        console.log({id});
        
        return await fetch(`/api/product/${id}`, { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json());
    },
    async deleteData(product: Product) {
        return await fetch(`/api/product/${product.id}`,
            {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json'

                },
                method: 'DELETE'
            }

        )
            .then((res) => res.json());
    },
    
    
}
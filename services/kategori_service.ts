import { Kategori } from "prisma/prisma-client";

export const KategoriService = {
    async getData() {
        return await fetch('/api/kategori', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json());
    },
    async createData(kategori: Kategori) {
        return await fetch('/api/kategori',
            {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json'

                },
                method: 'POST',
                body: JSON.stringify({
                    name: kategori.name,
                }),
            }

        )
            .then((res) => res.json());
    },
    async updateData(kategori: Kategori) {
        return await fetch(`/api/kategori/${kategori.id}`,
            {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json'

                },
                method: 'PUT',
                body: JSON.stringify({
                    name: kategori.name
                }),
            }

        )
            .then((res) => res.json());
    },

    async deleteData(kategori: Kategori) {
        return await fetch(`/api/kategori/${kategori.id}`,
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
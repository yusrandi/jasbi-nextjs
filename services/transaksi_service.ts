import { Transaksi } from "prisma/prisma-client";

export const TransaksiService = {
    async getData() {
        return await fetch('/api/transaksi', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json());
    },
    // async createData(Transaksi: Transaksi) {
    //     return await fetch('/api/Transaksi',
    //         {
    //             headers: {
    //                 'Cache-Control': 'no-cache',
    //                 'Content-Type': 'application/json'

    //             },
    //             method: 'POST',
    //             body: JSON.stringify({
    //                 name: Transaksi.name,
    //             }),
    //         }

    //     )
    //         .then((res) => res.json());
    // },
    async updateData(transaksi: Transaksi) {
        return await fetch(`/api/transaksi`,
            {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json'

                },
                method: 'POST',
                body: JSON.stringify({
                    id: transaksi.id,
                    status: transaksi.status,
                    imageName: transaksi.file,
                    qty: transaksi.qty,
                    total: transaksi.total,
                    customerId: transaksi.customerId,
                    productId: transaksi.productId,
                }),
            }

        )
            .then((res) => res.json());
    },

    async deleteData(transaksi: Transaksi) {
        return await fetch(`/api/transaksi/${transaksi.id}`,
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

export const NotifikasiService = {
    async getData() {
        return await fetch('/api/notifikasi', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json());
    },
   
    
}
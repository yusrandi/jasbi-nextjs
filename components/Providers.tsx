'use client'
import React, { ReactNode, useEffect, useState } from 'react'
import { SessionProvider } from 'next-auth/react'
interface Props {
    children: ReactNode
}
export default function Providers({ children }: Props) {

    // const [mounted, setMounted] = useState(false);

    // useEffect(() => {
    //     setMounted(true);
    // }, []);

    // if (!mounted) {
    //     return null;
    // }

    return (
        <SessionProvider>{children}</SessionProvider>
    )
}


import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

export default function CustomLoading() {
    return (

        <div className='flex align-items-center justify-content-center'>
            <ProgressSpinner style={{ width: '50px', height: '50px', }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
        </div>

    );
}

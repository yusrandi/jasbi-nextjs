/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { AppTopbarRef } from '../types/types';
import { LayoutContext } from './context/layoutcontext';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Dropdown } from 'primereact/dropdown';


const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const { data: session } = useSession();


    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme !== 'light' ? 'white' : 'dark'}.svg`} width="47.22px" height={'35px'} alt="logo" />
                <span>JASBI</span>
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>

                {/* <button type="button" className="p-link layout-topbar-button">
                    <i className="pi pi-calendar"></i>
                    <span>Calendar</span>
                </button> */}
                {session?.user ?

                    <div className='text-center'>
                        <span>{session.user.name}</span>

                        <button
                            onClick={() => {

                                signOut()

                            }}
                            type="button" className="p-link layout-topbar-button">
                            <i className="pi pi-user"></i>
                            <span>Sign Out</span>
                        </button>
                    </div>
                    :

                    <button
                        onClick={() => {

                            signIn()

                        }}
                        type="button" className="p-link layout-topbar-button">
                        <i className="pi pi-lock"></i>
                        <span>Sign In</span>
                    </button>

                }


                {/* <h1>{session?.user ? 'Sign Out' : 'Sign In'}</h1> */}
                {/* <Link href="/">
                    <button type="button" className="p-link layout-topbar-button">
                        <i className="pi pi-cog"></i>
                        <span>Settings</span>
                    </button>
                </Link> */}

            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;

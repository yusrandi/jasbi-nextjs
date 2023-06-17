/* eslint-disable @next/next/no-img-element */

import { useRouter } from 'next/router';
import React, { SyntheticEvent, useContext, useRef, useState } from 'react';
import AppConfig from '../../../layout/AppConfig';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Page } from '../../../types/types';
import { signIn } from 'next-auth/react';

const LoginPage: Page = () => {
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);

    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const userEmail = useRef("")
    const userPass = useRef("")
    const [error, setError] = useState('')
    const [signInClicked, setSignInClicked] = useState(false);

    async function handleSUbmit(e: SyntheticEvent) {

        setError('')
        setSignInClicked(true)

        if (userEmail.current === '') {
            return
        }
        if (userPass.current === '') {
            return

        }

        const res = await signIn("credentials", {
            email: userEmail.current,
            password: userPass.current,
            redirect: false,
            // callbackUrl: '/',
        }).then(res => {
            setSignInClicked(false)
            console.log({ res });
            if (res !== undefined) {
                if (res?.error != null) {
                    setError(res?.error)
                } else {
                    router.replace('/')
                }
            }

        }).catch(err => {
            setSignInClicked(false)

            console.log({ err });
            setError(err)

        })

        console.log({ res });

    }


    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
                <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <img src="/demo/images/login/avatar.png" alt="Image" height="50" className="mb-3" />
                            <div className="text-900 text-3xl font-medium mb-3">Welcome, Isabel!</div>
                            <span className="text-600 font-medium">Sign in to continue</span>
                        </div>

                        <div>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Email
                            </label>
                            <InputText
                                onChange={(e) => (userEmail.current = e.target.value)}
                                id="email1" type="text" placeholder="Email address" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} required />

                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                Password
                            </label>
                            <Password
                                onChange={(e) => (userPass.current = e.target.value)}
                                inputId="password1" placeholder="Password" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem" required ></Password>

                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    <Checkbox inputId="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} className="mr-2"></Checkbox>
                                    <label htmlFor="rememberme1">Remember me</label>
                                </div>
                                <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                    Forgot password?
                                </a>
                            </div>
                            <div className='mb-3'>
                                {error && <span className='p-invalid text-red-600' >{error}</span>}
                            </div>
                            <Button type='button' label="Sign In" className="w-full p-3 text-xl" onClick={handleSUbmit}></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

LoginPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );
};
export default LoginPage;

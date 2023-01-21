import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import React from 'react'
import { SessionProvider } from "next-auth/react"
import { trpc } from '../utils/trpc';
import '../styles/global.css'
import UserProvider from '../components/UserProvider';
import ModalContextProvider from '../components/ModalContextProvider';

function MyApp({ Component, pageProps: session, ...pageProps }: AppProps) {

    return (
        <SessionProvider refetchOnWindowFocus={false} >
            <UserProvider>
                <ModalContextProvider>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </ModalContextProvider>
            </UserProvider>
        </SessionProvider>
    )
}

export default trpc.withTRPC(MyApp)


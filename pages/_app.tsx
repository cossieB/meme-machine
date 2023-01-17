import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import React from 'react'
import { SessionProvider } from "next-auth/react"
import { trpc } from '../utils/trpc';
import '../styles/global.css'
import UserProvider from '../components/UserProvider';

function MyApp({ Component, pageProps: session, ...pageProps }: AppProps) {
    
    return (
        <SessionProvider refetchOnWindowFocus={false} >
            <UserProvider>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </UserProvider>
        </SessionProvider>
    )
}

export default trpc.withTRPC(MyApp)


import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import React, { createContext } from 'react'
import { SessionProvider } from "next-auth/react"
import { trpc } from '../utils/trpc';
import '../styles/global.css'

function MyApp({ Component, pageProps: session, ...pageProps }: AppProps) {

    return (
        <SessionProvider>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </SessionProvider>
    )
}

export default trpc.withTRPC(MyApp)

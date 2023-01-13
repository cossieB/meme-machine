import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import React, { createContext } from 'react'
import { IUserContext } from '../utils/interfaces';
import { trpc } from '../utils/trpc';
import '../styles/global.css'

export const UserContext = createContext<IUserContext | null>(null)

function MyApp({ Component, pageProps }: AppProps) {

    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    )
}

export default trpc.withTRPC(MyApp)

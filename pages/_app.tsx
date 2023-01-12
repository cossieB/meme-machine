import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import React, { createContext, useEffect, useState } from 'react'
import cookie from 'cookie';
import { IUserContext, UserPick } from '../utils/interfaces';
import { trpc } from '../utils/trpc';

export const UserContext = createContext<IUserContext | null>(null)

function MyApp({ Component, pageProps }: AppProps) {

    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    )
}

export default trpc.withTRPC(MyApp)

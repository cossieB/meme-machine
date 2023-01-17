import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import React, { useState } from 'react'
import { SessionProvider } from "next-auth/react"
import { trpc } from '../utils/trpc';
import '../styles/global.css'
import { ContextUser, UserContext } from '../hooks/userContext';

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

type Props = {
    children: React.ReactNode
}

function UserProvider({children}: Props) {
    const [user, setUser] = useState<ContextUser | null>(null)
    trpc.getMyInfo.useQuery(undefined, {
        onSuccess(data) {
            setUser(data)
        },
    })
    return (
        <UserContext.Provider value={{user, setUser}} >
            {children}
        </UserContext.Provider>
    )
}
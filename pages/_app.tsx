import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import React, { createContext, useEffect, useState } from 'react'
import cookie from 'cookie';
import { User, UserPick } from '../utils/interfaces';

export type ContextInterface = {
    user?: UserPick,
    setUser: React.Dispatch<React.SetStateAction<UserPick | undefined>>
}

export const UserContext = createContext<ContextInterface | null>(null)

function MyApp({ Component, pageProps }: AppProps) {
    const [user, setUser] = useState<UserPick>()
    useEffect(() => {
        let cookies = document.cookie; 

        if (cookie.parse(cookies).user) {
            let storedUser: UserPick = JSON.parse(cookie.parse(cookies).user)
            setUser(storedUser)
        }
        else {
            fetch('/api/login')
                .then(res => res.json())
                .then(data => {
                    if (data.user) {
                        setUser(data.user)
                        document.cookie = `user=${JSON.stringify(data.user)}`
                    }
                })
        }
    }, [])
    return (
        <UserContext.Provider value={{ user, setUser }}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </UserContext.Provider>
    )
}

export default MyApp

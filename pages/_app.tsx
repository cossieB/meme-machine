import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import React, { createContext, useEffect, useState } from 'react'
import cookie from 'cookie';

export type ContextInterface = {
    user: string,
    setUser: React.Dispatch<React.SetStateAction<string>>
}

export const UserContext = createContext<ContextInterface | null>(null)

function MyApp({ Component, pageProps }: AppProps) {
    const [user, setUser] = useState("")
    useEffect(() => {
        let cookies = document.cookie; 
        let storedUser = cookie.parse(cookies).user
        if (storedUser) {
            setUser(storedUser)
        }
        else {
            fetch('/api/login')
                .then(res => res.json())
                .then(data => {
                    if (data.user) {
                        setUser(data.user);
                        document.cookie = `user=${data.user};path=/`
                    }
                })
        }
    }, )
    return (
        <UserContext.Provider value={{ user, setUser }}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </UserContext.Provider>
    )
}

export default MyApp

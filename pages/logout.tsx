import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { useContext, useEffect } from "react";
import { UserContext } from "./_app";

interface P {
    loggedOut: boolean
}

export default function Logout(props: P) {
    const {setUser} = useContext(UserContext)!
    useEffect(() => {
        if (props.loggedOut) {
            document.cookie = "user=4; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
            setUser("")
        }
    })
    return (
        <img src="https://memegenerator.net/img/instances/58606432/i-will-never-forget-you.jpg" alt="" />
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> {
    context.res.setHeader("Set-Cookie","jwt=11; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT")
    return {
        props: {loggedOut: true}
    }
}
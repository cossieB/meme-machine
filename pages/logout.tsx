import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { useEffect } from "react";

interface P {
    loggedOut: boolean
}

export default function Logout(props: P) {
    useEffect(() => {
        if (props.loggedOut) {
            document.cookie = "user=4; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        }
    })
    return (
        <img src="https://memegenerator.net/img/instances/58606432/i-will-never-forget-you.jpg" alt="" />
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> {
    context.res.setHeader("Set-Cookie","jwt=11; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT")
    // context.res.setHeader("Set-Cookie","user=11; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT")
    return {
        props: {loggedOut: true}
    }
}
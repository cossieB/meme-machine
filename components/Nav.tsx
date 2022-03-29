import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import cookie from 'cookie'
import { ContextInterface, UserContext } from "../pages/_app";

export default function Nav() {
    const { user } = useContext(UserContext) as ContextInterface
    return (
        <nav>
            <div>
                {user?.username ? <Link href={`/users/${user.username}`} ><a>{user.username}</a></Link> : <Link href={"/auth/"} ><a>Signup</a></Link>}
            </div>
            <Link href="/posts" ><a className="logo">Meme Machine</a></Link>
        </nav>
    )
}
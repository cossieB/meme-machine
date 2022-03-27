import Head from "next/head";
import Link from "next/link";
import { ReactNode } from "react";
import Nav from "./Nav";

interface P {
    children: ReactNode
}

export default function Layout(props: P) {
    return (
        <>
            <Head><title>Meme Machine</title> </Head>
            <Nav />
            <main>{props.children}</main>
            <footer style={{position: "relative", bottom: 0, textAlign: "center", fontWeight: "bolder"}}>&copy; &nbsp; <a href="https://cossie-91.web.app" target="_blank" rel="noreferrer">Cossie</a></footer>
        </>
    )
}

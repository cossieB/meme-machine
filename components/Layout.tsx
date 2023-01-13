import Head from "next/head";
import Link from "next/link";
import { ReactNode } from "react";
import Nav from "./Nav";

interface P {
    children: ReactNode
}

export default function Layout(props: P) {
    return (
        <div className="flex">
            <Head><title>Meme Machine</title> </Head>
            <Nav />
            <main className="mx-52">{props.children}</main>
            <div className="sideBar"/>
            {/* <footer style={{position: "relative", bottom: 0, textAlign: "center", fontWeight: "bolder"}}>&copy; &nbsp; <a href="https://cossie-91.web.app" target="_blank" rel="noreferrer">Cossie</a></footer> */}
        </div>
    )
}

import Link from "next/link";
import { ReactNode } from "react";
import Nav from "./Nav";

interface P {
    children: ReactNode
}

export default function Layout(props: P) {
    return (
        <>
            <Nav />
            <main>{props.children}</main>
            <footer style={{position: "relative", bottom: 0, textAlign: "center", fontWeight: "bolder"}}>&copy; <a href="https://cossie-91.web.app" target="_blank">Cossie</a></footer>
        </>
    )
}

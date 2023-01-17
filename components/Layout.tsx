import { AnimatePresence } from "framer-motion";
import Head from "next/head";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { ModalEnum } from "../types/ModalEnum";
import Modal from "./Modal";
import Nav from "./Nav";
import Profile from "./Profile";
import SignupPrompt from "./SignupPrompt";

interface P {
    children: ReactNode
}

export default function Layout(props: P) {
    const [modal, setModal] = useState<ModalEnum>("");
    const closeModal = () => setModal("")
    return (
        <div className="flex w-screen min-h-screen">
            <Head><title>Meme Machine</title> </Head>
            <Nav setModal={setModal} />
            <main className="text-orange-200 w-screen">
                {props.children}
                {/* <footer style={{position: "relative", bottom: 0, textAlign: "center", fontWeight: "bolder"}}>&copy; &nbsp; <a href="https://cossie-91.web.app" target="_blank" rel="noreferrer">Cossie</a></footer> */}
            </main>
            <div className="sideBar" />
            <AnimatePresence>

                {modal && (
                    <Modal closeModal={closeModal}>
                        {modal == 'profile' && <Profile />}
                        {modal == 'prompt signup' && <SignupPrompt />}
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    )
}

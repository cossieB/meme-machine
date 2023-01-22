import { AnimatePresence } from "framer-motion";
import Head from "next/head";
import { ReactNode, useContext, useState } from "react";
import { ModalEnum } from "../types/ModalEnum";
import Modal from "./Modal";
import Nav from "./Nav/Nav";
import Profile from "./Forms/Profile";
import SignupPrompt from "./SignupPrompt";
import NewMeme from "./Forms/NewMeme";
import { ModalContext } from "../hooks/modalContext";

interface P {
    children: ReactNode
}

export default function Layout(props: P) {
    const {modal, setModal, closeModal} = useContext(ModalContext)!
    return (
        <div className="flex w-screen min-h-screen">
            <Head><title>Meme Machine</title> </Head>
            <Nav  />
            <main className="text-orange-200 ml-16 md:ml-64 w-screen">
                {props.children}
                {/* <footer style={{position: "relative", bottom: 0, textAlign: "center", fontWeight: "bolder"}}>&copy; &nbsp; <a href="https://cossie-91.web.app" target="_blank" rel="noreferrer">Cossie</a></footer> */}
            </main>
            <div className="sideBar" />
            <AnimatePresence>

                {modal && (
                    <Modal closeModal={closeModal}>
                        {modal == 'PROFILE' && <Profile />}
                        {modal == 'PROMPT_SIGNUP' && <SignupPrompt />}
                        {modal == 'PUBLISH' && <NewMeme />}
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    )
}

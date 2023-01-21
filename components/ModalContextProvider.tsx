import { useState } from "react";
import { ModalContext } from "../hooks/modalContext";
import { ModalEnum } from "../types/ModalEnum";
import { WithChildren } from "../types/PropTypes";

export default function ModalContextProvider({children}: WithChildren) {
    const [modal, setModal] = useState<ModalEnum>("");
    const closeModal = () => setModal("")
    return (
        <ModalContext.Provider value={{modal, setModal, closeModal}}>
            {children}
        </ModalContext.Provider>
    )
}
import { createContext } from "react";
import { ModalEnum } from "../types/ModalEnum";

type ModalContextType = {
    modal: ModalEnum
    setModal: React.Dispatch<React.SetStateAction<ModalEnum>>
    closeModal(): void
}

export const ModalContext = createContext<ModalContextType | null>(null)
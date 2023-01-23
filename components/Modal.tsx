import { motion } from "framer-motion"
import { closeSvg } from "../utils/svgs"

type Props = {
    children: React.ReactNode
    closeModal: () => void
}

export default function Modal({ children, closeModal }: Props) {
    return (
        <motion.div
            initial={{x: "-100vw"}}
            animate={{x: 0}}
            exit={{x: "100vw"}}
            className="z-10 top-0 left-0 w-screen h-screen fixed flex items-center justify-center backdrop-blur-lg"
        >
            <div className="z-20 w-full h-full flex flex-col justify-center items-center" >
                {children}
            </div>
            <span onClick={closeModal} className="absolute top-3 left-3 z-[999] hover:shadow-red-500">
                {closeSvg}
            </span>
        </motion.div>
    )
}
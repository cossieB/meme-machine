import { motion } from "framer-motion"

interface P {
    children: React.ReactNode
}

export default function Popup({ children }: P) {
    return (
        <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
        >
            {children}
        </motion.div>
    )
}
import { closeSvg } from "./svgs"

type Props = {
    children: React.ReactNode
    closeModal: () => void
}

export default function Modal({ children, closeModal }: Props) {
    return (
        <div className="z-10 top-0 left-0 w-screen h-screen fixed flex items-center justify-center backdrop-blur-lg">
            <div className="z-20 w-full h-full flex flex-col justify-center items-center" >
                {children}
            </div>
            <span onClick={closeModal} className="absolute top-10 left-10 z-[999] hover:shadow-red-500">
                {closeSvg}
            </span>
        </div>
    )
}
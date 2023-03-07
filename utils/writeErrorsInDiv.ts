import { RefObject } from "react"

export default function writeErrorInDiv(errorMsg: string, ref: RefObject<Element>) {
    ref.current!.textContent = errorMsg
    setTimeout(() => {
        ref.current!.textContent = ""
    }, 5000)
}
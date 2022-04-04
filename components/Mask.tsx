import React, { ReactNode, SetStateAction, useRef } from "react";

interface P {
    showModal: React.Dispatch<SetStateAction<boolean>>,
    children: ReactNode
}

export default function (props: P) {
    const ref = useRef<HTMLDivElement>(null)

    return (
        <>
            <div onClick={() => props.showModal(false)} className="mask"/>
            <div ref={ref} className="modal">
                {props.children}
            </div>
        </>
    )
}
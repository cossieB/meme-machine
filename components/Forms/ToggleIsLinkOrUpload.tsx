import { SetStateAction } from "react"
import RadioInput from "./RadioInput"

type P = {
    setIsUpload: React.Dispatch<SetStateAction<boolean>>
    name: string
    isUpload: boolean
    rollback(): void
}

export default function ToggleLinkOrUpload(props: P) {
    const { setIsUpload, name, isUpload, rollback } = props
    return (
        <div className="relative z-0 mt-7 text-slate-200">
            <RadioInput
                onChange={() => {
                    setIsUpload(false)
                }}
                name={name}
                checked={!isUpload}
                id={`${name}Link`}
            />
            <RadioInput
                onChange={() => {
                    rollback()
                    setIsUpload(true)
                }}
                name={name}
                id={`${name}Upload`}
                checked={isUpload}
            />
        </div>
    )
}
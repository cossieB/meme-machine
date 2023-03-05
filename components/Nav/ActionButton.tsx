type Props = {
    onClick: () => void
    children: React.ReactNode
}

export default function ActionButton(props: Props) {
    const { onClick, children } = props
    return (
        <div
            onClick={onClick}
            className="flex items-center justify-start text-orange-300  cursor-pointer hover:rounded-full hover:bg-teal-900"
        >
            {children}
        </div>
    )
}
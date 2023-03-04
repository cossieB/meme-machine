type P = {
    disabled: boolean,
    onClick(): void,
    label: string
}

export default function PageButton({ disabled, onClick, label }: P) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="flex items-center justify-center w-32 text-orange-300  cursor-pointer hover:rounded-full hover:bg-teal-900 disabled:text-slate-400"
        >
            {label}
        </button>
    );
}

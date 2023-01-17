type Props = {
    label: string,
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>
    isTextarea?: boolean
}

export default function FormInput(props: Props) {
    const { label, value, setValue, isTextarea } = props;
    return (
        <div className="relative z-0 mt-7">
            {isTextarea ?
                <textarea
                    id={label}
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    className="block py-2.5 px-0 w-full text-orange-300 bg-transparent border-0 border-b-2 border-slate-300 appearance-none focus:border-orange-500 focus:outline-none focus:ring-0 peer" placeholder=" "
                /> :
                <input
                    type="text"
                    id={label}
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    className="block py-2.5 px-0 w-full text-orange-300 bg-transparent border-0 border-b-2 border-slate-300 appearance-none focus:border-orange-500 focus:outline-none focus:ring-0 peer" placeholder=" "
                />
            }
            <label
                htmlFor={label}
                className="absolute text-slate-200  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-teal-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">{label}</label>
        </div>
    )
}
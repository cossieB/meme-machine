type P = {
    setFile: React.Dispatch<React.SetStateAction<File | undefined>>
    label: string
}
export default function FileInput({setFile, label}: P) {
    return (
        <label className="bg-orange-300 rounded-md max-w-fit p-2 mt-7">
            <input
                onChange={e => {
                    setFile(e.target.files![0]);
                }}
                className="opacity-0 absolute"
                name={label}
                type="file"
                required
            />
            <span> {label} </span>
        </label>
    )
}
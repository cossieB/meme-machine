type P = {
    setFile: React.Dispatch<React.SetStateAction<File | undefined>>
    label: string
    maxSize?: number
    handleError(str: string): void
}
export default function FileInput({setFile, label, maxSize = 1024 * 1024, handleError}: P) {
    return (
        <label className="bg-orange-300 rounded-md max-w-fit p-2 mt-7">
            <input
                onChange={e => {
                    if (!e.target.files || e.target.files.length == 0) return;
                    const file = e.target.files[0];
                    if (!file.type.startsWith('image/')) {
                        e.target.value = ""
                        return handleError("Only image files are permitted.")
                    }
                    if (file.size > maxSize) {
                        e.target.value = ""
                        return handleError("Maximum file size is 1MB")
                    }
                    setFile(e.target.files[0]);
                }}
                className="opacity-0 absolute"
                name={label}
                type="file"
                accept="image/*"
                required
            />
            <span> {label} </span>
        </label>
    )
}
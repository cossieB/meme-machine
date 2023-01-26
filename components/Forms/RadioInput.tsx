import titleCase from "../../lib/titleCase";

type P = {
    checked: boolean
    onChange: () => void,
    name: string,
    id: string
}

export default function RadioInput(props: P) {
    const { checked, onChange, name, id } = props;
    return (
        <>
            <input
                className="mr-1"
                type="radio"
                name={name}
                id={id}
                checked={checked}
                onChange={onChange}
            />
            <label className="mr-5" htmlFor="avatarUpload">{titleCase(id)} </label>
        </>
    )
}
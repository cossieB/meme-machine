import titleCase from "../../lib/titleCase";
import { UseStateSetterAndValue } from "../../types/PropTypes";
import ActionButton from "../Nav/ActionButton";

type P = UseStateSetterAndValue<string> & {
    tab: string
}

export default function Tab(props: P) {
    const { setValue, value, tab } = props;
    return (
        <ActionButton onClick={() => setValue(tab)}>
            <div className={`w-40 text-xl h-14 rounded-full flex items-center justify-center ${value == tab && "bg-emerald-600"}`} >
                {titleCase(tab)}
            </div>
        </ActionButton>
    );
}

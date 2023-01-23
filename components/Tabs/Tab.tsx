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
            <div className={`mr-2 w-24 md:w-40 md:h-14 flex-wrap text-xl rounded-full flex items-center justify-center ${value == tab && "bg-emerald-600"}`} >
                {titleCase(tab)}
            </div>
        </ActionButton>
    );
}

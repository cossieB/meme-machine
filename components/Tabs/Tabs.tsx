import { SetStateAction } from "react";
import { UseStateSetterAndValue } from "../../types/PropTypes";
import Tab  from "./Tab";

type P = UseStateSetterAndValue<string> & {
    tabs: readonly string[]
    setPage?: React.Dispatch<SetStateAction<number>>
}

export default function Tabs(props: P) {
    return (
        <nav className="flex w-full my-3 flex-wrap">
            {props.tabs.map(t =>
                <Tab 
                    key={t}
                    {...props}
                    tab={t}
                />
            )}
        </nav>
    )
}




import { UseStateSetterAndValue } from "../../types/PropTypes";
import Tab  from "./Tab";

type P = UseStateSetterAndValue<string> & {
    tabs: readonly string[]
}

export default function Tabs(props: P) {
    return (
        <nav className="flex w-full my-3">
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




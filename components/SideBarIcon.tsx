import { ReactNode } from "react";
import { SvgProps } from "./svgs";

type IconProps = {
    Icon: any,
    text: string,
    size?: number
}

export default function SideBarIcon(props: IconProps) {
    const { Icon, text, size } = props;
    return (
        <div className="navIcon">
            <Icon size={size} />
        </div>
    )
}
import Link from "next/link";
import { ReactNode } from "react";
import { SvgProps } from "./svgs";

type IconProps = {
    icon: JSX.Element,
    text: string,
    href: string
}

export default function SideBarIcon(props: IconProps) {
    const { icon, text, href } = props;
    return (
        <Link href={href}>
            <div className="flex items-center mx-3 text-orange-300 h-20 cursor-pointer">
                <span className="w-10">{icon}</span>
                <span> {text} </span>
            </div>
        </Link>
    )
}
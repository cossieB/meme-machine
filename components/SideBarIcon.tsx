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
            <a>
                <div className="flex items-center p-3 text-orange-300  cursor-pointer hover:rounded-full hover:bg-teal-900">
                    <span className="w-10">{icon}</span>
                    <span> {text} </span>
                </div>
            </a>
        </Link>
    )
}
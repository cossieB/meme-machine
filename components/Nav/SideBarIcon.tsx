import Link from "next/link";
import { ReactNode } from "react";
import { Optional } from "../../lib/utilityTypes";


type IconProps = {
    icon: JSX.Element,
    text: string | number,
    href: string,
    isImg?: false | undefined,
    hideTextOnMobile?: boolean
} | {
    icon: string,
    text: string | number,
    href: string,
    isImg: true,
    hideTextOnMobile?: boolean
}

export default function SideBarDiv(props: IconProps) {
    const { icon, text, href } = props;
    return (
        <Link href={href}>
            <a>
                <NavItem {...props} />
            </a>
        </Link>
    )
}

export function NavItem(props: Optional<IconProps, 'href'>) {
    const { icon, text, href, isImg, hideTextOnMobile = true } = props;
    return (
        <div className="flex h-16 w-16 items-center justify-center md:justify-start md:p-3 text-orange-300  cursor-pointer hover:rounded-full hover:bg-teal-900">
            {isImg ?
                <img src={icon as string} className="rounded-full h-16 md:w-16 md:h-auto object-cover mr-3" alt="" />
                :
                <span className="mr-3">{icon}</span>
            }
            <span className={`${hideTextOnMobile && 'hidden'} md:block`}> {text} </span>
        </div>
    )

}
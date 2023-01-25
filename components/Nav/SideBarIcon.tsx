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
    const { icon, text, href, isImg } = props;
    const hideTextOnMobile = props.hideTextOnMobile ?? true
    return (
        <div className="flex items-center p-3 text-orange-300  cursor-pointer hover:rounded-full hover:bg-teal-900">
            {isImg ?
                <img src={icon as string} className="rounded-full h-10 w-10 mr-3" alt="" />
                :
                <span className="w-10">{icon}</span>
            }
            <span className={`${hideTextOnMobile && 'hidden'} md:block`}> {text} </span>
        </div>
    )

}
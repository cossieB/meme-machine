import Link from "next/link";
import SideBarIcon from "./SideBarIcon";
import { LoginSvg, SearchSvg } from "./svgs";

export default function Nav() {
    return (
        <nav className="flex-col h-screen bg-teal-800 w-52 absolute top-0 left-0">
            <Link href={"/auth/"} >
                <SideBarIcon Icon={ LoginSvg } text={"Login"} />
            </Link>
            <Link href={"/search/"} >
                <SideBarIcon Icon={ SearchSvg } text={"Login"} />
            </Link>
        </nav>
    )
}
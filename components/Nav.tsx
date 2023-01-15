import Link from "next/link";
import SideBarIcon from "./SideBarIcon";
import { homeSvg, loginSvg, searchSvg } from "./svgs";
import { useSession, signIn, signOut } from "next-auth/react"

export default function Nav() {
    const { data: session } = useSession()
    return (
        <nav className="flex flex-col w-64 content-center bg-teal-800 h-screen">
            <div className="flex text-3xl h-20 items-center text-orange-300 font-bills mx-3">
                <span className="hidden md:block text-3xl text-orange-300 font-bills" >
                    Meme Machine
                </span>
                <span className="md:hidden text-3xl text-orange-300 font-bills">
                    MM
                </span>
            </div>
            <SideBarIcon icon={homeSvg} text="Home" href="/" />
            {!session ?
                <div className="flex h-20 items-center mt-auto mx-3 text-orange-300 cursor-pointer">
                    <span className="h-8 w-10">{loginSvg}</span>
                    <span> Login </span>
                </div> :
                <div className="flex h-20 items-center mt-auto mx-3 text-orange-300 cursor-pointer">
                    <span className="h-8 w-10">
                        <img src={session.user!.image || "https://media.makeameme.org/created/anonymous-hacker.jpg"} alt="profile"
                            className="rounded-full h-8 w-8"
                        />
                    </span>
                    <span> {session.user?.name || ""} </span>
                </div>
        }
        </nav>
    )
}
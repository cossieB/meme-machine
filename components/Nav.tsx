import Link from "next/link";
import SideBarIcon from "./SideBarIcon";
import { homeSvg, loginSvg, searchSvg } from "./svgs";
import { useSession, signIn, signOut } from "next-auth/react"
import { Dispatch, SetStateAction } from "react";

type Props = {
    setModal: Dispatch<SetStateAction<"" | "search" | "profile">>

}

export default function Nav({ setModal }: Props) {
    const { data: session } = useSession();
    console.log(session)
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
                <div
                    onClick={() => signIn()}
                    className="flex h-20 items-center mt-auto mb-1 p-3 hover:rounded-full hover:bg-teal-900 text-orange-300 cursor-pointer">
                    <span className="h-8 w-10">{loginSvg}</span>
                    <span> Login </span>
                </div> :
                <div onClick={() => setModal('profile')} className="flex h-20 items-center mt-auto mb-1 p-3 hover:rounded-full hover:bg-teal-900 text-orange-300 cursor-pointer">
                    <span className="h-8 w-10">
                        <img src={session.user!.image || "https://media.makeameme.org/created/anonymous-hacker.jpg"} alt="profile"
                            className="rounded-full h-8 w-8"
                        />
                    </span>
                    <span> {session.user?.username || ""} </span>
                </div>
            }
        </nav>
    )
}


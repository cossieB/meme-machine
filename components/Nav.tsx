import Link from "next/link";
import SideBarDiv, { NavItem } from "./SideBarIcon";
import { addSvg, homeSvg, loginSvg, searchSvg } from "../utils/svgs";
import { useSession, signIn, signOut } from "next-auth/react"
import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { ContextUser, UserContext } from "../hooks/userContext";
import ActionButton from "./ActionButton";
import { ModalEnum } from "../types/ModalEnum";

type Props = {
    setModal: Dispatch<SetStateAction<ModalEnum>>
}

export default function Nav({ setModal }: Props) {
    const { data: session } = useSession();
    const { user } = useContext(UserContext)!
    const { storage } = useLocalStorage<ContextUser>('user', {
        email: "",
        image: "",
        name: "",
        status: "",
        username: ""
    })
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
            <SideBarDiv icon={homeSvg} text="Home" href="/" />
            <ActionButton onClick={session ? () => setModal('publish') : () => setModal('prompt signup')}>
                <NavItem icon={addSvg} text="Publish"
                />
            </ActionButton>
            {!session ?
                <div className="mt-auto mb-3">
                    <ActionButton onClick={() => signIn()}>
                        <NavItem icon={loginSvg} text="Login" />
                    </ActionButton>
                </div>
                :
                <div className="mt-auto mb-3">
                    <ActionButton onClick={() => setModal('profile')}>
                        <NavItem
                            icon={user?.image ?? storage?.image ?? "https://media.makeameme.org/created/anonymous-hacker.jpg"}
                            text={user?.username ?? storage?.username ?? ""}
                            isImg
                        />
                    </ActionButton>
                </div>
            }
        </nav>
    )
}


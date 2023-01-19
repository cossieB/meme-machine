import { useSession, signIn } from "next-auth/react";
import { Dispatch, SetStateAction, useContext } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { UserContext, ContextUser } from "../../hooks/userContext";
import { ModalEnum } from "../../types/ModalEnum";
import { homeSvg, addSvg, loginSvg } from "../../utils/svgs";
import ActionButton from "./ActionButton";
import SideBarDiv, { NavItem } from "./SideBarIcon";


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
        <nav className="flex fixed flex-col w-16 md:w-64 content-center bg-teal-800 h-screen">
            <div className="flex text-3xl h-20 items-center text-orange-300 font-bills mx-3">
                <span className="hidden md:block text-3xl text-orange-300 font-bills" >
                    Meme Machine
                </span>
                <span className="md:hidden text-3xl text-orange-300 font-bills">
                    MM
                </span>
            </div>
            <SideBarDiv icon={homeSvg} text="Home" href="/" />
            <ActionButton onClick={session ? () => setModal('PUBLISH') : () => setModal('PROMPT_SIGNUP')}>
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
                    <ActionButton onClick={() => setModal('PROFILE')}>
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


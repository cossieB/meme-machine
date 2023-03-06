import { useSession, signIn } from "next-auth/react";
import { useContext } from "react";
import { ModalContext } from "../../hooks/modalContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { UserContext, ContextUser } from "../../hooks/userContext";
import { homeSvg, addSvg, loginSvg, activitySvg, searchSvg } from "../../utils/svgs";
import ActionButton from "./ActionButton";
import SideBarDiv, { NavItem } from "./SideBarIcon";

export default function Nav() {
    const { data: session } = useSession();
    const { setModal } = useContext(ModalContext)!
    const { user } = useContext(UserContext)!
    const { storage } = useLocalStorage<ContextUser>('user', {
        email: "",
        image: "",
        name: "",
        status: "",
        username: "",
        banner: "",
        id: ""
    })
    return (
        <nav className="flex fixed md:flex-col md:w-16 lg:w-64 items-center justify-center md:items-start bg-teal-800 md:h-screen h-16 w-full bottom-0 z-10">
            <div className="flex text-3xl h-20 items-center text-orange-300 font-bills mx-3">
                <span className="hidden md:block text-3xl text-orange-300 font-bills" >
                    Meme Machine
                </span>
            </div>
            <div className="md:w-full">
                <SideBarDiv icon={homeSvg} text="Home" href="/" />
            </div>
            <div className="md:w-full">
                <ActionButton onClick={session ? () => setModal('PUBLISH') : () => setModal('PROMPT_SIGNUP')}>
                    <NavItem
                        icon={addSvg}
                        text="Publish"
                    />
                </ActionButton>
            </div>
            <div className="md:w-full">
                <SideBarDiv icon={activitySvg} text="Explore" href="/explore" />
            </div>
            <div className="md:w-full">
                <SideBarDiv icon={searchSvg} text="Search" href="/search" />
            </div>
            <div className="ml-auto md:ml-0 md:mt-auto md:mb-3 md:w-full">
                {!session ?
                    <ActionButton onClick={() => signIn()}>
                        <NavItem icon={loginSvg} text="Login" />
                    </ActionButton>
                    :
                    <ActionButton onClick={() => setModal('PROFILE')}>
                        <NavItem
                            icon={user?.image ?? storage?.image ?? "https://media.makeameme.org/created/anonymous-hacker.jpg"}
                            text={user?.username ?? storage?.username ?? ""}
                            isImg
                        />
                    </ActionButton>
                }
            </div>
        </nav>
    )
}


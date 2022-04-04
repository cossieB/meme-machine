import Link from "next/link";
import { useContext, useState } from "react";
import { UserContext } from "../pages/_app";
import { IUserContext } from "../utils/interfaces";
import Mask from "./Mask";
import Profile from "./Profile";
import Settings from "./Settings";

export default function Nav() {
    const { user } = useContext(UserContext) as IUserContext
    const [showProfile, setShowProfile] = useState(false)
    return (
        <nav>
            <div>
                {user ? <div onClick={() => setShowProfile(true)} > <a>{user.username}</a></div> : <Link href={"/auth/"} ><a>Signup</a></Link>}
            </div>
            <Link href="/posts" ><a className="logo">Meme Machine</a></Link>

            {showProfile && user &&  (
                <Mask showModal={setShowProfile} >
                    <Profile showModal={setShowProfile} pageUser={user} />
                    <Settings  />
                </Mask>
            )}
        </nav>
    )
}
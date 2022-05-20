import Link from "next/link";
import { useContext, useState } from "react";
import { UserContext } from "../pages/_app";
import formatDate from "../utils/formatDate";
import { IUserContext } from "../utils/interfaces";
import Mask from "./Mask";
import Profile from "./Profile";
import Settings from "./Settings";

export default function Nav() {
    const { user } = useContext(UserContext) as IUserContext
    const [showProfile, setShowProfile] = useState(false)
    return (
        <nav>

            {user ?
                <div style={{ height: '100%', }} onClick={() => setShowProfile(true)} >
                    <a className="navLinks" >
                        <img style={{ height: '95%', aspectRatio: '1', borderRadius: '50%' }} src={user.avatar} alt={`${user.username}'s Avatar`} />
                        &nbsp; <span>{user.username}</span>
                    </a>
                </div>
                : <Link href={"/auth/"} >
                    <a className="navLinks">
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-door-open" viewBox="0 0 16 16">
                            <path d="M8.5 10c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1z" />
                            <path d="M10.828.122A.5.5 0 0 1 11 .5V1h.5A1.5 1.5 0 0 1 13 2.5V15h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V1.5a.5.5 0 0 1 .43-.495l7-1a.5.5 0 0 1 .398.117zM11.5 2H11v13h1V2.5a.5.5 0 0 0-.5-.5zM4 1.934V15h6V1.077l-6 .857z" />
                        </svg>
                        &nbsp; <span>Signup</span>
                    </a>
                </Link>}

                    <Link href="/posts" ><a className="logo logoDesktop">Meme Machine</a></Link>
                    <Link href="/posts" ><a className="logo logoMobile">MM</a></Link>
            <Link href={'/search'} >
                <a className="navLinks">
                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg>
                    &nbsp; <span>Search</span>
                </a>
            </Link>


            {showProfile && user && (
                <Mask showModal={setShowProfile} >
                    <Profile showModal={setShowProfile} pageUser={{...user, dateString: formatDate(user.joinDate)}} />
                    <Settings />
                </Mask>
            )}
        </nav>
    )
}
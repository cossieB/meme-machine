import Link from "next/link";
import { SetStateAction, useContext } from "react";
import { UserContext } from "../pages/_app";
import styles from '../styles/users.module.css'
import { IUser, IUserContext, UserPick } from "../utils/interfaces";

interface P1 {
    pageUser: Pick<IUser, "username" | "avatar" | "status"> & {dateString: string} & {memes?: number},
    showModal?: React.Dispatch<SetStateAction<boolean>>
}

export default function Profile({pageUser, showModal}: P1) {
    const {user} = useContext(UserContext) as IUserContext
    return (
        <div style={{color: 'var(--colorDark)', marginTop: '1rem'}} >
            <div >
            <img className={styles.avatar}  src={pageUser.avatar} alt={`${pageUser.username}'s Avatar`} />
                <div><h2>{pageUser.username}</h2></div>
                <div><h5>{pageUser.status}</h5></div>
                <div>{pageUser.dateString}</div>
                { pageUser.memes ? <div>{pageUser.memes} memes</div> : <Link href={`../users/${pageUser.username}`}><a onClick={() => showModal && showModal(false)} style={{color: 'var(--colorDark)', fontSize: '1.5rem'}}>Profile</a></Link> }
            </div>

            <div>

                {pageUser.username == user?.username && <button onClick={() => showModal && showModal(false)} className="danger" type="button"><Link href={'/logout'}><span>Logout</span></Link></button> }
            </div>
            
        </div>
    )
}
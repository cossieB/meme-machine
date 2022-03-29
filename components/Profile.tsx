import Link from "next/link";
import styles from '../styles/users.module.css'

interface P1 {
    pageUser: any,
    user: string | undefined
}

export default function Profile({pageUser, user}: P1) {
    return (
        <div >
            <img className={styles.avatar}  src={pageUser.avatar} alt={`${pageUser.username}'s Avatar`} />
            <div >
                <div><h2>{pageUser.username}</h2></div>
                <div>{new Date(pageUser.joinDate).toDateString()}</div>
                <div>{pageUser.memes} memes</div>
            </div>
        </div>
    )
}
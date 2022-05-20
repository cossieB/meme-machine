import Link from "next/link";
import { IPost, IUser } from "../utils/interfaces";
import styles from "../styles/Posts.module.scss"

type PostExclUser = Omit<IPost, "user">
type P = Partial<PostExclUser> & { user: Partial<IUser> } & { dateString: string } & { id: string } & {idx: number}

interface Props {
    posts: P[],
    pageMax: number,
    pageUser: Pick<IUser, "username" | "avatar" | "status"> & { dateString: string }
}

const postsPerPage = 3;

export default function Tile({ p }: { p: P }) {
    return (
        <Link href={`/posts/${p.id}`}>
            <a>
                <div className={styles.tile}>
                    <h3 style={{width: '100%'}}  className={`label-title-${p.idx}`} >{p.title}</h3>
                    <img src={p.image} alt={`${p.title} image`} />
                </div>
            </a>
        </Link>
    )
}
import styles from "../styles/Posts.module.css"
import { IPost, IUser } from "../utils/interfaces";
import Tile from "./Tile";

type PostExclUser = Omit<IPost, "user">
type P = Partial<PostExclUser> & { user: Partial<IUser> } & { dateString: string } & { id: string }

interface P2 {
    posts: P[],
    page: number,
    pageMax: number,
    changePage(num: -1 | 1): Promise<void>
}

export default function PostList(props: P2) {
    const {posts, page, pageMax, changePage} = props;
    return (
        <>
            <div className={styles.container}>
                {posts.map((p) => <Tile key={p.id} p={p} />)}
            </div>
            <div>
                <button
                    disabled={page == 0}
                    onClick={() => changePage(-1)} >
                    Previous
                </button>
                <button
                    disabled={page  >= pageMax}
                    onClick={() => changePage(1)}
                >
                    Next
                </button>
            </div>
        </>
    )
}

import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import styles from "../../styles/Posts.module.css"
import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../_app";
import { IPost, IUser } from "../../utils/interfaces";
import ConnectToMySQL from "../../utils/ConnectToMySQL";

type PostExclUser = Omit<IPost, "user">
type P = Partial<PostExclUser> & {user: Partial<IUser>}  & {id: string}

interface Props {
    posts: any[]
}

function Tile({ p }: {p: P}) {
    return (
        <Link href={`/posts/${p.id}`}>
            <a>
                <div className={styles.tile}>
                    <h3>{p.title}</h3>
                    <img src={p.image} alt={`${p.title} image`} />
                </div>
            </a>
        </Link>
    )
}


export default function Posts({ posts }: Props) {
    const user = useContext(UserContext)?.user
    return (
        <>
            <h2> {user ? <Link href={"/posts/new"}>Post A Meme</Link> : <Link href={"/auth"} >Signup or Login to post</Link>} </h2>

            <div className={styles.container}>
                <div className={styles.panel}>
                    {posts.map((p, idx) => {
                        if (idx % 2 == 0) {
                            return <Tile key={p.image} p={p} />
                        }
                    })}
                </div>
                <div className={styles.panel}>
                    {posts.map((p, idx) => {
                        if (idx % 2 == 1) {
                            return <Tile key={p.image} p={p} />
                        }
                    })}
                </div>
            </div>
        </>
    )
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<Props>> {
    const connection = await ConnectToMySQL()
    await connection.connect()

    const [result] = await connection.query(`SELECT * FROM posts ORDER BY date DESC;`) as [Array<any>, any]
    connection.end()
    const posts = result.map(p => ({
        id: p.post_id,
        title: p.title,
        description: p.description,
        date: p.date.toISOString(),
        image: p.image,
        username: p.username
    }))

    return {
        props: {
            posts
        },
        revalidate: 60
    }
}
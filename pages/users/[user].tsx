import { GetStaticPathsContext, GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from "next";
import styles from "../../styles/Posts.module.css"
import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../_app";
import Profile from "../../components/Profile";
import ConnectToMySQL from "../../utils/ConnectToMySQL";
import { IUser } from "../../utils/interfaces";

interface P {
    posts?: any[],
    pageUser: any
}

function Tile({ p }: any) {
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

export default function UserPosts(props: P) {
    const { posts, pageUser } = props
    const username = useContext(UserContext)?.user?.username
    return (
        <>
            <Profile pageUser={pageUser} />

            <h2>{`${pageUser.username}'s Memes`}</h2>
            <div className={styles.container}>
                <div className={styles.panel}>
                    {posts!.map((p, idx) => {
                        if (idx % 2 == 0) {
                            return <Tile key={p.image} p={p} />
                        }
                    })}
                </div>
                <div className={styles.panel}>
                    {posts!.map((p, idx) => {
                        if (idx % 2 == 1) {
                            return <Tile key={p.image} p={p} />
                        }
                    })}
                </div>
            </div>
        </>
    )
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<P>> {
    let user = context.params?.user as string
    user = user.toLowerCase();
    const connection = await ConnectToMySQL()
    await connection.connect()

    const [result] = await connection.query(`SELECT username, joinDate, avatar, status FROM users WHERE lowercase = '${user}';`)
    let userdoc;
    if (result instanceof Array) userdoc = result[0] as IUser

    if (!userdoc) {
        return {
            notFound: true
        }
    }
    let [posts] = await connection.query(`SELECT * FROM posts where username = (
        SELECT username FROM users WHERE lowercase = '${user}'
    );`) as [Array<any>, any]
    connection.end()

    posts = posts.map(p => ({
        id: p.post_id,
        username: p.username,
        date: p.date.toISOString(),
        title: p.title,
        image: p.image,
        description: p.description
    }))

    const { username, avatar, joinDate, status = null } = userdoc
    let pageUser = { username, avatar, status, joinDate: joinDate.toUTCString(), memes: posts.length }

    return {
        props: {
            posts,
            pageUser
        },
        revalidate: 60
    }
}

export async function getStaticPaths(context: GetStaticPathsContext): Promise<GetStaticPathsResult> {
    const connection = await ConnectToMySQL()
    await connection.connect()

    const [users] = await connection.query(`SELECT username FROM users;`) as [Array<IUser>, any]

    let paths = users.map(user => ({
        params: { user: user.username }
    }))
    return {
        paths,
        fallback: "blocking"
    }
}
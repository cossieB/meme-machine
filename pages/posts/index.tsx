import mongoose from "mongoose";
import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { Posts as PostsModel } from '../../utils/schema';
import styles from "../../styles/Posts.module.css"
import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../_app";
import { IPost, IUser } from "../../utils/interfaces";

type PostExclUser = Omit<IPost, "user">
type P = Partial<PostExclUser> & {user: Partial<IUser>} & {dateString: string} & {id: string}

interface Props {
    posts: P[]
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
    await mongoose.connect(process.env.MONGO_URI!).catch(e => console.log(e))
    let data = await PostsModel.find().sort({date: "desc"}).exec()
    mongoose.connection.close()

    let posts = data.map(p => {
        return {
            title: p.title,
            image: p.image,
            description: p.description,
            dateString: p.date.toISOString(),
            likes: p.likes,
            id: p.id,
            user: {
                username: p.user.username,
                avatar: p.user.avatar
            }
        }
    })
    return {
        props: {
            posts
        },
        revalidate: 60
    }
}
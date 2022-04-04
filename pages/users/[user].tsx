import mongoose from "mongoose";
import { GetStaticPathsContext, GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from "next";
import { Posts, Posts as PostsModel, Users } from '../../utils/schema';
import styles from "../../styles/Posts.module.css"
import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../_app";
import Profile from "../../components/Profile";

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
    await mongoose.connect(process.env.MONGO_URI!).catch(e => console.log(e))
    let userdoc = await Users.findOne({ lowercase: user })

    if (!userdoc) {
        return {
            notFound: true
        }
    }
    let postsdoc = await PostsModel.find({ "user.lowercase": user }).sort({ date: "desc" });
    mongoose.connection.close()

    const { username, avatar, joinDate, status = null } = userdoc
    let pageUser = { username, avatar, status, joinDate: joinDate.toUTCString(), memes: postsdoc.length }

    let posts = postsdoc.map(p => {
        return {
            title: p.title,
            image: p.image,
            description: p.description,
            date: p.date.toISOString(),
            likes: p.likes,
            id: p.id,
            user: {
                username: p.user.username,
            }
        }
    })
    return {
        props: {
            posts,
            pageUser
        },
        revalidate: 60
    }
}

export async function getStaticPaths(context: GetStaticPathsContext): Promise<GetStaticPathsResult> {
    await mongoose.connect(process.env.MONGO_URI!).catch(e => console.log(e))
    let users = await Users.find().exec()
    mongoose.connection.close()
    let paths = users.map(user => ({
        params: { user: user.username }
    }))
    return {
        paths,
        fallback: "blocking"
    }
}
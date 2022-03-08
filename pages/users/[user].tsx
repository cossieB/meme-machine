import mongoose from "mongoose";
import { GetStaticPathsContext, GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from "next";
import { Posts, Posts as PostsModel, Users } from '../../utils/schema';
import {User} from '../../utils/interfaces'
import styles from "../../styles/Posts.module.css"
import classes from "../../styles/users.module.css"
import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../_app";

type Optional<T> = {
    [k in keyof T]?: T[k]
}

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

function Settings() {
    return (
        <div>
            <Link href="/logout" >Logout</Link>
        </div>
    )
}

interface P1 {
    pageUser: any,
    user: string | undefined
}

function Profile({pageUser, user}: P1) {
    return (
        <div className={classes.profile}>
            <img className={classes.avatar} src={pageUser.avatar} alt={`${pageUser.username}'s Avatar`} />
            <div className={classes.info}>
                <div><h2>{pageUser.username}</h2></div>
                <div>{new Date(pageUser.joinDate).toDateString()}</div>
                <div>{pageUser.memes} memes</div>
            </div>
            {user == pageUser.username && <Settings  />}
        </div>
    )
}

export default function UserPosts(props: P) {
    const { posts, pageUser } = props
    const user = useContext(UserContext)?.user
    return (
        <>  
            <Profile pageUser={pageUser} user={user}/>
            
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
    let doc = await Users.findOne({lowercase: user})
    if (!doc) {
        return {
            notFound: true
        }
    }
    let data = await PostsModel.find({"user.lowercase": user}).sort({date: "desc"}); 
    mongoose.connection.close()

    const {username, avatar, joinDate} = doc

    let pageUser = {username, avatar, joinDate: joinDate.toUTCString(), memes: data.length}

    let posts = data.map(p => {
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
    let users = await Users.find()
    mongoose.connection.close()
    let paths = users.map(user => ({
        params: { user: user.username }
    }))
    return {
        paths,
        fallback: "blocking"
    }
}
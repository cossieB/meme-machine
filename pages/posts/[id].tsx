import { GetStaticPathsContext, GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from "next";
import { Posts } from "../../utils/schema";
import styles from '../../styles/Posts[id].module.css'
import mongoose from "mongoose";
import Link from "next/link";
import LikeAndComment from "../../components/LikeAndComment";
import Comment from "../../components/Comments";
import { useContext, useState } from "react";
import { User, Post as IPost } from "../../utils/interfaces";
import { ContextInterface, UserContext } from "../_app";
import { useRouter } from "next/router";


type PostExclUser = Omit<IPost, "user">
type P = Partial<PostExclUser> & {user: Partial<User>} & {dateString: string} & {id: string}

export default function Post(props: P) {
    const { title, image, description, user, date, id } = props
    const [rerenderChildren, setRerenderChildren] = useState(Math.random())
    const thisUser = useContext(UserContext) as ContextInterface
    const router = useRouter()

    async function deletePost() {
        let response = await fetch('/api/new-post', {
            method: "DELETE",
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({id})
        })
        let data = await response.json()
        if (data.msg == 'ok') router.replace('/posts')
    }
    return (
        <div className={`${styles.container} ${styles.postContainer}`} >
            <div className={`${styles.panel}`}>
                <h1 style={{ textAlign: "center" }}>{title}</h1>
                <div className={styles.flexApart}>
                    <div>{date}</div>
                    <Link href={'/users/' + user}><a><strong>{user.username}</strong></a></Link>
                </div>
                <img src={image} alt={`${title} image`} />
                {description && <p>{description}</p>}
                {thisUser.user == user.username && <button onClick={deletePost} className="danger">Delete</button> }
            </div>
            <div className={styles.panel}>
                <h1 style={{textAlign: "center"}}>Comments</h1>
                <LikeAndComment setRerenderChildren={setRerenderChildren} id={id} />
                <Comment id={id} rerender={rerenderChildren} />
            </div>
        </div>
    )
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<P>> {
    await mongoose.connect(process.env.MONGO_URI!).catch(e => console.log(e))
    let id = context.params!.id as string;
    let post = await Posts.findById(id).select('-user.password').catch(() => null);

    if (!post) {
        return {
            notFound: true
        }
    }

    return {
        props: {
            title: post.title,
            image: post.image,
            description: post.description,
            dateString: post.date.toISOString(),
            likes: post.likes,
            id: post.id,
            user: {
                username: post.user.username,
                avatar: post.user.avatar
            }
        }
    }
}

export async function getStaticPaths(context: GetStaticPathsContext): Promise<GetStaticPathsResult> {
    await mongoose.connect(process.env.MONGO_URI!).catch(e => console.log(e))
    let posts = await Posts.find()
    mongoose.connection.close()
    let paths = posts.map(post => ({
        params: { id: post.id }
    }))
    return {
        paths,
        fallback: "blocking"
    }
}
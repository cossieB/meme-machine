import { GetStaticPathsContext, GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from "next";
import { Posts } from "../../utils/schema";
import styles from '../../styles/Posts.module.css'
import mongoose from "mongoose";
import Link from "next/link";
import LikeAndComment from "../../components/LikeAndComment";
import Comment from "../../components/Comments";
import { useState } from "react";

interface P {
    title: string,
    image: string,
    description?: string,
    user: string,
    date: string,
    id: string,
    likes?: string[],
}

export default function Post(props: P) {
    const { title, image, description, user, date, id } = props
    const [rerenderChildren, setRerenderChildren] = useState(Math.random())
    return (
        <div className={`${styles.container} ${styles.postContainer}`} >
            <div className={`${styles.panel}`}>
                <h1 style={{ textAlign: "center" }}>{title}</h1>
                <div className={styles.flexApart}>
                    <div>{date}</div>
                    <Link href={'/users/' + user}><a><strong>{user}</strong></a></Link>
                </div>
                <img src={image} alt={`${title} image`} />
                {description && <p>{description}</p>}
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
    let post = await Posts.findById(id).catch(() => null);
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
            user: post.user.username,
            date: post.date.toDateString(),
            id: post.id
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
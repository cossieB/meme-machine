import mongoose from "mongoose";
import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { Posts as PostsModel } from '../../utils/schema';
import styles from "../../styles/Posts.module.css"
import Link from "next/link";
import { useContext, useState } from "react";
import { UserContext } from "../_app";
import { IPost, IUser } from "../../utils/interfaces";
import Loader from "../../components/Loader";
import PostList from "../../components/PostsList";

type PostExclUser = Omit<IPost, "user">
type P = Partial<PostExclUser> & { user: Partial<IUser> } & { dateString: string } & { id: string }

interface Props {
    posts: P[],
    pageMax: number
}

const postsPerPage = 25

export default function Posts(props: Props) {
    const {posts} = props
    const [page, setPage] = useState(0)
    const user = useContext(UserContext)?.user
    const [postsState, setPosts] = useState(posts)
    const [pressed, setPressed] = useState(false)
    const [pageMax, setPageMax] = useState(props.pageMax)

    async function changePage(num: -1 | 1) {
        if (page + num < 0 || page + num > pageMax) return
        setPressed(true)
        let data = await (await fetch(`/api/posts?page=${page + num}`)).json()
        setPageMax(data.pageMax)
        setPosts(data.posts)
        setPage(p => p + num)
        setPressed(false)
    }
    return (
        <>
            <h2> {user ? <Link href={"/posts/new"}>Post A Meme</Link> : <Link href={"/auth"} >Signup or Login to post</Link>} </h2>
            {pressed ?
                <Loader /> :
                <PostList posts={postsState} pageMax={pageMax} page={page} changePage={changePage} />
            }
        </>
    )
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<Props>> {

    await mongoose.connect(process.env.MONGO_URI!).catch(e => console.log(e))

    const postsQuery = PostsModel.find().sort({ date: "desc" }).limit(postsPerPage).exec()
    const countQuery = PostsModel.count()
    const [data, count] = await Promise.all([postsQuery, countQuery])

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
            posts,
            pageMax: Math.ceil(count / postsPerPage) - 1
        },
        revalidate: 60
    }
}
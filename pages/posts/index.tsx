import mongoose from "mongoose";
import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { Posts as PostsModel } from '../../utils/schema';
import styles from "../../styles/Posts.module.css"
import Link from "next/link";
import { useContext, useState } from "react";
import { UserContext } from "../_app";
import { IPost, IUser } from "../../utils/interfaces";
import Loader from "../../components/Loader";

type PostExclUser = Omit<IPost, "user">
type P = Partial<PostExclUser> & { user: Partial<IUser> } & { dateString: string } & { id: string }

interface Props {
    posts: P[],
    pageMax: number
}

const postsPerPage = 25

function Tile({ p }: { p: P }) {
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
            {pressed ? <Loader /> :
                <>
                    <div className={styles.container}>
                        {postsState.map((p) => <Tile key={p.id} p={p} />)}
                    </div>
                    <div>
                        <button
                            disabled={page == 0}
                            onClick={() => changePage(-1)} >
                            Previous
                        </button>
                        <button
                            disabled={page + 1 >= pageMax}
                            onClick={() => changePage(1)}
                        >
                            Next
                        </button>
                    </div>
                </>
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
            pageMax: Math.floor(count / postsPerPage)
        },
        revalidate: 60
    }
}
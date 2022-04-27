import mongoose from "mongoose";
import { GetStaticPathsContext, GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from "next";
import { Posts, Posts as PostsModel, Users } from '../../utils/schema';
import styles from "../../styles/Posts.module.css"
import Link from "next/link";
import { useContext, useState } from "react";
import { UserContext } from "../_app";
import Profile from "../../components/Profile";
import Loader from "../../components/Loader";
import { IPost, IUser, UserPick } from "../../utils/interfaces";

type PostExclUser = Omit<IPost, "user">
type P = Partial<PostExclUser> & { user: Partial<IUser> } & { dateString: string } & { id: string }

interface Props {
    posts: P[],
    pageMax: number,
    pageUser: Pick<IUser, "username" | "avatar" | "status"> & {dateString: string}
}

const postsPerPage = 3;

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

export default function UserPosts(props: Props) {
    const { posts, pageUser } = props;
    const [page, setPage] = useState(0)
    const username = useContext(UserContext)?.user?.username
    const [postsState, setPosts] = useState(posts)
    const [pressed, setPressed] = useState(false)
    const [pageMax, setPageMax] = useState(props.pageMax)

    async function changePage(num: -1 | 1) {
        if (page + num < 0 || page + num > pageMax) return
        setPressed(true)
        let data = await (await fetch(`/api/posts?page=${page + num}&username=${pageUser.username}`)).json()
        setPageMax(data.pageMax); console.log(data.pageMax)
        setPosts(data.posts)
        setPage(p => p + num)
        setPressed(false)
    }
    return (
        <>
            <Profile pageUser={pageUser} />

            <h2>{`${pageUser.username}'s Memes`}</h2>
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
    
    let user = context.params?.user as string
    user = user.toLowerCase();
    await mongoose.connect(process.env.MONGO_URI!).catch(e => console.log(e))
    let userdoc = await Users.findOne({ lowercase: user })

    if (!userdoc) {
        return {
            notFound: true
        }
    }
    let postsdoc = await PostsModel.find({ "user.lowercase": user }).sort({ date: "desc" }).limit(postsPerPage).exec();
    let count = await PostsModel.count({ "user.lowercase": user });
    mongoose.connection.close()

    const { username, avatar, joinDate, status } = userdoc
    let pageUser = { username, avatar, status, dateString: joinDate.toUTCString(), memes: postsdoc.length }

    let posts = postsdoc.map(p => {
        return {
            title: p.title,
            image: p.image,
            description: p.description,
            dateString: p.date.toISOString(),
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
            pageUser,
            pageMax: Math.floor(count / postsPerPage),
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
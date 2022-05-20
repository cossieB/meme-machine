import { GetStaticPathsContext, GetStaticPathsResult, GetStaticPropsResult } from "next";
import Link from "next/link";
import { useState } from "react";
import styles from '../../styles/Posts.module.scss'

export interface Posts {
    userId: number,
    id: number,
    title: string,
    body: string
}


interface PostProps {
    posts: Posts[]
}

type Paths = Array<string | {
    params: {id: number};
    locale?: string;
}>

export default function Posts({ posts }: PostProps) {
    const [page, setPage] = useState(0)
    const [showPosts, setShowPosts] = useState(posts)
    const [loading, setLoading] = useState(false)
    
    async function getPosts(p: number) {
        let response = await fetch(`https://jsonplaceholder.typicode.com/posts?_start=${10 * p}&_limit=10`)
        let data: Posts[] = await response.json();
        setShowPosts(data)
        setLoading(false)
    }
    function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
        let value = Number(e.currentTarget.value)
        setPage(p => p + value)
        setLoading(true)
        getPosts(page + value)
    }
    return (
        <div>
            {showPosts.map(post =>
                <div key={post.id} className={styles.card}>
                    <Link href={`/posts/${post.id}`}>{post.title}</Link>
                </div>)
            }
            <button value={-1}  disabled={page==0 || loading} onClick={handleClick} >Previous</button> &nbsp;
            <button value={1} disabled={loading} onClick={handleClick} >Next</button>
        </div>
    )
}

export async function getStaticProps(): Promise<GetStaticPropsResult<PostProps>> {
    let posts: Posts[] = []
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10');
        posts = await response.json()
    }
    catch (e: any) {
        console.log(e.message)
    }
    return {
        props: { posts },
        revalidate: false
    }
}
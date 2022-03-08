import { GetStaticPathsContext, GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from "next";
import {Posts } from './index'

interface PostProps {
    post: Posts
}

export default function Post(props: PostProps) {
    const {post} = props
    return (
        <div>
            <h1>{post.title}</h1>
            <p>{post.body}</p>
        </div>
    )
}

export async function getStaticPaths(context: GetStaticPathsContext): Promise<GetStaticPathsResult> {
    let paths: any[] = [];

    try {
        let response = await fetch('https://jsonplaceholder.typicode.com/posts/')
        let data: Posts[] = await response.json();
        paths = data.map(post => {
            return {params: {
                id: String(post.id)
            }}
        })
    }
    catch(e) {
        console.log(e)
    }

    return {
        paths,
        fallback: 'blocking'
    }
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<PostProps>> {

    let id = context.params!.id

    let response = await fetch('https://jsonplaceholder.typicode.com/posts/' + id)
    let post = await response.json()

    return {
        props: {post}
    }
}
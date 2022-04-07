import { GetStaticPathsContext, GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from "next";
import styles from '../../styles/Posts[id].module.css'
import Link from "next/link";
import LikeAndComment from "../../components/LikeAndComment";
import Comment from "../../components/Comments";
import { useContext, useState } from "react";
import { IUser, IPost, IUserContext } from "../../utils/interfaces";
import { UserContext } from "../_app";
import { useRouter } from "next/router"
import DeletePost from "../../components/DeletePost";
import Mask from "../../components/Mask";
import EditPost from "../../components/EditPost";
import ConnectToMySQL from "../../utils/ConnectToMySQL";


type PostExclUser = Omit<IPost, "user">
type P = Partial<PostExclUser> & { user: Partial<IUser> } & { id: string }

export default function Post(props: any) {
    const { title, image, description, username, date, id } = props
    const [rerenderChildren, setRerenderChildren] = useState(Math.random())
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const thisUser = useContext(UserContext) as IUserContext
    const router = useRouter()

    return (
        <div className={`${styles.container} ${styles.postContainer}`} >

            <div className={`${styles.panel}`}>
                <h1 style={{ textAlign: "center" }}>{title}</h1>

                <div className={styles.flexApart}>
                    <div>{new Date(date!).toUTCString()}</div>
                    <Link href={'/users/' + username}><a><strong>{username}</strong></a></Link>
                </div>

                <img src={image} alt={`${title} image`} />

                {thisUser.user?.username == username && (
                    <div className="flexApart">
                        <button onClick={() => setShowEditModal(true)}>Edit</button>
                        <button onClick={() => setShowDeleteModal(true)} className="danger">Delete</button>
                    </div>
                )}
                {description && <p>{description}</p>}
            </div>

            <div className={styles.panel}>
                <h1 style={{ textAlign: "center" }}>Comments</h1>
                <LikeAndComment setRerenderChildren={setRerenderChildren} id={id} />
                <Comment id={id} rerender={rerenderChildren} />
            </div>

            {showDeleteModal && (
                <>
                    <Mask showModal={setShowDeleteModal}>
                        <DeletePost id={id} title={title!} showModal={setShowDeleteModal} />
                    </Mask>
                </>
            )}
            {showEditModal && (
                <>
                    <Mask showModal={setShowEditModal}>
                        <EditPost id={id} description={description} title={title!} image={image!} showModal={setShowEditModal} />
                    </Mask>
                </>
            )}
        </div>
    )
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<P>> {
    const connection = await ConnectToMySQL()
    await connection.connect()
    let id = context.params!.id as string;
    const [result] = await connection.query(`SELECT * FROM posts WHERE post_id = '${id}';`) as [Array<any>, any]
    let post = result[0]

    if (!post) {
        return {
            notFound: true
        }
    }
    post = {...post, date: post.date.toISOString()}
    return {
        props: {...post, id}
    }
}

export async function getStaticPaths(context: GetStaticPathsContext): Promise<GetStaticPathsResult> {
    const connection = await ConnectToMySQL()
    await connection.connect()    

    const [posts] = await connection.query(`SELECT * FROM posts`) as [Array<any>, any]
    connection.end()

    let paths = posts.map(post => ({
        params: { id: String(post.post_id) }
    }))
    return {
        paths,
        fallback: "blocking"
    }
}
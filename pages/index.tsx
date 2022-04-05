import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useContext } from 'react'
import styles from '../styles/Home.module.css'
import { UserContext } from './_app'

export default function Home() {
    const user = useContext(UserContext)?.user
    return (
        <div className='container flexColumn' >
            {user ?
                <div className={styles.links}>
                    <h2><Link href="/posts" >See What&apos;s New</Link></h2>
                    <h2><Link href="/posts/new" >Post New Meme</Link></h2>
                    <h2><Link href={`users/${user.username}`}  >Edit Your Profile</Link> </h2>
                </div>: 
                <div className={styles.links}>
                    <h2><Link href="/posts" >Browse Memes</Link></h2>
                    <h2><Link href="/auth" >Sign up or log in to upload a meme</Link></h2>
                </div>
                }
                {user ? <img className={styles.img} src='https://i.imgur.com/db93F7b.jpg' alt='Oprah Welcome Back Meme' /> : <img className={styles.img} src="https://i.imgur.com/3I2Fw1P.png" alt="Uncle Sam sign up meme" />}
        </div>
    )
}
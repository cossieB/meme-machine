import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useContext } from 'react'
import styles from '../styles/Home.module.scss'
import { UserContext } from './_app'

export default function Home() {
    const user = useContext(UserContext)?.user
    return (
        <div className='container flexColumn' >
            {user ?
                <div className={styles.links}>
                    <h2 className='label-header' ><Link href="/posts" >See What&apos;s New</Link></h2>
                    <h2 className='label-header' ><Link href="/posts/new" >Post New Meme</Link></h2>
                    <h2 className='label-header' ><Link href={`users/${user.username}`}  >Edit Your Profile</Link> </h2>
                </div> :
                <div className={styles.links}>
                    <Link href="/posts" >
                        <a>
                            <h2 style={{ alignItems: 'center' }} className='label-header'>

                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-columns-gap" viewBox="0 0 16 16">
                                        <path d="M6 1v3H1V1h5zM1 0a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1H1zm14 12v3h-5v-3h5zm-5-1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-5zM6 8v7H1V8h5zM1 7a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H1zm14-6v7h-5V1h5zm-5-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1h-5z" />
                                    </svg>
                                    Browse
                                </>
                            </h2>
                        </a>
                    </Link>
                    <Link href={"/auth"}>
                        <a>
                            <h2 style={{ alignItems: 'center' }} className='label-header'>
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-unlock-fill" viewBox="0 0 16 16">
                                        <path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2z" />
                                    </svg>
                                    Login
                                </>
                            </h2>
                        </a>
                    </Link>
                </div>
            }
            {user ? <img className={styles.img} src='https://i.imgur.com/db93F7b.jpg' alt='Oprah Welcome Back Meme' /> : <img className={styles.img} src="https://i.imgur.com/3I2Fw1P.png" alt="Uncle Sam sign up meme" />}
        </div>
    )
}
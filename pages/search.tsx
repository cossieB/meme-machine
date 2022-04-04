import { ChangeEvent, useEffect, useState } from "react"
import { IPost } from "../utils/interfaces"
import styles from '../styles/search.module.css'
import Link from "next/link"

export default function Search() {
    const [searchTerm, setSearchTerm] = useState("")
    const [fromDate, setFromDate] = useState('2022-01-01')
    const [toDate, setToDate] = useState(formatDate(new Date()))
    const [posts, setPosts] = useState<IPost[] | null>(null)

    function formatDate(date: Date) {
        let year = date.getFullYear();

        let month = `0${date.getMonth() + 1}`;
        if (month.length > 2) month = month.slice(1);

        let day = `0${date.getDate()}`;
        if (day.length > 2) day = day.slice(1);

        return `${year}-${month}-${day}`;
    }

    async function handleSubmit(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault()
        let response = await fetch('/api/search', {
            method: 'POST',
            body: JSON.stringify({searchTerm, fromDate, toDate}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        let data = await response.json()
        if (data.posts) setPosts(data.posts); 
    }

    return (
        <div className="container flexColumn">
            <form style={{ width: '90%', maxWidth: '500px', marginTop: '1rem' }} onSubmit={handleSubmit} >
                <label htmlFor="searchField">Search</label>
                <input type="text" placeholder="Search"
                    minLength={4}
                    required
                    value={searchTerm}
                    onChange={e => {setSearchTerm(e.target.value)}}
                />
                <label htmlFor="fromDate">From</label>
                <input
                    type="date"
                    name="fromDate"
                    id="fromDate"
                    value={fromDate}
                    onChange={e => setFromDate(e.target.value)}
                />
                <label htmlFor="toDate">To</label>
                <input
                    type="date"
                    name="toDate"
                    id="toDate"
                    value={toDate}
                    onChange={e => setToDate(e.target.value)}
                />
                <button type="submit">Go</button>
            </form>
            {posts && posts.length > 0 && 
                <div className={styles.result} style={{width: '100%', marginTop: '1rem'}}>
                    {posts.map(post => 
                        <div key={post._id.toString()} className={styles.searchResults} >
                            <Link href={`../posts/${post._id.toString()}`}><a><img src={post.image} /></a></Link>
                            <div className={styles.links}>
                                Post Title: <Link href={`../posts/${post._id.toString()}`}><a>{post.title}</a></Link><br />
                                Posted By: <Link href={`../users/${post.user.username}`}><a>{post.user.username}</a></Link>
                            </div>
                        </div>
                        )}
                </div>
            }
            {posts && posts.length == 0 &&
                <div>Sorry your search returned no results.</div>
            }
        </div>
    )
}
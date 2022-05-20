import React, { useContext, useState } from 'react';
import { UserContext } from '../pages/_app';
import styles from '../styles/profile.module.scss'
import { IUserContext } from '../utils/interfaces';

export default function Settings() {
    const {user, setUser} = useContext(UserContext) as IUserContext
    const [avatar, setAvatar] = useState(user?.avatar || "")
    const [status, setStatus] = useState(user?.status || "")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    
    async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
        e.preventDefault()
        let res = await fetch('/api/register', {
            method: "PUT",
            body: JSON.stringify({avatar, status}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        let data = await res.json()

        if (data.error) return setError(data.error)
        if (data.user) {
            setSuccess(true)
            document.cookie = `user=${JSON.stringify(data.user)}`
            setUser(data.user)
        }
    }

    return (
        <div className={styles.main} >
            <h3>Settings</h3>
            <form style={{width: '100%'}} onSubmit={handleSubmit} >
                <label htmlFor="setAvatar">Change Avatar</label>
                <input
                    type="text"
                    name="setAvatar"
                    value={avatar}
                    onChange={(e) => {
                        setAvatar(e.target.value)
                        setError("")
                        setSuccess(false)
                    }}
                />
                <label htmlFor="setStatus">Change Status</label>
                <textarea className={styles.status}
                    name="setStatus"
                    value={status}
                    onChange={e => {
                        setStatus(e.target.value)
                        setError("")
                        setSuccess(false)                        
                    }}
                />
                <button type="submit">Submit</button>
            </form>
            {error && <div className='error'> {error} </div>  }
            {success && <div>Your settings have been successfully changed! </div> }
        </div>
    )
}
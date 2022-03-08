import { useState } from "react"
import styles from '../styles/Auth.module.css'
import { useRouter } from "next/router"

export default function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [errorMsg, setErrorMsg] = useState<string[]>([])
    const router = useRouter()

    async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
        e.preventDefault();
        const {redirect} = router.query
        try {
            let response = await fetch('/api/login', {
                method: "POST",
                body: JSON.stringify({username, password}),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            let data = await response.json(); console.log(response.status)
            if (data.errors) return setErrorMsg(data.errors)
            document.cookie = `user=${data.username}`
            router.replace(redirect ? "/"+ redirect : "/users/"+data.username)
        }
        catch(e) {
            console.log(e)
        }
    }

    return (
        <div className="flexColumn" style={{width: "100%"}}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <label htmlFor="loginUsername">Username</label>
                <input
                    className={styles.input}
                    id="loginUsername"
                    type="text"
                    name="loginUsername"
                    placeholder="Username"
                    required
                    value={username}
                    onChange={e => {
                        setUsername(e.target.value);
                        setErrorMsg([])
                    }}
                    />
                <label htmlFor="loginPassword">Password</label>
                <input
                    className={styles.input}
                    id="loginPassword"
                    type="password"
                    name="loginPassword"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={e => {
                        setPassword(e.target.value);
                        setErrorMsg([])
                    }}
                    />
                <button type="submit">Submit</button>
            </form>
            {errorMsg.length > 0 &&
                <ul className={styles.errorDiv}>
                    {errorMsg.map(error => <li key={error}>{error}</li>)}
                </ul>
            }
        </div>
    )
}
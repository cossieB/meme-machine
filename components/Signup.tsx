import { useState } from "react"
import {validateInput} from "../utils/validate"
import styles from '../styles/auth.module.css'
import { useRouter } from "next/router"

interface P {
    redirect: string | string[] | undefined
}

export default function Signup() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [errorMsg, setErrorMsg] = useState<string[]>([])
    const router = useRouter()
    
    function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
        e.preventDefault()
        const errors = validateInput(username, password, password2);
        if (errors.length == 0) return submitCredentials();
        setErrorMsg(errors)
    }
    async function submitCredentials() {
        const {redirect} = router.query
        try {
            let response = await fetch("/api/register", {
                method: "POST",
                body: JSON.stringify({ username, password }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            let data = await response.json();
            if (data.errors) {
                return setErrorMsg(data.errors)
            }
            document.cookie = `user=${username}`
            router.replace(redirect ? "/"+redirect :"/users/"+username)
        }
        catch (e: any) {
            console.log(e)
        }
    }
    
    return (
        <div className="flexColumn" style={{ width: "100%" }}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <label htmlFor="signupUsername">Username</label>
                <input
                    value={username}
                    onChange={(e) => {
                        setErrorMsg([])
                        setUsername(e.target.value)
                    }}
                    className={styles.input}
                    id="signupUsername" type="text"
                    name="signupUsername"
                    placeholder="Username"
                    required
                />
                <label htmlFor="signupPassword">Password</label>
                <input value={password}
                    onChange={(e) => {
                        setErrorMsg([])
                        setPassword(e.target.value)
                    }}
                    className={styles.input}
                    id="signupPassword"
                    type="password"
                    name="signupPassword"
                    placeholder="Password"
                    required
                />
                <label htmlFor="signupPassword2">Confirm Password</label>
                <input value={password2}
                    onChange={(e) => {
                        setErrorMsg([])
                        setPassword2(e.target.value)
                    }}
                    className={styles.input}
                    id="signupPassword2"
                    type="password"
                    name="signupPassword2"
                    placeholder="Confirm Password"
                    required
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
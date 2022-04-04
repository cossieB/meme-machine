import { CSSProperties, useContext, useRef, useState } from "react"
import {validateInput} from "../utils/validate"
import styles from '../styles/Auth.module.css'
import { useRouter } from "next/router"
import { UserContext } from "../pages/_app"
import { IUserContext } from "../utils/interfaces"

interface P {
    redirect: string | string[] | undefined
}

export default function Signup() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [errorMsg, setErrorMsg] = useState<string[]>([])
    const ref = useRef<SVGSVGElement>(null)
    const router = useRouter()
    const {setUser} = useContext(UserContext) as IUserContext
    
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
            if (data.user) {
                document.cookie = `user=${JSON.stringify(data.user)}`
                setUser(data.user)
                router.replace(redirect ? "/"+redirect :"/users/"+username)
            }
        }
        catch (e: any) {
            console.log(e)
        }
    }
    let score = passwordStrength(password)
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
            {password && fill(score)[0]} <br />
            <svg ref={ref} width={'100%'} height={30}>
                <rect style={{fill: fill(score)[1]}} height={10} width={Math.round(Math.max(0,Math.min(score, 100) / 100 * Number(ref.current?.width.baseVal.value)) || 0 )}  />
            </svg>
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
                <button type="submit">Submit</button><br />
            </form>
            
            {errorMsg.length > 0 &&
                <ul className={styles.errorDiv}>
                    {errorMsg.map(error => <li key={error}>{error}</li>)}
                </ul>
            }
        </div>
    )
}

function passwordStrength(pass: string) {
    let score = 0;
    let letters: {[key: string]: number} = {}

    for (let letter of pass) {
        letters[letter] = (letters[letter] || 0) + 1;
        score += 5 / letters[letter]
    }
    
    let regex = [/\d/, /[a-z]/, /[A-Z]/, /[^\da-zA-Z]/]

    let variation = 0;
    regex.forEach(reg => {
        variation += (reg.test(pass) ? 1 : 0)
    })

    score += (variation - 1) * 10

    return score
}

function fill(score: number) {
    
    if (score >= 100) return ["very strong", "darkgreen"]
    if (score >= 80) return ["strong", "green"]
    if (score >= 60) return ["good", "yellow"]
    if (score >= 30) return ["weak", "orange"]
    else return ["very weak", "red"]

}
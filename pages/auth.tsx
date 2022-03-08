import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { useRouter } from "next/router"
import React, { useState } from "react"
import Login from "../components/Login"
import Signup from "../components/Signup"
import { getServerSideUser } from "../utils/getServerSideUser"

type Action = "login" | "signup"
interface P {
    user: string | null,
    action: Action
}

export default function Auth(props: P) {
    const router = useRouter()
    const [action, setAction] = useState<Action>(props.action || "signup") 
    
    return (
        <div className="container" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ textAlign: "center" }}>
                <h1>{action == "signup" ? "Sign Up" : "Login"}</h1>
                <button onClick={() => action == "login" ? setAction("signup") : setAction("login")} >{action == "login" ? "Don't have an account? Click here to sign up." : "Already have an account? Click here to log in."}</button>
            </div>
            {action == "signup" ? <Signup /> : <Login />}
        </div>
    )
}

export function getServerSideProps(context: GetServerSidePropsContext): GetServerSidePropsResult<P> {
    let action = context.query.action as Action 

    if (action != "login" && action != "signup") {
        action = "signup"
    }
    const user = getServerSideUser(context)
    
    if (user) {
        return {
            redirect: {destination: "/"+user, permanent: false}
        }
    }
    return {
        props: {user, action}
    }
}


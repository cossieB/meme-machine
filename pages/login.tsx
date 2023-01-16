import { useSession, signIn, signOut } from "next-auth/react"

export default function Login() {
  const { data: session } = useSession()
  if (session) {
    return (
      <div className="flex items-start justify-center">
        Signed in as {session.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    )
  }
  return (
    <div className="flex items-center h-full justify-center">
      <div className="flex flex-col">
        Not signed in <br />
        <button className="bg-green-500" onClick={() => signIn()}>Sign in</button>
      </div>
    </div>
  )
}
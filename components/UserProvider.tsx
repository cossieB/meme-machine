import { useSession } from "next-auth/react"
import { useState } from "react"
import { useLocalStorage } from "../hooks/useLocalStorage"
import { ContextUser, UserContext } from "../hooks/userContext"
import { trpc } from "../utils/trpc"

type Props = {
    children: React.ReactNode
}

export default function UserProvider({children}: Props) {
    const {storage, updateLocalStorage} = useLocalStorage<ContextUser>('user');
    const {data: session} = useSession()
    const [user, setUser] = useState<ContextUser | null>(() => session ? storage ?? null : null)

    trpc.user.getMyInfo.useQuery(undefined, {
        onSuccess(data) {
            console.log(data)
            setUser(data)
            updateLocalStorage(data)
        },
        retry(failureCount, error) {
            return error.data?.httpStatus != 401 && failureCount < 3
        },
        refetchOnWindowFocus: false, 
    })
    return (
        <UserContext.Provider value={{user, setUser}} >
            {children}
        </UserContext.Provider>
    )
}
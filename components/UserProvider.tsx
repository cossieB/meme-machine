import { useState } from "react"
import { useLocalStorage } from "../hooks/useLocalStorage"
import { ContextUser, UserContext } from "../hooks/userContext"
import { trpc } from "../utils/trpc"

type Props = {
    children: React.ReactNode
}

export default function UserProvider({children}: Props) {
    const [user, setUser] = useState<ContextUser | null>(null)
    const {storage, updateLocalStorage} = useLocalStorage<ContextUser>('user')
    trpc.getMyInfo.useQuery(undefined, {
        onSuccess(data) {
            setUser(data)
            updateLocalStorage(data)
        },
        onError(err) {
            if (storage) setUser(storage)
        },
        retry(failureCount, error) {
            return error.data?.httpStatus != 401 && failureCount < 3
        },
    })
    return (
        <UserContext.Provider value={{user, setUser}} >
            {children}
        </UserContext.Provider>
    )
}
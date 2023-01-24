import { UserDto } from "../../types/DTOs"
import UserSummary from "./UserSummary"

type P = {
    users: UserDto[]
}

export default function UserList({users}: P) {
    return (
        <div className="grid grid-cols-3" >
            {users.map(user => <UserSummary key={user.id} user={user} /> )}
        </div>
    )
}


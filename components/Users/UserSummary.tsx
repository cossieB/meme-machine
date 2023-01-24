import Link from "next/link"
import { UserDto } from "../../types/DTOs"

type P = {
    user: UserDto
}

export default function UserSummary({ user }: P) {
    return (
        <Link href={`/users/${user.username}`}>
            <a>
                <div className="grid grid-cols-2 lg:grid-cols-6">
                    <img className="rounded-full aspect-square row-span-3" src={user.image} alt={user.username} />
                    <span className="col-start-2"> {user.username} </span>
                    <span className="col-start-2"> {user.joinDate.toLocaleString('en-za', { dateStyle: 'medium' })} </span>
                    <span className="col-start-2" > {user.status} </span>
                </div>
            </a>
        </Link>
    )
}
import Link from "next/link";

interface P1 {
    pageUser: any,
    user: string | undefined
}

export default function Profile({pageUser, user}: P1) {
    return (
        <div >
            <img  src={pageUser.avatar} alt={`${pageUser.username}'s Avatar`} />
            <div >
                <div><h2>{pageUser.username}</h2></div>
                <div>{new Date(pageUser.joinDate).toDateString()}</div>
                <div>{pageUser.memes} memes</div>
            </div>
        </div>
    )
}
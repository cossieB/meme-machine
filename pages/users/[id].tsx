import { useRouter } from "next/router"
import { useContext } from "react"
import Loader from "../../components/Loading/Loader"
import MemeList from "../../components/Memes/MemeList"
import ActionButton from "../../components/Nav/ActionButton"
import { NavItem } from "../../components/Nav/SideBarIcon"
import { UserContext } from "../../hooks/userContext"
import { formatDate } from "../../lib/formatDate"
import { editSvg, followSvg } from "../../utils/svgs"
import { trpc } from "../../utils/trpc"

export default function UserPage() {
    const router = useRouter()
    const { user } = useContext(UserContext)!
    const query = trpc.user.getUser.useQuery(router.query.id as string, {
        enabled: !!router.query.id
    })
    const memesQuery = trpc.meme.getMemes.useQuery({
        creator: router.query.id as string
    }, {
        enabled: !!router.query.id
    })
    return (
        <div>
            <Loader loading={query.isLoading} >
                <>
                    <div className="w-full h-60" style={{ background: 'teal' }}>
                        <img className="rounded-full h-40 aspect-square absolute translate-y-40 translate-x-5 object-cover" src={query.data?.image ?? ""} alt={query.data?.username} />
                    </div>
                    <div className="right-0 absolute">
                        {true && // <----- replace with user.username != query.data?.user.username
                            <ActionButton
                                onClick={() => console.log("Send follow mutation")}
                            >
                                <NavItem
                                    icon={followSvg}
                                    text="Follow"
                                />
                            </ActionButton>
                        }
                    </div>
                    <div className="mt-20 text-center">
                        <h1 className="font-semibold text-3xl" > {query.data?.username} </h1>
                        <span>Status:  {query.data?.status} </span> <br />
                        <span>Joined: {formatDate(query.data?.joinDate ?? "")} </span>
                    </div>
                </>
            </Loader>
            <Loader loading={memesQuery.isLoading} >
                <MemeList
                    posts={memesQuery.data?.map(item => ({ ...item, creationDate: new Date(item.creationDate) })) ?? []}
                />
            </Loader>
        </div>
    )
}
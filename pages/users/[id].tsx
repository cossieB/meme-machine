import { useRouter } from "next/router"
import { useContext, useState } from "react"
import Loader from "../../components/Loading/Loader"
import Follow from "../../components/UserQueries/Follow"
import { UserContext } from "../../hooks/userContext"
import { formatDate } from "../../lib/formatDate"
import { trpc } from "../../utils/trpc"
import NotFound from "../404"
import Tabs from "../../components/Tabs/Tabs"
import UserList from "../../components/Users/UserList"
import MemesWithPaginator from "../../components/Memes/MemesWithPaginator"

export default function UserPage() {
    const router = useRouter()
    const { user } = useContext(UserContext)!
    const tabs = ['memes', 'likes', 'following', 'followers']
    const [tab, setTab] = useState('memes')
    const [page, setPage] = useState(0)

    const userQuery = trpc.user.getUser.useQuery(router.query.id as string, {
        enabled: !!router.query.id,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        retry(failureCount, error) {
            return failureCount < 3 && error.data?.httpStatus != 404
        }
    })
    const memesQuery = trpc.meme.getMemes.useQuery({ creator: router.query.id as string, page }, {
        enabled: !!router.query.id && tab == 'memes',
        refetchInterval: false,
        refetchOnWindowFocus: false,
        retry(failureCount, error) {
            return failureCount < 3
        }
    })
    const likesQuery = trpc.like.byUser.useQuery({ username: router.query.id as string, page }, {
        enabled: !!router.query.id && tab == 'likes',
        refetchInterval: false,
        refetchOnWindowFocus: false,
        retry(failureCount, error) {
            return failureCount < 3
        }
    })
    const followQuery = trpc.follow.followingWho.useQuery(router.query.id as string, {
        enabled: !!router.query.id && tab == 'following',
        refetchInterval: false,
        refetchOnWindowFocus: false,
        retry(failureCount, error) {
            return failureCount < 3
        }
    })
    const followerQuery = trpc.follow.followedBy.useQuery(router.query.id as string, {
        enabled: !!router.query.id && tab == 'followers',
        refetchInterval: false,
        refetchOnWindowFocus: false,
        retry(failureCount, error) {
            return failureCount < 3
        }
    })

    return (
        userQuery.error?.data?.httpStatus == 404 ? <NotFound /> :
            <div>
                <Loader loading={userQuery.isLoading} >
                    <>
                        <div className="w-full h-60 bg-center bg-cover bg-no-repeat" style={{ backgroundImage: `url(${userQuery.data?.banner})` }}>
                            <img className="rounded-full h-20 md:h-40 aspect-square absolute translate-y-52 md:translate-y-40 translate-x-5 object-cover" src={userQuery.data?.image ?? ""} alt={userQuery.data?.username} />
                        </div>
                        <div className="right-0 absolute">
                            {user?.username != userQuery.data?.username &&
                                <Follow userId={userQuery.data?.id ?? ""} />
                            }
                        </div>
                        <div className="mt-20 text-center">
                            <h1 className="font-semibold text-3xl" > {userQuery.data?.username} </h1>
                            <span>Status:  {userQuery.data?.status} </span> <br />
                            <span>Joined: {formatDate(userQuery.data?.joinDate ?? "")} </span>
                        </div>
                    </>
                </Loader>
                <Tabs
                    setValue={setTab}
                    tabs={tabs}
                    value={tab}
                />
                <Loader
                    loading={
                        (tab == 'memes' && memesQuery.isLoading)
                        || (tab == 'likes' && likesQuery.isLoading)
                        || (tab == 'following' && followQuery.isLoading)
                        || (tab == 'followers' && followerQuery.isLoading)
                    }
                >
                    {tab == 'memes' || tab == 'likes' ?
                        <MemesWithPaginator
                            isLastPage={(tab == 'memes' ? memesQuery : likesQuery).data?.isLastPage || false}
                            isLoading={(tab == 'memes' ? memesQuery : likesQuery).isLoading}
                            page={page}
                            setPage={setPage}
                            memes={(tab == 'memes' ? memesQuery : likesQuery).data?.memes.map(item => ({
                                ...item,
                                creationDate: new Date(item.creationDate),
                                editDate: new Date(item.editDate)
                            }))
                                ?? []}
                        />
                        :
                        <UserList users={(tab == 'following' ? followQuery : followerQuery).data?.map(item => ({ ...item, joinDate: new Date(item.joinDate) })) ?? []} />
                    }
                </Loader>
            </div>
    )
}

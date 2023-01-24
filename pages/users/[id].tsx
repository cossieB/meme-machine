import { useRouter } from "next/router"
import { useContext, useState } from "react"
import Loader from "../../components/Loading/Loader"
import Follow from "../../components/UserQueries/Follow"
import { UserContext } from "../../hooks/userContext"
import { formatDate } from "../../lib/formatDate"
import { trpc } from "../../utils/trpc"
import NotFound from "../404"
import dynamic from "next/dynamic";
import Tabs from "../../components/Tabs/Tabs"
import UserList from "../../components/Users/UserList"

const MemeList = dynamic(() => import('../../components/Memes/MemeList'), { ssr: false })

export default function UserPage() {
    const router = useRouter()
    const { user } = useContext(UserContext)!
    const tabs = ['memes', 'likes', 'following', 'followers']
    const [tab, setTab] = useState('memes')

    const query = trpc.user.getUser.useQuery(router.query.id as string, {
        enabled: !!router.query.id,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        retry(failureCount, error) {
            return failureCount < 3 && error.data?.httpStatus != 404
        }
    })
    const memesQuery = trpc.meme.getMemes.useQuery({ creator: router.query.id as string }, {
        enabled: !!router.query.id && tab == 'memes',
        refetchInterval: false,
        refetchOnWindowFocus: false,
        retry(failureCount, error) {
            return failureCount < 3 && error.data?.httpStatus != 404
        }
    })
    const likesQuery = trpc.like.byUser.useQuery(router.query.id as string, {
        enabled: !!router.query.id && tab == 'likes',
        refetchInterval: false,
        refetchOnWindowFocus: false,
        retry(failureCount, error) {
            return failureCount < 3 && error.data?.httpStatus != 404
        }
    })
    const followQuery = trpc.follow.followingWho.useQuery(router.query.id as string, {
        enabled: !!router.query.id && tab == 'following',
        refetchInterval: false,
        refetchOnWindowFocus: false,
        retry(failureCount, error) {
            return failureCount < 3 && error.data?.httpStatus != 404
        }
    })
    const followerQuery = trpc.follow.followedBy.useQuery(router.query.id as string, {
        enabled: !!router.query.id && tab == 'followers',
        refetchInterval: false,
        refetchOnWindowFocus: false,
        retry(failureCount, error) {
            return failureCount < 3 && error.data?.httpStatus != 404
        }
    })

    return (
        query.error?.data?.httpStatus == 404 ? <NotFound /> :
            <div>
                <Loader loading={query.isLoading} >
                    <>
                        <div className="w-full h-60 bg-center bg-cover bg-no-repeat" style={{ backgroundImage: `url(${query.data?.banner})` }}>
                            <img className="rounded-full h-20 md:h-40 aspect-square absolute translate-y-52 md:translate-y-40 translate-x-5 object-cover" src={query.data?.image ?? ""} alt={query.data?.username} />
                        </div>
                        <div className="right-0 absolute">
                            {user?.username != query.data?.username &&
                                <Follow userId={query.data?.id ?? ""} />
                            }
                        </div>
                        <div className="mt-20 text-center">
                            <h1 className="font-semibold text-3xl" > {query.data?.username} </h1>
                            <span>Status:  {query.data?.status} </span> <br />
                            <span>Joined: {formatDate(query.data?.joinDate ?? "")} </span>
                        </div>
                    </>
                </Loader>
                <Tabs
                    setValue={setTab}
                    tabs={tabs}
                    value={tab}
                />
                <Loader loading={
                    (tab == 'memes' && memesQuery.isLoading)
                    || (tab == 'likes' && likesQuery.isLoading)
                    || (tab == 'following' && followQuery.isLoading)
                    || (tab == 'followers' && followerQuery.isLoading)}
                >
                    {tab == 'memes' || tab == 'likes' ?
                        <MemeList
                            posts={(tab == 'memes' ? memesQuery : likesQuery).data?.map(item => ({ ...item, creationDate: new Date(item.creationDate) })) ?? []}
                        /> :
                        <UserList users={(tab == 'following' ? followQuery : followerQuery).data?.map(item => ({ ...item, joinDate: new Date(item.joinDate) })) ?? []} />
                    }
                </Loader>
            </div>
    )
}

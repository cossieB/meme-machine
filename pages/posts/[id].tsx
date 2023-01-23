import { useRouter } from "next/router"
import Loader from "../../components/Loading/Loader"
import { trpc } from "../../utils/trpc"
import SideBarDiv, { NavItem } from "../../components/Nav/SideBarIcon"
import { useContext, useEffect } from "react"
import { UserContext } from "../../hooks/userContext"
import { commentSvg } from "../../utils/svgs"
import { moment } from "../../utils/moment"
import { formatDate } from "../../lib/formatDate"
import Follow from "../../components/UserQueries/Follow"
import Like from "../../components/UserQueries/Like"
import NotFound from "../404"
import AddComment from "../../components/Comments/AddComment"
import CommentList from "../../components/Comments/CommentList"

export default function PostPage() {
    const { user } = useContext(UserContext)!
    const router = useRouter()
    const viewMut = trpc.meme.viewMeme.useMutation()
    useEffect(() => {
        if (!router.query.id) return;
        viewMut.mutate(router.query.id as string)
    }, [router.query.id])
    const query = trpc.meme.getMeme.useQuery(router.query.id as string, {
        enabled: !!router.query.id,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        retry(failureCount, error) {
            return failureCount < 3 && error.data?.httpStatus != 404
        },
        networkMode: process.env.NODE_ENV == 'development' ? 'always' : 'online',
        onError(err) {

        },
    })

    return (
        query.error?.data?.httpStatus == 404 ? <NotFound /> :
        
        <Loader loading={query.isLoading}  >
            <div className="flex items-center justify-center h-screen">
                <div className="flex flex-col lg:flex-row gap-5 w-11/12 shadow-2xl bg-teal-800 h-[95%] overflow-hidden rounded-xl">
                    <div className="lg:w-1/2 flex flex-col items-center">
                        <div className="w-full m-5 flex items-center justify-around">
                            <h1 className="font-semibold text-3xl" > {query.data?.title} </h1>
                            <span className="">{moment(query.data?.creationDate ?? "")}</span>
                        </div>
                        <img src={query.data?.image ?? ""} alt="" />
                        <p>{query.data?.description}</p>
                    </div>
                    <div className="lg:w-1/2 overflow-y-scroll">

                        {/* Creator Div */}
                        <div className="flex w-full justify-around">

                            <SideBarDiv
                                href={`/users/${query.data?.user.username}`}
                                icon={query.data?.user.image || ""}
                                text={query.data?.user.username ?? ""}
                                isImg
                            />
                            {user?.username != query.data?.user.username && 
                                <Follow userId={query.data?.userId ?? ""} />
                            }
                        </div>
                        <div className="flex items-center justify-around">
                            <Like postId={router.query.id as string} />
                            <NavItem
                                icon={commentSvg}
                                text="1234"
                            />
                            <span title={formatDate(query.data?.creationDate ?? "")} >
                                
                            </span>
                        </div>
                        <h2 className="text-center text-xl font-semibold py-5">Comments</h2>
                        <AddComment postId={query.data?.postId ?? ""} />
                        <CommentList postId={router.query.id as string} />
                    </div>
                </div>
            </div>
        </Loader>
    )
}
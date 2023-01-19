import { useRouter } from "next/router"
import Loader from "../../components/Loading/Loader"
import { trpc } from "../../utils/trpc"
import SideBarDiv, { NavItem } from "../../components/Nav/SideBarIcon"
import { useContext } from "react"
import { UserContext } from "../../hooks/userContext"
import ActionButton from "../../components/Nav/ActionButton"
import { commentSvg, followSvg, likeSvg } from "../../utils/svgs"
import { moment } from "../../utils/moment"
import { formatDate } from "../../lib/formatDate"

export default function PostPage() {
    const { user } = useContext(UserContext)!
    const router = useRouter()
    const query = trpc.meme.getMeme.useQuery(router.query.id as string, {
        enabled: !!router.query.id,
        onError(err) {

        },
    })
    return (
        <Loader loading={query.isLoading}  >
            <div className="flex items-center justify-center h-screen">
                <div className="flex w-11/12 shadow-2xl bg-teal-800 h-5/6 rounded-xl">
                    <div className="w-1/2 flex flex-col items-center justify-around">
                        <h1 className="font-semibold text-3xl" > {query.data?.title} </h1>
                        <img src={query.data?.image ?? ""} alt="" />
                        <p>{query.data?.description}</p>
                    </div>
                    <div className="w-1/2">
                        {/* Creator Div */}
                        <div className="flex w-full justify-around">

                            <SideBarDiv
                                href={`/users/${query.data?.user.username}`}
                                icon={query.data?.user.image || ""}
                                text={query.data?.user.username ?? ""}
                                isImg
                            />
                            {true && // <----- replace with user.username != query.data!.user.username
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
                        <div className="flex items-center justify-around">
                            <ActionButton
                                onClick={() => console.log("Send like mutation")}
                            >
                                <NavItem
                                    icon={likeSvg}
                                    text="123"
                                />
                            </ActionButton>
                            <NavItem
                                icon={commentSvg}
                                text="1234"
                            />
                            <span title={formatDate(query.data!.creationDate)} >
                                {moment(query.data!.creationDate)}
                            </span>
                        </div>
                        <h2 className="text-center text-xl font-semibold py-5">Comments</h2>
                    </div>
                </div>
            </div>
        </Loader>
    )
}
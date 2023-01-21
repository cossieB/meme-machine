import router from "next/router"
import { likeSvg, unlikeSvg } from "../../utils/svgs"
import { trpc } from "../../utils/trpc"
import ActionButton from "../Nav/ActionButton"
import { NavItem } from "../Nav/SideBarIcon"

type P = {
    postId: string
}

export default function Like({postId}: P) {
    const utils = trpc.useContext()

    const doILikeQuery = trpc.like.doesUserLike.useQuery(postId, {
        refetchInterval: false,
        refetchOnWindowFocus: false,
        retry(failureCount, error) {
            return failureCount < 3 && error.data?.code != 'UNAUTHORIZED'
        },
        networkMode: process.env.NODE_ENV == 'development' ? 'always' : 'online'
    })
    const countQuery = trpc.like.likeCount.useQuery(postId, {
        refetchInterval: false,
        refetchOnWindowFocus: false,
        retry(failureCount, error) {
            return failureCount < 3
        },
        networkMode: process.env.NODE_ENV == 'development' ? 'always' : 'online'
    })
    const likeMutation = trpc.like.like.useMutation()
    return (
        <ActionButton
            onClick={() => {
                likeMutation.mutate(postId, {
                    onSuccess() {
                        utils.like.likeCount.setData(postId, data => {
                            return {
                                _count: data!._count + (doILikeQuery.data ? -1 : 1)
                            }
                        })
                        utils.like.doesUserLike.setData(postId, data => {
                            return !data
                        })
                    },
                })
            }}
        >
            <NavItem
                icon={doILikeQuery.data ? unlikeSvg : likeSvg}
                text={(countQuery.data?._count ?? 0).toString()}
            />
        </ActionButton>
    )
}
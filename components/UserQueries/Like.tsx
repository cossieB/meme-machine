import router from "next/router"
import { likeSvg } from "../../utils/svgs"
import { trpc } from "../../utils/trpc"
import ActionButton from "../Nav/ActionButton"
import { NavItem } from "../Nav/SideBarIcon"

type P = {
    postId: string
}

export default function Like({postId}: P) {
    const doILikeQuery = trpc.like.doesUserLike.useQuery(postId)
    const countQuery = trpc.like.likeCount.useQuery(postId)
    const likeMutation = trpc.like.like.useMutation()
    return (
        <ActionButton
            onClick={() => {
                likeMutation.mutate(postId, {
                    
                })
            }}
        >
            <NavItem
                icon={likeSvg}
                text={(countQuery.data?._count ?? 0).toString()}
            />
        </ActionButton>
    )
}
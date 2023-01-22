import { signIn, useSession } from "next-auth/react"
import router from "next/router"
import { useContext } from "react"
import { ModalContext } from "../../hooks/modalContext"
import { likeSvg, unlikeSvg } from "../../utils/svgs"
import { trpc } from "../../utils/trpc"
import ActionButton from "../Nav/ActionButton"
import { NavItem } from "../Nav/SideBarIcon"

type P = {
    postId: string
}

export default function Like({postId}: P) {
    const {data: session} = useSession()
    const {setModal} = useContext(ModalContext)!
    const utils = trpc.useContext()

    const doILikeQuery = trpc.like.doesUserLike.useQuery(postId, {
        refetchInterval: false,
        refetchOnWindowFocus: false,
        retry(failureCount, error) {
            return failureCount < 3 && error.data?.code != 'UNAUTHORIZED'
        },
    })
    const countQuery = trpc.like.likeCount.useQuery(postId, {
        refetchInterval: false,
        refetchOnWindowFocus: false,
        retry(failureCount, error) {
            return failureCount < 3
        },
    })
    const likeMutation = trpc.like.like.useMutation()

    function handleClick() {
        likeMutation.mutate(postId, {
            onSuccess() {
                utils.like.likeCount.setData(postId, data => {
                    return {
                        _count: data!._count + (doILikeQuery.data ? -1 : 1),
                    }
                })
                utils.like.doesUserLike.setData(postId, data => {
                    return !data
                })
            },
        })

    }
    return (
        <ActionButton onClick={session ? handleClick : () => setModal('PROMPT_SIGNUP')} >
            <NavItem
                icon={doILikeQuery.data ? unlikeSvg : likeSvg}
                text={(countQuery.data?._count ?? 0).toString()}
            />
        </ActionButton>
    )
}
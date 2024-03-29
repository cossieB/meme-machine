import { useSession } from "next-auth/react"
import { useContext } from "react"
import { ModalContext } from "../../hooks/modalContext"
import { followSvg, unfollowSvg } from "../../utils/svgs"
import { trpc } from "../../utils/trpc"
import ActionButton from "../Nav/ActionButton"
import { NavItem } from "../Nav/SideBarIcon"

type P = {
    userId: string
}

export default function Follow({userId}: P) {
    const {data: session} = useSession()
    const {setModal} = useContext(ModalContext)!
    const utils = trpc.useContext()

    const doIFollowQuery = trpc.follow.doesUserFollow.useQuery(userId, {
        refetchInterval: false,
        refetchOnWindowFocus: false,
        retry(failureCount, error) {
            return failureCount < 3 && error.data?.code != 'UNAUTHORIZED'
        },
        networkMode: process.env.NODE_ENV == 'development' ? 'always' : 'online'
    })
    const followMutation = trpc.follow.follow.useMutation()
    
    function handleClick() {
        followMutation.mutate(userId, {
            onSuccess() {
                utils.follow.doesUserFollow.setData(userId, data => !data)
            },
        })
    }

    return (

        <ActionButton
            onClick={session ? handleClick : () => setModal('PROMPT_SIGNUP')}
        >
            <NavItem
                icon={doIFollowQuery.data ? unfollowSvg : followSvg}
                text={doIFollowQuery.data ? "Unfollow" : "Follow"}
            />
        </ActionButton>
    )
}
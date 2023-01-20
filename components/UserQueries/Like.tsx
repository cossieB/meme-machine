import router from "next/router"
import { likeSvg } from "../../utils/svgs"
import { trpc } from "../../utils/trpc"
import ActionButton from "../Nav/ActionButton"
import { NavItem } from "../Nav/SideBarIcon"

type P = {
    postId: string
}

export default function Like({postId}: P) {
    const likeMutation = trpc.meme.like.useMutation()
    return (
        <ActionButton
            onClick={() => {
                likeMutation.mutate(postId, {

                })
            }}
        >
            <NavItem
                icon={likeSvg}
                text="123"
            />
        </ActionButton>
    )
}
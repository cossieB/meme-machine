import { followSvg } from "../../utils/svgs"
import { trpc } from "../../utils/trpc"
import ActionButton from "../Nav/ActionButton"
import { NavItem } from "../Nav/SideBarIcon"

type P = {
    userId: string
}

export default function Follow({userId}: P) {
    const followMutation = trpc.follow.follow.useMutation()
    return (

        <ActionButton
            onClick={() => {
                followMutation.mutate(userId, {

                    onError(err) {

                    },
                })
            }}
        >
            <NavItem
                icon={followSvg}
                text="Follow"
            />
        </ActionButton>
    )
}
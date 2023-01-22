import { trpc } from "../../utils/trpc"
import CommentPost from "./Comment"

type P = {
    postId: string
}

export default function CommentList({postId}: P) {
    const query = trpc.comment.all.useQuery(postId, {
        enabled: !!postId,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        retry(failureCount, error) {
            return failureCount < 3 && error.data?.code != 'UNAUTHORIZED'
        },
    })

    return (
        <div className="overflow-y-scroll" >
            {(query.data ?? []).map(item => 
            <CommentPost key={item.commentId} comment={{...item, creationDate: new Date(item.creationDate), editDate: new Date(item.editDate)  }} />
                )  }
        </div>
    )
}




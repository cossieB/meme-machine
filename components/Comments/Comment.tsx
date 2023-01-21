import { Comment } from "@prisma/client";
import { moment } from "../../utils/moment";
import { trpc } from "../../utils/trpc";

export default function CommentPost({ comment }: { comment: Comment; }) {
    const query = trpc.user.byId.useQuery(comment.userId, {
        refetchInterval: false,
        refetchOnWindowFocus: false,
        retry(failureCount, error) {
            return failureCount < 3 && error.data?.code != 'UNAUTHORIZED';
        },
    });
    return (
        <div className="grid griid-cols-4" >
            <div>
                <img className="rounded-full h-10 w-10 mr-3" src={query.data?.image ?? ""} alt={query.data?.username} />
                {query.data?.username}
            </div>
            <span className="" >
                { moment(comment.creationDate) }
            </span>
            <div>
                {comment.content}
            </div>
        </div>
    );
}

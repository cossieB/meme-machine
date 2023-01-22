import { Comment } from "@prisma/client";
import Link from "next/link";
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
        <div className="grid grid-cols-5 rounded-lg bg-teal-600 mt-5 p-3" >
            <div className="row-span-2">
                <Link href={`/users/${query.data?.username}` ?? ""}>
                    <a>
                        <img className="rounded-full h-10 w-10 mr-3" src={query.data?.image ?? ""} alt={query.data?.username} />
                        {query.data?.username}
                    </a>
                </Link>
            </div>
            <div className="col-start-2 col-span-4 row-span-1" >
                {moment(comment.creationDate)}
            </div>
            <div>
                {comment.content}
            </div>
        </div>
    );
}

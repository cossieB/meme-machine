import type { Comment } from "@prisma/client";
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
        <div className="grid grid-cols-12 rounded-lg bg-slate-800 m-1 p-2" >
            <div className="row-span-2 col-span-2">
                <Link href={`/users/${query.data?.username}` ?? ""}>
                    <a>
                        <img className="rounded-full aspect-square h-10 w-10 md:h-auto md:w-5/6" src={query.data?.image ?? ""} alt={query.data?.username} />
                    </a>
                </Link>
            </div>
            <div className="text-orange-500 col-span-10 row-span-1" >
                {query.data?.username} 
                &nbsp; &middot; &nbsp;
                {moment(comment.creationDate)}
            </div>
            <div className="col-span-10 row-span-1">
                {comment.content}
            </div>
        </div>
    );
}

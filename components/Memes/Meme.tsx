import Link from "next/link";
import { formatDate } from "../../lib/formatDate";
import { MemePostType } from "../../types/PropTypes";
import { moment } from "../../utils/moment";


export default function MemePost({ p }: { p: MemePostType }) {
    return (
        <div className=" mb-5 myGridItem w-64" >
            <Link href={`/posts/${p.postId}`}>
                <a>
                    <img className="break-inside-avoid w-full rounded-2xl border-2 border-emerald-400" src={p.image} alt={`${p.title} image`} />
                    <div>

                    </div>
                </a>
            </Link>
        </div>
    )
}
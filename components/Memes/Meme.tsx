import Link from "next/link";
import { formatDate } from "../../lib/formatDate";
import { MemePostType } from "../../types/PropTypes";
import { moment } from "../../utils/moment";


export default function MemePost({ p }: { p: MemePostType }) {
    return (
        <div className="break-inside-avoid w-full mb-5" >
            <Link href={`/posts/${p.postId}`}>
                <a>
                    <img className="break-inside-avoid w-full mb-5 rounded-2xl border-2 border-emerald-400" src={p.image} alt={`${p.title} image`} />
                    <div>

                    </div>
                </a>
            </Link>
        </div>
    )
}
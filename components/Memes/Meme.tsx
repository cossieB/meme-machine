import Link from "next/link";
import { MemePostType } from "../../types/PropTypes";

export default function MemePost({ p }: { p: MemePostType }) {
    return (
        <div className=" mb-5 myGridItem w-28 md:w-64" >
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
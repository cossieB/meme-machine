import { MemePostType } from "../../types/PropTypes";
import MemePost from "./Meme";

type P = {
    posts: MemePostType[],
}

export default function MemeList(props: P) {
    const {posts} = props;
    return (
        <>
            <div className="columns-xs w-11/12 mx-auto">
                { posts.map(p => <MemePost key={p.postId} p={p} />) }
            </div>
            <div>
                {/* <button
                    disabled={page == 0}
                    onClick={() => changePage(-1)} >
                    Previous
                </button>
                <button
                    disabled={page  >= pageMax}
                    onClick={() => changePage(1)}
                >
                    Next
                </button> */}
            </div>
        </>
    )
}
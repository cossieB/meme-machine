import { MemePostType } from "../../types/PropTypes";
import MemePost from "./Meme";
import { useLayoutEffect, useRef } from "react";
import Masonry from "masonry-layout";

type P = {
    posts: MemePostType[],
}

export default function MemeList(props: P) {
    let ref = useRef<HTMLDivElement>(null)
    useLayoutEffect(() => {
        const msnry = new Masonry(ref.current!, {
            itemSelector: '.myGridItem',
            columnWidth: '.myGridItem',
            gutter: 10,
            horizontalOrder: true,
            fitWidth: true
        })
        
    }, )
    const {posts} = props;
    return (
        <>
            <div ref={ref} className="mx-auto myGrid">
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
import { MemePostType } from "../../types/PropTypes";
import MemePost from "./Meme";
import { useLayoutEffect, useRef } from "react";
import Masonry from "masonry-layout";
import imagesLoaded from "imagesloaded";
import Loader from "../Loading/Loader";
import MemesPlaceholder from "../Loading/MemesPlaceholder";
import dynamic from "next/dynamic";



type P = {
    posts: MemePostType[],
}

export default function MemeList(props: P) {
    let ref = useRef<HTMLDivElement>(null);
    const { posts } = props;
    useLayoutEffect(() => {
        const msnry = new Masonry(ref.current!, {
            itemSelector: '.myGridItem',
            columnWidth: '.myGridItem',
            gutter: 10,
            horizontalOrder: true,
            fitWidth: true
        })
        imagesLoaded(ref.current!).on('progress', () => msnry.layout!())
    },)
    return (
        <>
            <div ref={ref} className="mx-auto myGrid">
                {posts.map(p => <MemePost key={p.postId} p={p} />)}
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


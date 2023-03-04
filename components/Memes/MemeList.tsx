import { MemePostType } from "../../types/PropTypes";
import MemePost from "./Meme";
import { useLayoutEffect, useRef, useState } from "react";
import Masonry from "masonry-layout";
import imagesLoaded from "imagesloaded";
import { memesPerPage } from "../../utils/globalVariables";
import PageButton from "./PageButton";

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
        </>
    )
}


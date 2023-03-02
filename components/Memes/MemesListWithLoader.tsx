import dynamic from "next/dynamic";
import { MemePostType } from "../../types/PropTypes";
import Loader from "../Loading/Loader";
import MemesPlaceholder from "../Loading/MemesPlaceholder";

const MemeList = dynamic(() => import('./MemeList'), { ssr: false })

type P = {
    posts: MemePostType[]
    loading: boolean
}

export default function MemeListWithLoader({ posts, loading }: P) {
    return (
        <Loader placeholder={<MemesPlaceholder />} loading={loading} >
            <MemeList
                posts={posts}
            />
        </Loader>
    )
}
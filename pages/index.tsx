import { Spinner } from "../components/Loading/Spinner";
import { trpc } from "../utils/trpc";
import  dynamic from "next/dynamic";

const MemeList = dynamic(() => import('../components/Memes/MemeList'), {ssr: false})

export default function Home() {
    const memes = trpc.meme.getMemes.useQuery({}, {
        placeholderData: []
    })
    return (
        <div>
            <MemeList
                posts={memes.data?.map(item => ({ ...item, creationDate: new Date(item.creationDate) })) ?? []}
            />

        </div>
    )
}
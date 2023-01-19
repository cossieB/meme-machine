import { Spinner } from "../components/Loading/Spinner";
import MemeList from "../components/Memes/MemeList";
import { trpc } from "../utils/trpc";

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
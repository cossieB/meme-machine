import { trpc } from "../utils/trpc";
import Head from "next/head";
import MemeListWithLoader from "../components/Memes/MemesListWithLoader";

export default function Home() {
        const query = trpc.meme.homeFeed.useQuery(undefined, {
        refetchInterval: false,
        refetchOnWindowFocus: false,
        retry(failureCount, error) {
            return failureCount < 3 && error.data?.httpStatus != 404
        },
    })
    return (
        <div>
            <Head>
                <title>Meme Machine | Home</title>
            </Head>
            <MemeListWithLoader
                loading={query.isLoading}
                posts={query.data?.map(item => ({ ...item, creationDate: new Date(item.creationDate) })) ?? []}
            />
            { query.data && query.data.length === 0 && 
            <p>
                Follow people to view their memes. Or visit the <a href="/explore">explore page</a> to view popular memes.
            </p> 
            }
        </div>
    )
}


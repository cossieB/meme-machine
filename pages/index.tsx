import { trpc } from "../utils/trpc";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";

const MemeList = dynamic(() => import('../components/Memes/MemeList'), { ssr: false })

export default function Home() {
    const router = useRouter()
    
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
            <MemeList
                posts={query.data?.map(item => ({ ...item, creationDate: new Date(item.creationDate) })) ?? []}
            />

        </div>
    )
}


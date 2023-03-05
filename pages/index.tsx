import { trpc } from "../utils/trpc";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import MemesWithPaginator from "../components/Memes/MemesWithPaginator";

export default function Home() {
    const [page, setPage] = useState(0)
    const query = trpc.meme.homeFeed.useQuery({ page }, {
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
            <MemesWithPaginator
                isLastPage={query.data?.isLastPage || false}
                isLoading={query.isLoading}
                page={page}
                setPage={setPage}
                memes={query.data?.memes.map(item => ({
                    ...item,
                    creationDate: new Date(item.creationDate),
                    editDate: new Date(item.editDate)
                }))
                    ?? []}
            />
            {page == 0 && query.data?.memes.length === 0 &&
                <p>
                    Follow people to view their memes. Or visit the <Link href="/explore">explore page</Link> to view popular memes.
                </p>
            }
        </div>
    )
}


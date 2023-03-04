import { trpc } from "../utils/trpc";
import Head from "next/head";
import MemeListWithLoader from "../components/Memes/MemesListWithLoader";
import Link from "next/link";
import { useState } from "react";
import PageButton from "../components/Memes/PageButton";
import { memesPerPage } from "../utils/globalVariables";

export default function Home() {
    const [page, setPage] = useState(0)
    const query = trpc.meme.homeFeed.useQuery({ page }, {
        refetchInterval: false,
        refetchOnWindowFocus: false,
        retry(failureCount, error) {
            return failureCount < 3 && error.data?.httpStatus != 404
        },
    })

    function changePage(num: -1 | 1) {
        setPage(page => Math.max(0, page + num))
    }
    return (
        <div>
            <Head>
                <title>Meme Machine | Home</title>
            </Head>
            <MemeListWithLoader
                loading={query.isLoading}
                posts={query.data?.memes.map(item => ({ ...item, creationDate: new Date(item.creationDate) })) ?? []}
            />
            {
                query.data &&
                <div className="flex h-10 w-full justify-around" >
                    <PageButton
                        disabled={page == 0}
                        onClick={() => changePage(-1)}
                        label="&#171; Previous"
                    />
                    <PageButton
                        disabled={query.data.isLastPage}
                        onClick={() => changePage(1)}
                        label="Next &#187;"
                    />
                </div>
            }
            {page == 0 && query.data?.memes.length === 0 && 
                <p>
                    Follow people to view their memes. Or visit the <Link href="/explore">explore page</Link> to view popular memes.
                </p>
            }
        </div>
    )
}


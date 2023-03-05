import { trpc } from "../../utils/trpc";
import Tabs from "../../components/Tabs/Tabs";
import { useState } from "react";
import Head from "next/head";
import MemesWithPaginator from "../../components/Memes/MemesWithPaginator";

export default function Explore() {
    const tabs = ["new", "popular"] as const
    const [tab, setTab] = useState<string>("new")

    const filters = ['day', 'week', 'month', 'year', 'allTime'] as const
    const [filter, setFilter] = useState("allTime")

    const [page, setPage] = useState(0)

    const query = trpc.meme.getMemes.useQuery({
        sort: tab as typeof tabs[number],
        filter: filter as typeof filters[number],
        page
    }, {
        refetchInterval: false,
        refetchOnWindowFocus: false,
        retry(failureCount, error) {
            return failureCount < 3 && error.data?.httpStatus != 404
        }
    })
    return (
        <div>
            <Head>
                <title>Meme Machine | Explore</title> 
            </Head>
            <div>
                <Tabs
                    tabs={tabs}
                    setValue={setTab}
                    value={tab}
                    setPage={setPage}
                />
                {tab == 'popular' &&
                    <Tabs
                        tabs={filters}
                        setValue={setFilter}
                        value={filter}
                        setPage={setPage}
                    />
                }
            </div>
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
        </div>
    )
}


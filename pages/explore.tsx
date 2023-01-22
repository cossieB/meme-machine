import { trpc } from "../utils/trpc";
import dynamic from "next/dynamic";
import Tabs from "../components/Tabs/Tabs";
import { useState } from "react";
import Head from "next/head";

const MemeList = dynamic(() => import('../components/Memes/MemeList'), { ssr: false })

export default function Explore() {
    const tabs = ["new", "popular"] as const
    const [tab, setTab] = useState<string>("new")
    
    const filters = ['day', 'week', 'month', 'year', 'allTime'] as const
    const [filter, setFilter] = useState("allTime")

    const memes = trpc.meme.getMemes.useQuery({
        sort: tab as typeof tabs[number],
        filter: filter as typeof filters[number]
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
                />
                {tab == 'popular' && 
                    <Tabs
                        tabs={filters}
                        setValue={setFilter}
                        value={filter}
                    />
                }
            </div>
            <MemeList
                posts={memes.data?.map(item => ({ ...item, creationDate: new Date(item.creationDate) })) ?? []}
            />

        </div>
    )
}


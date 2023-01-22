import { Spinner } from "../components/Loading/Spinner";
import { trpc } from "../utils/trpc";
import dynamic from "next/dynamic";
import Tabs from "../components/Tabs/Tabs";
import { useState } from "react";
import Head from "next/head";

const MemeList = dynamic(() => import('../components/Memes/MemeList'), { ssr: false })

export default function Home() {
    const tabs = ["new", "popular"] as const
    const [tab, setTab] = useState<string>("new")
    
    const sorts = ['day', 'week', 'month', 'year', 'allTime']
    const [sort, setSort] = useState("allTime")

    const memes = trpc.meme.getMemes.useQuery({}, {
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
                        tabs={sorts}
                        setValue={setSort}
                        value={sort}
                    />
                }
            </div>
            <MemeList
                posts={memes.data?.map(item => ({ ...item, creationDate: new Date(item.creationDate) })) ?? []}
            />

        </div>
    )
}


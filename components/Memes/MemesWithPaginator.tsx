import { Meme } from "@prisma/client"
import { SetStateAction } from "react"
import MemeListWithLoader from "./MemesListWithLoader"
import PageButton from "./PageButton"

type P = {
    isLoading: boolean,
    memes?: Meme[]
    isLastPage: boolean,
    page: number,
    setPage: React.Dispatch<SetStateAction<number>>
}

export default function MemesWithPaginator(props: P) {
    const {isLastPage, memes, isLoading, setPage, page} = props
    return (
        <>
            <MemeListWithLoader
                loading={isLoading}
                posts={memes?.map(item => ({ ...item, creationDate: new Date(item.creationDate) })) ?? []}
            />
            {
                memes &&
                <div className="flex h-10 w-full justify-around" >
                    <PageButton
                        disabled={page == 0}
                        onClick={() => setPage(prev => prev - 1)}
                        label="&#171; Previous"
                    />
                    <PageButton
                        disabled={isLastPage}
                        onClick={() => setPage(prev => prev + 1)}
                        label="Next &#187;"
                    />
                </div>
            }
        </>
    )
}
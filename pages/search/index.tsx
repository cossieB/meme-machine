import { Meme } from "@prisma/client"
import Head from "next/head"
import React, { useEffect, useRef, useState } from "react"
import MemesWithPaginator from "../../components/Memes/MemesWithPaginator"
import debounce from "../../lib/debounce"
import { arrayMapStringValueToDate } from "../../utils/stringToDate"
import { trpc } from "../../utils/trpc"

export default function Search() {
    const [page, setPage] = useState(0)
    const [memes, setMemes] = useState<Meme[]>([])
    const [isLastPage, setIsLastPage] = useState(true)
    const mutation = trpc.meme.search.useMutation()
    const ref = useRef<HTMLInputElement>(null)
    useEffect(() => {
        if (!ref.current?.value) return;
        search()
    }, [page])

    function search() {
        if (!ref.current?.value) {
            setPage(0)
            setIsLastPage(true)
            return setMemes([])
        }
        mutation.mutate({ page, term: ref.current!.value }, {
            onSuccess(data) {
                setMemes(arrayMapStringValueToDate(data.memes, 'creationDate', 'editDate'))
                setIsLastPage(data.isLastPage);
            },
        })
    }

    const send = debounce(search)
    return (
        <div className="mt-10">
            <Head>
                <title>Meme Machine | Search</title>
            </Head>
            <form className="relative w-5/6 md:w-1/2 mx-auto mb-5" >
                <input
                    min={3}
                    required
                    onChange={() => {
                        send()
                    }}
                    className="block py-2.5 px-0 w-full text-orange-300 bg-transparent border-0 border-b-2 border-slate-300 appearance-none focus:border-orange-500 focus:outline-none focus:ring-0 peer"
                    placeholder=" "
                    id="search"
                    ref={ref}
                />
                <label
                    htmlFor="search"
                    className="absolute text-slate-200  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-teal-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                    Search
                </label>
            </form>
            <MemesWithPaginator
                isLastPage={isLastPage}
                page={page}
                isLoading={mutation.isLoading}
                memes={memes}
                setPage={setPage}
            />
            {!mutation.isIdle && ref.current?.value && memes.length == 0 &&
                <>
                    <img className="mx-auto" src="https://media.makeameme.org/created/i-cant-find-eze3rf.jpg" alt="Nothing found" />
                    <p className="text-center">
                        Nothing To See Here
                    </p>
                </>
            }
        </div>
    )
}
import { useRouter } from "next/router"
import Loader from "../../components/Loading/Loader"
import { trpc } from "../../utils/trpc"
import SideBarDiv, { NavItem } from "../../components/Nav/SideBarIcon"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../../hooks/userContext"
import { commentSvg, deleteSvg, viewsSvg } from "../../utils/svgs"
import { moment } from "../../utils/moment"
import { formatDate } from "../../lib/formatDate"
import Follow from "../../components/UserQueries/Follow"
import Like from "../../components/UserQueries/Like"
import NotFound from "../404"
import AddComment from "../../components/Comments/AddComment"
import CommentList from "../../components/Comments/CommentList"
import ActionButton from "../../components/Nav/ActionButton"
import Modal from "../../components/Modal"
import SubmitButton from "../../components/Forms/SubmitButton"
import FormInput from "../../components/Forms/FormInput"

export default function PostPage() {
    const { user } = useContext(UserContext)!
    const router = useRouter()
    const viewMut = trpc.meme.viewMeme.useMutation();
    const [showDeletePrompt, toggleDeletePrompt] = useState(false);
    const [deleteInput, setDeleteInput] = useState("")
    useEffect(() => {
        if (!router.query.id) return;
        viewMut.mutate(router.query.id as string)
    }, [router.query.id])

    const query = trpc.meme.getMeme.useQuery(router.query.id as string, {
        enabled: !!router.query.id,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        networkMode: 'always',
        retry(failureCount, error) {
            return failureCount < 3 && error.data?.httpStatus != 404
        },
    })

    const commentCount = trpc.comment.count.useQuery(router.query.id as string, {
        enabled: !!router.query.id,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        networkMode: 'always',
        retry(failureCount, error) {
            return failureCount < 3 && error.data?.httpStatus != 404
        },
    })
    const deleteMutation = trpc.meme.delete.useMutation()
    return (
        query.error?.data?.httpStatus == 404 ? <NotFound /> :

            <Loader loading={query.isLoading}  >
                <div className="flex lg:items-center justify-center lg:h-screen">
                    <div className="lg:flex lg:flex-row gap-5 w-11/12 shadow-2xl bg-teal-800 lg:h-[95%] lg:overflow-hidden rounded-xl">
                        <div className="lg:w-1/2 flex flex-col items-center">
                            <div className="w-full m-5 flex items-center justify-around">
                                <h1 className="font-semibold text-3xl" > {query.data?.title} </h1>
                                <span title={formatDate(query.data?.creationDate ?? "")} >
                                    {moment(query.data?.creationDate ?? "")}
                                </span>
                            </div>
                            <div className="w-full">
                                <img className="mx-auto w-5/6" src={query.data?.image ?? ""} alt="" />
                                <div className="flex justify-around w-full">
                                    <div className="flex fill-orange-300 items-center">
                                        <a id="tweet-quote" title="Tweet this quote" className="shareQuote bg-[#1DA1F2]" href={`https://twitter.com/intent/tweet?text="${query.data?.title}" - https://mememachine.vercel.app/posts/${router.query.id}`} target="_blank" rel="noreferrer">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" className="bi bi-twitter" viewBox="0 0 16 16">
                                                <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                                            </svg>
                                        </a>
                                        <a className="shareQuotes bg-[#36465D]" title="Post on tumblr" href={`https://www.tumblr.com/widgets/share/tool?posttype=photo&tags=meme&title=${query.data?.title}&content=${query.data?.image}&caption=https://mememachine.vercel.app/posts/${router.query.id}&canonicalUrl=https%3A%2F%2Fmememachine.vercel.app%2Fposts%2F${router.query.id}`} target="_blank" rel="noreferrer" >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 260 260" xmlSpace="preserve">
                                                <path d="M210.857,197.545c-1.616-0.872-3.584-0.787-5.119,0.223c-11.62,7.638-23.4,11.511-35.016,11.511  c-6.242,0-11.605-1.394-16.416-4.275c-3.27-1.936-6.308-5.321-7.397-8.263c-1.057-2.797-1.045-10.327-1.029-20.748l0.005-63.543  h52.795c2.762,0,5-2.239,5-5V62.802c0-2.761-2.238-5-5-5h-52.795V5c0-2.761-2.238-5-5-5h-35.566c-2.528,0-4.658,1.887-4.964,4.397  c-1.486,12.229-4.258,22.383-8.247,30.196c-3.89,7.7-9.153,14.401-15.651,19.925c-5.206,4.44-14.118,8.736-26.49,12.769  c-2.058,0.671-3.45,2.589-3.45,4.754v35.41c0,2.761,2.238,5,5,5h28.953v82.666c0,12.181,1.292,21.347,3.952,28.026  c2.71,6.785,7.521,13.174,14.303,18.993c6.671,5.716,14.79,10.187,24.158,13.298c9.082,2.962,16.315,4.567,28.511,4.567  c10.31,0,20.137-1.069,29.213-3.179c8.921-2.082,19.017-5.761,30.008-10.934c1.753-0.825,2.871-2.587,2.871-4.524v-39.417  C213.484,200.108,212.476,198.418,210.857,197.545z" />
                                            </svg>
                                        </a>
                                    </div>
                                    {user?.id == query.data?.userId &&
                                        <ActionButton onClick={() => toggleDeletePrompt(true)}>
                                            <NavItem
                                                icon={deleteSvg}
                                                text="Delete"
                                            />
                                        </ActionButton>
                                    }
                                </div>
                            </div>
                            <p>{query.data?.description}</p>
                        </div>
                        <div className="lg:w-1/2 lg:overflow-y-scroll">

                            {/* Creator Div */}
                            <div className="flex w-full justify-around">
                                <SideBarDiv
                                    href={`/users/${query.data?.user.username}`}
                                    icon={query.data?.user.image || ""}
                                    text={query.data?.user.username ?? ""}
                                    isImg
                                />
                                {query.data?.user.username != user?.username &&
                                    <Follow userId={query.data?.userId ?? ""} />
                                }
                            </div>
                            {/* Buttons */}
                            <div className="flex items-center justify-around">
                                <Like postId={router.query.id as string} />
                                <NavItem
                                    icon={commentSvg}
                                    text={commentCount.data ?? 0}
                                    hideTextOnMobile={false}
                                />
                                <NavItem
                                    icon={viewsSvg}
                                    text={query.data?.views ?? 0}
                                    hideTextOnMobile={false}
                                />

                            </div>
                            <h2 className="text-center text-xl font-semibold py-5">Comments</h2>
                            <AddComment postId={query.data?.postId ?? ""} />
                            <CommentList postId={router.query.id as string} />
                        </div>
                    </div>
                    {showDeletePrompt &&
                        <Modal
                            closeModal={() => {
                                setDeleteInput("")
                                toggleDeletePrompt(false)
                            }}
                        >
                            <div className="bg-slate-800 p-10">
                                This action is permanent. Type <strong> {query.data?.title} </strong> to confirm.
                                <form className="flex flex-col" onSubmit={e => {
                                    e.preventDefault();
                                    deleteMutation.mutate(router.query.id as string, {
                                        onSuccess() {
                                            router.replace("/explore")
                                        },
                                    })
                                }} >
                                    <FormInput
                                        label="Title"
                                        value={deleteInput}
                                        setValue={setDeleteInput}
                                    />
                                    <SubmitButton
                                        mutation={deleteMutation}
                                        disabledWhen={deleteInput !== query.data?.title}
                                        text="Delete"
                                        bg="bg-red-700"
                                    />
                                </form>
                            </div>
                        </Modal>
                    }
                </div>
            </Loader>
    )
}


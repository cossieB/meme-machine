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
        retry(failureCount, error) {
            return failureCount < 3 && error.data?.httpStatus != 404
        },
        onError(err) {

        },
    })

    const commentCount = trpc.comment.count.useQuery(router.query.id as string, {
        enabled: !!router.query.id,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        retry(failureCount, error) {
            return failureCount < 3 && error.data?.httpStatus != 404
        },
    })
    const deleteMutation = trpc.meme.delete.useMutation()
    return (
        query.error?.data?.httpStatus == 404 ? <NotFound /> :

            <Loader loading={query.isLoading}  >
                <div className="flex md:items-center justify-center md:h-screen">
                    <div className="lg:flex lg:flex-row gap-5 w-11/12 shadow-2xl bg-teal-800 md:h-[95%] md:overflow-hidden rounded-xl">
                        <div className="md:w-1/2 flex flex-col items-center">
                            <div className="w-full m-5 flex items-center justify-around">
                                <h1 className="font-semibold text-3xl" > {query.data?.title} </h1>
                                <span title={formatDate(query.data?.creationDate ?? "")} >
                                    {moment(query.data?.creationDate ?? "")}
                                </span>
                            </div>
                            <div>
                                <img src={query.data?.image ?? ""} alt="" />
                                <div>
                                    
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
                        <div className="md:w-1/2 md:overflow-y-scroll">

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
                        <Modal closeModal={() => {
                            setDeleteInput("")
                            toggleDeletePrompt(false)
                        }} >
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
import { UseTRPCMutationResult } from "@trpc/react-query/dist/shared/hooks/types"
import Loader from "../Loader"

type Props = {
    mutation: UseTRPCMutationResult<any,any, any, any>
    disabledWhen: boolean
}

export default function SubmitButton({mutation, disabledWhen}: Props) {
    return (
        <button
            className="bg-green-300 mt-3 rounded-full disabled:bg-slate-500 flex items-center justify-center h-10"
            type="submit"
            disabled={mutation.status == 'loading' || disabledWhen}
        >
            {mutation.status == 'loading' ? <Loader /> : "Submit"}
        </button>
    )
}
import { UseTRPCMutationResult } from "@trpc/react-query/dist/shared/hooks/types"
import {Spinner} from "../Loading/Spinner"
import {checkSvg} from "../../utils/svgs"

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
            {mutation.status == 'loading' ? <Spinner /> : mutation.status == 'success' ? checkSvg : "Submit"}
        </button>
    )
}
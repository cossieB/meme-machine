import { UseTRPCMutationResult } from "@trpc/react-query/dist/shared/hooks/types"
import {Spinner} from "../Loading/Spinner"
import {checkSvg} from "../../utils/svgs"

type Props = {
    mutation: UseTRPCMutationResult<any,any, any, any>
    disabledWhen: boolean,
    text?: string
    bg?: string
}

export default function SubmitButton(props: Props) {
    const {mutation, disabledWhen, text} = props;
    const bg = props.bg ?? "bg-green-300"
    return (
        <button
            className={`${bg} mt-3 rounded-full disabled:bg-slate-500 flex items-center justify-center h-10`}
            type="submit"
            disabled={mutation.status == 'loading' || disabledWhen}
        >
            {mutation.status == 'loading' ? <Spinner /> : mutation.status == 'success' ? checkSvg : text ?? "Submit"}
        </button>
    )
}
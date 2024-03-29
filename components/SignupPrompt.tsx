import { signIn } from "next-auth/react"

export default function SignupPrompt() {

    return (
        <div className="w-screen h-screen absolute top-0 left-0 bg-slate-800 flex">
            <div className="bg-white w-1/2 h-full flex items-center justify-center">
                <img src="https://i.imgur.com/3I2Fw1P.png" alt="Uncle Sam sign up meme" />
            </div>
            <div className="w-1/2 h-full flex items-center justify-center">
                <button
                    onClick={() => signIn()}
                    className="border-2 text-orange-300 text-3xl border-lime-300 p-3 rounded-full w-2/3 hover:bg-lime-300 hover:text-gray-900
                    transition-all duration-300">
                    SIGNUP / LOGIN
                </button>
            </div>
        </div>
    )
}
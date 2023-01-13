export default function Home() {
    return (
        <div className="w-screen h-screen absolute top-0 left-0 bg-slate-800 flex">
            <div className="bg-white w-1/2 h-full flex items-center justify-center">
                <img src="https://i.imgur.com/3I2Fw1P.png" alt="Uncle Sam sign up meme" />
            </div>
            <div className="w-1/2 h-full flex items-center justify-center">
                <Auth />
            </div>
        </div>
    )
}

function Auth() {
    return (
        <form >
            <input type="text" name="username" />
        </form>
    )
}
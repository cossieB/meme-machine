export default function MemesPlaceholder() {
    return (
        <div className="grid grid-cols-6 gap-3 animate-pulse" >
            {new Array(18).fill(1).map((_, i) =>
                <div key={i} className="bg-gray-600 h-80" />
            )}
        </div>
    )
}
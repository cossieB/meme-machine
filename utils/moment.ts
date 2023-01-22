export function moment(date: string | Date) {
    const then = new Date(date)
    const now = new Date()
    const secondsElapsed = (now.getTime() - then.getTime()) / 1000

    if (secondsElapsed < 60)
        return `${Math.round(secondsElapsed)} seconds ago`
    else if (secondsElapsed < 3600) {
        const minutes = Math.floor(secondsElapsed / 60)
        return minutes + (minutes == 1 ? " minute ago" : " minutes ago")
    }
    else
        return then.toLocaleDateString('en-za', {day: 'numeric', month: 'short', year: now.getFullYear() == then.getFullYear() ? undefined : 'numeric'})
}
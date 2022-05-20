export default function formatDate(input: Date | string) {
    if (typeof input == 'string') {
        let date = new Date(input)
        let str = date.toLocaleString(['en-za', 'en-us', 'en-gb'], {dateStyle: 'long', timeStyle: 'medium'})
        return str
    }
    return input.toLocaleString(['en-za', 'en-us', 'en-gb'], {dateStyle: 'long', timeStyle: 'medium'})
}
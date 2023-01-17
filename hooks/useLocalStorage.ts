import { useEffect, useState } from "react"

export function useLocalStorage<T>(key: string, initialValue?: T) {
    const [storage, setStorage] = useState<T | undefined>(initialValue)
    useEffect(() => {
        const str = localStorage.getItem(key)
        if (!str) return;
        setStorage(JSON.parse(str))
    }, [])
    function updateLocalStorage(val: T) {
        console.log("UPDATed")
        setStorage(val)
        localStorage.setItem(key, JSON.stringify(val))
    }
    return {storage, updateLocalStorage}
}
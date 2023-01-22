import { useEffect, useState } from "react"

type Keys = 'user'

export function useLocalStorage<T>(key: Keys, initialValue?: T) {
    const [storage, setStorage] = useState<T | undefined>(initialValue)
    useEffect(() => {
        const str = localStorage.getItem(key)
        if (!str) return;
        setStorage(JSON.parse(str))
    }, [])
    function updateLocalStorage(val: T) {
        setStorage(val)
        localStorage.setItem(key, JSON.stringify(val))
    }
    return {storage, updateLocalStorage}
}
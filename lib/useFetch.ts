import React, { useState, useEffect } from "react";

export function useFetch<T  = any >(
    url: string, 
    setLoading: React.Dispatch<React.SetStateAction<boolean>> ,
    dependencyArray: React.DependencyList = [] ,
    setError?: React.Dispatch<React.SetStateAction<number>>): T  | undefined {
    const [data, setData] = useState<T>()
    useEffect(() => {
        setLoading(true)
        getData<T>(url, setLoading)
            .then(res => setData(res))
            .catch(e => {
                setError && setError(e.code)
            })
    }, dependencyArray)
    return data
}

export async function getData<T = any>( url: string, setLoading: React.Dispatch<React.SetStateAction<boolean>>): Promise<T  | undefined> {
    try {
        const response = await fetch(url, {
            headers: {
                "accept": "application/json"
            }
        }); 
        const data = await response.json();
        if (response.status >= 400) {
            throw new Error(data.error || data.message)
        }
        return data as T
    } 
    catch (error) {
        console.log(error)
        throw error
    }
    finally {
        setLoading(false)
    }
}
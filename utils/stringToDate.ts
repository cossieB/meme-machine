import { KeysWithValuesOfType } from "../lib/utilityTypes";

/**
 * Takes an object and converts given string or number value into a Date object. Throws an error if value cannot be converted to a Date.
 * @param obj 
 * @param keys the properties whose values should be converted. The values of these properties have to be a string or number.
 * @returns the given object with the selected property values converted to Dates.
 */
export default function stringValueToDate<T extends {}, V extends KeysWithValuesOfType<T, string | number>>(
    obj: T,
    ...keys: readonly V[]
): {
        [key in keyof T]: key extends V ? Date : T[key]
    } {

    const output: any = { ...obj }
    for (const key of keys) {
        const date = new Date(obj[key] as string | number)
        if (date.toString() == 'Invalid Date') throw new Error(`${String(key)} has value ${String(obj[key])} which is an invalid date`)
        output[key] = date
    }
    return output
}

/**
 * Takes an array of objects and for each object converts given string or number value into a Date object. Throws an error if value cannot be converted to a Date.
 * @param arr 
 * @param keys the properties whose values should be converted. The values of these properties have to be a string or number.
 * @returns the given array with the selected property values converted to Dates in each element.
 */
export function arrayMapStringValueToDate<T extends {}, V extends KeysWithValuesOfType<T, string | number>>(
    arr: T[],
    ...keys: readonly V[]
): {
    [key in keyof T]: key extends V ? Date : T[key]
}[] {
    return arr.map(obj => stringValueToDate(obj, ...keys))
}
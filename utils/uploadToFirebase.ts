import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";


export default async function uploadToFirebase(file: File, fileName: string, sizeLimit = 1) {
    if (file.size > sizeLimit * 1024)
        throw new Error(`Maximum file size is ${sizeLimit * 1024}kb`)
    const storageref = ref(storage, `/users/${fileName}`);
    if (!file)
        throw new Error("No file selected");

    try {
        await uploadBytes(storageref, file);
        const url = await getDownloadURL(storageref);
        return url;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

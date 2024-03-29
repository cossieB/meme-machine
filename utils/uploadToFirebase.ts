import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default async function uploadToFirebase(file: File, fileName: string, sizeLimit = 512) {
    if (file.size > sizeLimit * 1024)
        throw new Error(`Maximum file size is ${sizeLimit * 1024}kb`)
    const storageref = ref(storage, `${fileName}`);

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

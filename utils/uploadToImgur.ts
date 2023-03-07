type ImgurResponse = {
    success: true,
    status: number,
    data: {
        link: string
    }    
} | {
    success: false,
    status: number,
    data: {
        error: {
            message: string
        }
    }
}

export default async function uploadToImgur(base64: string) {
    const fd = new FormData();
    fd.append('image', base64);
    fd.append('type', 'base64');
    const response = await fetch('https://api.imgur.com/3/image', {
        method: "POST",
        headers: {
            Authorization: `Client-ID ${process.env.IMGUR_ID!}`,
        },
        body: fd,
        redirect: 'follow',
    });
    return await response.json() as ImgurResponse;
}

export async function fileToWebp(file: File, quality = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject(new Error('No se pudo obtener el contexto del canvas'));
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(
                (blob) => {
                    if (!blob) return reject(new Error('No se pudo convertir a webp'));
                    const webpFile = new File([blob], file.name.replace(/\.\w+$/, '.webp'), { type: 'image/webp' });
                    resolve(webpFile);
                    console.log(webpFile);
                },
                'image/webp',
                quality
            );
            console.log(canvas);
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
        console.log(img.src);
        console.log(file);
    });
}

import type { ImageItem } from "@/store/upload";

type UploadProgressCallback = (progress: number) => void;

type UploadResult = {
    key: string;
};

export function uploadFile(
    image: ImageItem,
    onProgress: UploadProgressCallback
): Promise<UploadResult> {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch("/api/uploadurl", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fileName: image.file.name,
                    contentType: image.file.type,
                    size: image.file.size,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to get upload URL"
                );
            }

            const xhr = new XMLHttpRequest();

            xhr.upload.onprogress = (event: ProgressEvent) => {
                if (!event.lengthComputable) return;

                const progress = Math.round(
                    (event.loaded / event.total) * 100
                );

                onProgress(progress);
            };

            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve({
                        key: data.key,
                    });
                } else {
                    reject(new Error("Upload failed"));
                }
            };

            xhr.onerror = () => {
                reject(new Error("Network error"));
            };

            xhr.onabort = () => {
                reject(new Error("Upload cancelled"));
            };

            xhr.open("PUT", data.uploadUrl);
            xhr.setRequestHeader("Content-Type", image.file.type);

            xhr.send(image.file);
        } catch (error) {
            reject(error);
        }
    });
}
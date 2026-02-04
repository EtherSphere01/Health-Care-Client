import {
    IApiResponse,
    IErrorResponse,
    IUpdateProfileRequest,
    IUser,
} from "@/types";

const API_BASE_URL = "/api/user/update-my-profile";

export function updateMyProfileWithProgress(
    data: IUpdateProfileRequest,
    file: File | undefined,
    onProgress?: (progress: number) => void,
): Promise<IApiResponse<IUser>> {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    if (file) {
        formData.append("file", file);
    }

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PATCH", API_BASE_URL, true);
        xhr.withCredentials = true;

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable && onProgress) {
                const progress = Math.round((event.loaded / event.total) * 100);
                onProgress(progress);
            }
        };

        xhr.onload = () => {
            try {
                const response = JSON.parse(xhr.responseText);
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(response as IApiResponse<IUser>);
                } else {
                    const errorResponse: IErrorResponse = {
                        success: false,
                        statusCode: xhr.status,
                        message:
                            response?.message || "Failed to update profile",
                        errorMessages: response?.errorMessages,
                    };
                    reject(errorResponse);
                }
            } catch (error) {
                reject({
                    success: false,
                    statusCode: xhr.status || 500,
                    message: "Invalid server response",
                } as IErrorResponse);
            }
        };

        xhr.onerror = () => {
            reject({
                success: false,
                statusCode: 500,
                message: "Network error occurred",
            } as IErrorResponse);
        };

        xhr.send(formData);
    });
}

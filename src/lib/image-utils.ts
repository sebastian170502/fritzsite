// Image optimization and validation utilities

export interface ImageDimensions {
    width: number
    height: number
}

export const IMAGE_CONFIG = {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp"] as const,
    maxDimensions: {
        width: 2048,
        height: 2048,
    },
} as const

/**
 * Validates image file before upload
 */
export function validateImage(file: File): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > IMAGE_CONFIG.maxFileSize) {
        return {
            valid: false,
            error: `File size must be less than ${IMAGE_CONFIG.maxFileSize / 1024 / 1024}MB`,
        }
    }

    // Check file type
    if (!IMAGE_CONFIG.allowedTypes.includes(file.type as any)) {
        return {
            valid: false,
            error: `File type must be one of: ${IMAGE_CONFIG.allowedTypes.join(", ")}`,
        }
    }

    return { valid: true }
}

/**
 * Get image dimensions from a File object
 */
export function getImageDimensions(file: File): Promise<ImageDimensions> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        const url = URL.createObjectURL(file)

        img.onload = () => {
            URL.revokeObjectURL(url)
            resolve({ width: img.width, height: img.height })
        }

        img.onerror = () => {
            URL.revokeObjectURL(url)
            reject(new Error("Failed to load image"))
        }

        img.src = url
    })
}

/**
 * Convert image file to base64 data URL
 */
export function imageToDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject(new Error("Failed to read file"))
        reader.readAsDataURL(file)
    })
}

/**
 * Optimize image by resizing if needed
 */
export async function optimizeImage(
    file: File,
    maxWidth: number = IMAGE_CONFIG.maxDimensions.width,
    maxHeight: number = IMAGE_CONFIG.maxDimensions.height
): Promise<Blob> {
    const dimensions = await getImageDimensions(file)

    // No need to resize if already within limits
    if (dimensions.width <= maxWidth && dimensions.height <= maxHeight) {
        return file
    }

    return new Promise((resolve, reject) => {
        const img = new Image()
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        if (!ctx) {
            reject(new Error("Failed to get canvas context"))
            return
        }

        img.onload = () => {
            // Calculate new dimensions while maintaining aspect ratio
            let { width, height } = dimensions
            if (width > maxWidth) {
                height = (height * maxWidth) / width
                width = maxWidth
            }
            if (height > maxHeight) {
                width = (width * maxHeight) / height
                height = maxHeight
            }

            canvas.width = width
            canvas.height = height
            ctx.drawImage(img, 0, 0, width, height)

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob)
                    } else {
                        reject(new Error("Failed to create blob"))
                    }
                },
                file.type,
                0.9
            )
        }

        img.onerror = () => reject(new Error("Failed to load image"))
        img.src = URL.createObjectURL(file)
    })
}

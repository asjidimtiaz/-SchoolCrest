/**
 * Detects if a URL points to a video based on common file extensions.
 * Handles URLs with query parameters.
 */
export function isVideoUrl(url: string | null | undefined): boolean {
    if (!url) return false;

    // Remove query parameters for extension matching
    const cleanUrl = url.split('?')[0].toLowerCase();

    const videoExtensions = [
        '.mp4', '.webm', '.ogg', '.mov', '.m4v', '.quicktime', '.mkv', '.avi'
    ];

    return videoExtensions.some(ext => cleanUrl.endsWith(ext));
}

/**
 * Robustly determines the media type for a program or season item.
 */
export function getMediaType(
    directUrl: string | null | undefined,
    fallbackUrl?: string | null | undefined,
    fallbackMediaType?: 'image' | 'video'
): 'image' | 'video' {
    // If we have a direct URL, prioritize its extension
    if (directUrl && isVideoUrl(directUrl)) {
        return 'video';
    }

    // If no direct URL or it's an image, and we have a fallback
    if (!directUrl && fallbackUrl) {
        // If fallback URL is a video by extension
        if (isVideoUrl(fallbackUrl)) return 'video';
        // If fallback has an explicit media_type
        if (fallbackMediaType === 'video') return 'video';
    }

    return 'image';
}

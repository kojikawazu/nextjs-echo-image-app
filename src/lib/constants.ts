/**
 * バケット名
 */
export const BUCKET_NAME = process.env.S3_BUCKET_NAME || '';

/**
 * プレフィックス
 */
export const PORTAL_PREFIX = process.env.NEXT_PUBLIC_PORTAL_PREFIX || '';

/**
 * 共通定数
 */
export const COMMON_CONSTANTS = {
    URL: {
        // folder
        API_FOLDER: '/api/folder',
        API_FOLDERS: '/api/folders',
        API_FOLDERS_CREATE: '/api/folders/create',
        API_FOLDERS_DELETE: '/api/folders/delete',
        // image
        API_IMAGES: '/api/images',
        API_IMAGES_CREATE: '/api/images/create',
        API_IMAGES_DELETE: '/api/images/delete',
    },
    PATH: {
        ROOT: 'portal/',
    },
};

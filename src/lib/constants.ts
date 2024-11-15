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
    PATH: {
        ROOT: 'portal/',
    },
};

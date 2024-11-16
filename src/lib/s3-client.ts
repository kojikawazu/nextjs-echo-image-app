import { S3Client } from '@aws-sdk/client-s3';
// types
import { FolderData, ImageData } from '@/types/types';
// lib
import { COMMON_CONSTANTS } from '@/lib/constants';

/**
 * S3クライアント
 */
export const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'ap-northeast-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

/**
 * フォルダ一覧を取得
 * @returns フォルダ一覧
 */
export const getFolders = async (prefix: string): Promise<FolderData[]> => {
    const url = `${COMMON_CONSTANTS.URL.API_FOLDERS}?prefix=${encodeURIComponent(prefix)}`;

    try {
        // フォルダ一覧を取得
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('フォルダの取得に失敗しました');
        }
        // フォルダ一覧を返す
        return response.json();
    } catch (error) {
        // フォルダの取得に失敗した場合
        console.error('フォルダの取得に失敗しました: ', error);
        throw error;
    }
};

/**
 * 画像一覧を取得
 * @param prefix プレフィックス
 * @returns 画像一覧
 */
export const getImages = async (prefix?: string): Promise<ImageData[]> => {
    const url = prefix
        ? `${COMMON_CONSTANTS.URL.API_IMAGES}?prefix=${encodeURIComponent(prefix)}`
        : COMMON_CONSTANTS.URL.API_IMAGES;

    try {
        // 画像一覧を取得
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('画像の取得に失敗しました');
        }
        // 画像一覧を返す
        return response.json();
    } catch (error) {
        // 画像一覧の取得に失敗した場合
        console.error('画像の取得に失敗しました: ', error);
        throw error;
    }
};

/**
 * フォルダーを作成
 * @param folder フォルダー
 * @returns フォルダー
 */
export const addFolder = async (folder: FolderData): Promise<FolderData> => {
    const url = `${COMMON_CONSTANTS.URL.API_FOLDERS_CREATE}`;

    try {
        // フォルダーを作成
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(folder),
        });
        if (!response.ok) {
            throw new Error('フォルダーの作成に失敗しました');
        }
        // フォルダーを返す
        return response.json();
    } catch (error) {
        // フォルダーの作成に失敗した場合
        console.error('フォルダーの作成に失敗しました: ', error);
        throw error;
    }
};

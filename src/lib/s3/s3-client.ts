import { S3Client } from '@aws-sdk/client-s3';
// types
import { FolderData } from '@/types/types';
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

/**
 * フォルダー削除
 * @param folderId フォルダーID
 * @returns フォルダー削除結果
 */
export const deleteFolders = async (folderIds: string[]): Promise<void> => {
    const url = `${COMMON_CONSTANTS.URL.API_FOLDERS_DELETE}`;

    // フォルダーが指定されていない場合はエラー
    if (!folderIds || folderIds.length === 0) {
        throw new Error('フォルダーが指定されていません');
    }

    try {
        // フォルダーを削除
        await fetch(url, {
            method: 'DELETE',
            body: JSON.stringify({ folderIds }),
        });
    } catch (error) {
        // フォルダーの削除に失敗した場合
        console.error('フォルダーの削除に失敗しました: ', error);
        throw error;
    }
};

/**
 * 画像をアップロード
 * @param folderId フォルダーID
 * @param files 画像
 * @returns 画像
 */
export const addImages = async (folderId: string, files: File[]): Promise<void> => {
    const url = `${COMMON_CONSTANTS.URL.API_IMAGES_CREATE}`;

    try {
        // 画像をアップロード
        for (const file of files) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folderPath', folderId);

            const response = await fetch(url, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('画像のアップロードに失敗しました');
            }
        }
    } catch (error) {
        // 画像のアップロードに失敗した場合
        console.error('画像のアップロードに失敗しました: ', error);
        throw error;
    }
};

/**
 * 画像削除
 * @param key 画像のキー
 * @returns 画像削除結果
 */
export const deleteImages = async (imageKeys: string[]): Promise<void> => {
    const url = `${COMMON_CONSTANTS.URL.API_IMAGES_DELETE}`;

    // 画像が指定されていない場合はエラー
    if (!imageKeys || imageKeys.length === 0) {
        throw new Error('画像が指定されていません');
    }

    try {
        // 画像を削除
        await fetch(url, {
            method: 'DELETE',
            body: JSON.stringify({ imageKeys }),
        });
    } catch (error) {
        // 画像の削除に失敗した場合
        console.error('画像の削除に失敗しました: ', error);
        throw error;
    }
};

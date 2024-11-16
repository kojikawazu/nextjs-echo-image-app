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

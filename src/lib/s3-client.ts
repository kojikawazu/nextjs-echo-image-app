import axios from 'axios';
import { S3Client } from '@aws-sdk/client-s3';
import { FolderData, ImageData } from '@/types/types';

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
    try {
        // フォルダ一覧を取得
        const response = await axios.get(`/api/folders?prefix=${encodeURIComponent(prefix)}`);
        //console.log('getFolders(): ', response.data);
        // フォルダ一覧を返す
        return response.data;
    } catch (error) {
        // フォルダの取得に失敗した場合
        console.error('フォルダの取得に失敗しました:', error);
        throw error;
    }
};

/**
 * 画像一覧を取得
 * @param prefix プレフィックス
 * @returns 画像一覧
 */
export const getImages = async (prefix?: string): Promise<ImageData[]> => {
    try {
        // 画像一覧を取得
        const url = prefix ? `/api/images?prefix=${encodeURIComponent(prefix)}` : '/api/images';

        // 画像一覧を取得
        const response = await fetch(url);
        //console.log('getImages(): ', response);
        if (!response.ok) {
            throw new Error('画像の取得に失敗しました');
        }
        // 画像一覧を返す
        return response.json();
    } catch (error) {
        // 画像一覧の取得に失敗した場合
        console.error('画像の取得に失敗しました:', error);
        throw error;
    }
};

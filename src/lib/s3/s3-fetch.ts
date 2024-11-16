// types
import { FolderData, ImageData } from '@/types/types';
// lib
import { COMMON_CONSTANTS } from '@/lib/constants';

/**
 * フォルダを取得
 * @returns フォルダ
 */
export const getFolder = async (prefix: string): Promise<FolderData> => {
    const url = `${COMMON_CONSTANTS.URL.API_FOLDER}?prefix=${encodeURIComponent(prefix)}`;

    try {
        // フォルダを取得
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('フォルダの取得に失敗しました');
        }
        // フォルダを返す
        return response.json();
    } catch (error) {
        // フォルダの取得に失敗した場合
        console.error('フォルダの取得に失敗しました: ', error);
        throw error;
    }
};

/**
 * フォルダ一覧を取得
 * @returns フォルダ一覧
 */
export const getChildrenFolders = async (prefix: string): Promise<FolderData[]> => {
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

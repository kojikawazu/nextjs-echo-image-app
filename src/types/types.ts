/**
 * 画像データ
 */
export interface ImageData {
    id: string;
    lastModified: string;
    name: string;
    folderId: string | null;
    size: number;
    url: string;
}

/**
 * フォルダデータ
 */
export interface FolderData {
    id: string;
    name: string;
    createdAt: string;
    parentId: string | null;
}

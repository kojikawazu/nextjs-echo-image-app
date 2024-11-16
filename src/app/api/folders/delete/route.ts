import { NextResponse } from 'next/server';
import { DeleteObjectsCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
// lib
import { BUCKET_NAME } from '@/lib/constants';
import { s3Client } from '@/lib/s3/s3-client';

export const dynamic = 'force-dynamic';

/**
 * フォルダー削除
 * @returns フォルダー削除結果
 */
export async function DELETE(request: Request) {
    try {
        // リクエストボディを取得
        const { folderIds } = await request.json();

        // フォルダーが指定されていない場合はエラー
        if (!folderIds || folderIds.length === 0) {
            return NextResponse.json({ message: 'No folders specified' }, { status: 400 });
        }

        // フォルダー内のすべてのオブジェクトをリスト化
        for (const folderPath of folderIds) {
            // フォルダー内のすべてのオブジェクトをリスト化
            const listCommand = new ListObjectsV2Command({
                Bucket: BUCKET_NAME,
                Prefix: folderPath,
            });

            // フォルダー内のすべてのオブジェクトを取得
            const listedObjects = await s3Client.send(listCommand);

            // フォルダーが空か存在しない場合はエラー
            if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
                return NextResponse.json({ message: 'Folder is empty or does not exist' });
            }

            // 削除対象オブジェクトの配列を作成
            const deleteParams = {
                Bucket: BUCKET_NAME,
                Delete: {
                    Objects: listedObjects.Contents.map(({ Key }) => ({ Key })),
                    Quiet: false,
                },
            };

            // オブジェクトを削除
            await s3Client.send(new DeleteObjectsCommand(deleteParams));
        }

        // 成功
        return NextResponse.json({ message: 'Folder deleted successfully' });
    } catch (error) {
        console.error('Error deleting folder:', error);
        return NextResponse.json({ error: 'Failed to delete folder' }, { status: 500 });
    }
}

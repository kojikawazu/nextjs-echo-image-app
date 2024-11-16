import { NextResponse } from 'next/server';
import { HeadObjectCommand } from '@aws-sdk/client-s3';
import { BUCKET_NAME } from '@/lib/constants';
import { s3Client } from '@/lib/s3/s3-client';

export const dynamic = 'force-dynamic';

/**
 * 指定されたフォルダの情報を取得
 * @returns フォルダ情報
 */
export async function GET(request: Request) {
    try {
        // URLからフォルダIDを取得
        const { searchParams } = new URL(request.url);
        let folderId = searchParams.get('prefix') || 'portal/';

        // フォルダIDの末尾に/を追加（ない場合）
        if (!folderId.endsWith('/')) {
            folderId += '/';
        }

        // パスを分解して情報を構築
        const pathParts = folderId.split('/').filter(Boolean);
        const name = pathParts[pathParts.length - 1] || 'portal';
        const parentPathParts = pathParts.slice(0, -1);
        const parentId = parentPathParts.length > 0 ? `${parentPathParts.join('/')}/` : 'portal/';

        // フォルダの存在確認
        const command = new HeadObjectCommand({
            Bucket: BUCKET_NAME,
            Key: folderId,
        });

        try {
            await s3Client.send(command);
        } catch (error) {
            // フォルダが存在しない場合は404を返す
            if (error instanceof Error && 'name' in error && error.name === 'NotFound') {
                return NextResponse.json({ error: 'フォルダが見つかりません' }, { status: 404 });
            }
            throw error;
        }

        // フォルダ情報を返す
        const folderInfo = {
            id: folderId,
            name: name,
            createdAt: new Date().toISOString(),
            parentId: parentId,
        };

        return NextResponse.json(folderInfo);
    } catch (error) {
        console.error('フォルダ情報の取得に失敗しました:', error);
        return NextResponse.json({ error: 'フォルダ情報の取得に失敗しました' }, { status: 500 });
    }
}

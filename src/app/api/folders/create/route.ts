import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
// lib
import { BUCKET_NAME } from '@/lib/constants';
import { s3Client } from '@/lib/s3/s3-client';

export const dynamic = 'force-dynamic';

interface CreateFolderRequest {
    id: string;
}

/**
 * フォルダーを作成
 * @returns フォルダー
 */
export async function POST(request: Request) {
    try {
        // リクエストボディを取得
        const body: CreateFolderRequest = await request.json();
        const { id } = body;
        // portal/dd → portal/dd/
        const folderPath = id.endsWith('/') ? id : `${id}/`;
        // portal/dd → dd
        const folderName = id.split('/').pop();
        // portal/dd → portal/
        const parentFolderPath = id.split('/').slice(0, -1).join('/') + '/';

        // idのバリデーション
        if (!id) {
            return NextResponse.json({ error: 'フォルダパスは必須です' }, { status: 400 });
        }

        // S3にフォルダを作成（空のオブジェクトを作成）
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: folderPath,
            Body: '',
        });

        await s3Client.send(command);

        // 作成したフォルダの情報を返す
        const newFolder = {
            id: folderPath,
            name: folderName,
            createdAt: new Date().toISOString(),
            parentId: parentFolderPath,
        };

        return NextResponse.json(newFolder);
    } catch (error) {
        // フォルダーの作成に失敗した場合
        console.error('フォルダーの作成に失敗しました:', error);
        return NextResponse.json({ error: 'フォルダーの作成に失敗しました' }, { status: 500 });
    }
}

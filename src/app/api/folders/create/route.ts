import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
// lib
import { BUCKET_NAME } from '@/lib/constants';
import { s3Client } from '@/lib/s3/s3-client';

interface CreateFolderRequest {
    id: string;
    name: string;
    parentId: string;
}

/**
 * フォルダーを作成
 * @returns フォルダー
 */
export async function POST(request: Request) {
    try {
        // リクエストボディを取得
        const body: CreateFolderRequest = await request.json();
        const { id, name, parentId } = body;
        const folderPath = id.endsWith('/') ? id : `${id}/`;

        // フォルダ名とパスのバリデーション
        if (!name || !parentId) {
            return NextResponse.json(
                { error: 'フォルダ名と親フォルダのパスは必須です' },
                { status: 400 },
            );
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
            name: name,
            createdAt: new Date().toISOString(),
            parentId: parentId,
        };

        return NextResponse.json(newFolder);
    } catch (error) {
        // フォルダーの作成に失敗した場合
        console.error('フォルダーの作成に失敗しました:', error);
        return NextResponse.json({ error: 'フォルダーの作成に失敗しました' }, { status: 500 });
    }
}

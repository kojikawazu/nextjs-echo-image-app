import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
// lib
import { BUCKET_NAME } from '@/lib/constants';
import { s3Client } from '@/lib/s3/s3-client';

interface CreateFolderRequest {
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
        const { name, parentId } = body;

        // フォルダ名とパスのバリデーション
        if (!name || !parentId) {
            return NextResponse.json(
                { error: 'フォルダ名と親フォルダのパスは必須です' },
                { status: 400 },
            );
        }

        // 親フォルダのパスを正規化
        const normalizedParentPath = parentId.endsWith('/') ? parentId : `${parentId}/`;

        // 新しいフォルダのパスを作成
        const folderPath = `${normalizedParentPath}${name}/`;

        // S3にフォルダを作成（空のオブジェクトを作成）
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: folderPath,
            Body: '', // 空のコンテンツ
        });

        await s3Client.send(command);

        // 作成したフォルダの情報を返す
        const newFolder = {
            id: folderPath,
            name: name,
            createdAt: new Date().toISOString(),
            parentId: normalizedParentPath,
        };

        return NextResponse.json(newFolder);
    } catch (error) {
        // フォルダーの作成に失敗した場合
        console.error('フォルダーの作成に失敗しました:', error);
        return NextResponse.json({ error: 'フォルダーの作成に失敗しました' }, { status: 500 });
    }
}

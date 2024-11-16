import { PutObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';
// types
import { ImageData } from '@/types/types';
// lib
import { BUCKET_NAME, COMMON_CONSTANTS } from '@/lib/constants';
import { s3Client } from '@/lib/s3/s3-client';

export const dynamic = 'force-dynamic';

/**
 * 画像をアップロード
 * @returns 画像
 */
export async function POST(request: Request) {
    try {
        // リクエストボディを取得
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const folderPath = formData.get('folderPath') as string;

        if (!file) {
            return NextResponse.json({ error: 'ファイルが必要です' }, { status: 400 });
        }

        // バッファに変換
        const buffer = Buffer.from(await file.arrayBuffer());
        const cleanFolderPath = folderPath.replace(/\/+$/, '');
        const key = cleanFolderPath.startsWith('/')
            ? `${cleanFolderPath.slice(1)}/${file.name}`
            : `${cleanFolderPath}/${file.name}`;

        // S3に画像をアップロード
        await s3Client.send(
            new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: key,
                Body: buffer,
                ContentType: file.type,
            }),
        );

        // 画像データを作成
        const imageData: ImageData = {
            id: key,
            lastModified: new Date().toISOString(),
            name: file.name,
            folderId: folderPath,
            size: file.size,
            url: `${COMMON_CONSTANTS.URL.API_IMAGES}/${key}`,
        };

        return NextResponse.json(imageData);
    } catch (error) {
        console.error('アップロードエラー:', error);
        return NextResponse.json(
            { error: 'アップロード中にエラーが発生しました' },
            { status: 500 },
        );
    }
}

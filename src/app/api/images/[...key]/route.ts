import { NextResponse } from 'next/server';
import { GetObjectCommand } from '@aws-sdk/client-s3';
// lib
import { BUCKET_NAME } from '@/lib/constants';
import { s3Client } from '@/lib/s3/s3-client';

export const dynamic = 'force-dynamic';

/**
 * 画像を取得
 * @param request リクエスト
 * @param params パスパラメータ
 * @returns 画像
 */
export async function GET(request: Request, { params }: { params: { key: string[] } }) {
    try {
        // パスパラメータを結合して元のキーを復元
        const key = params.key.join('/');
        console.log('Fetching image with key:', key);

        // S3のGetObjectCommandを使用して画像データを取得
        const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });

        const response = await s3Client.send(command);

        if (!response.Body) {
            console.error('No body in response');
            return new NextResponse('Image not found', { status: 404 });
        }

        // S3のレスポンスをストリームに変換
        const stream = response.Body.transformToWebStream();

        // 適切なContent-Typeを設定
        const contentType = response.ContentType || 'image/png';

        return new NextResponse(stream, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000',
            },
        });
    } catch (error) {
        console.error('Error fetching image:', error);
        return new NextResponse('Error fetching image', { status: 500 });
    }
}

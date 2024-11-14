import { NextResponse } from 'next/server';
import { BUCKET_NAME } from '@/lib/constants';
import { s3Client } from '@/lib/s3-client';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';

/**
 * 画像の一覧を取得するAPI
 * @param request リクエスト
 * @returns 画像の一覧
 */
export async function GET(request: Request) {
    try {
        // クエリパラメータからprefixを取得
        const { searchParams } = new URL(request.url);
        let prefix = searchParams.get('prefix') || 'portal/';

        // 末尾にスラッシュがない場合は追加
        if (!prefix.endsWith('/')) {
            prefix += '/';
        }

        // S3のListObjectsV2Commandを使用してフォルダ内のオブジェクト一覧を取得
        const command = new ListObjectsV2Command({
            Bucket: BUCKET_NAME,
            Prefix: prefix,
            Delimiter: '/',
        });
        const response = await s3Client.send(command);

        // 画像ファイルのみをフィルタリング
        const images =
            response.Contents?.filter((item) => {
                const key = item.Key || '';
                return key.match(/\.(jpg|jpeg|png|gif|webp)$/i);
            }).map((item) => {
                const key = item.Key || '';
                return {
                    id: key,
                    name: key.split('/').pop() || '',
                    size: item.Size || 0,
                    lastModified: item.LastModified,
                    // URLを/で分割して結合
                    url: `/api/images/${key}`,
                };
            }) || [];

        return NextResponse.json(images);
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: '画像の取得に失敗しました' }, { status: 500 });
    }
}

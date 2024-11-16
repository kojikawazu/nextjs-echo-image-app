import { NextResponse } from 'next/server';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';
// lib
import { BUCKET_NAME } from '@/lib/constants';
import { s3Client } from '@/lib/s3/s3-client';

/**
 * フォルダ一覧を取得
 * @returns フォルダ一覧
 */
export async function GET(request: Request) {
    try {
        // URLからプレフィックスを取得
        const { searchParams } = new URL(request.url);
        let prefix = searchParams.get('prefix') || 'portal/';

        // プレフィックスの末尾に/を追加（ない場合）
        if (!prefix.endsWith('/')) {
            prefix += '/';
        }

        // S3からフォルダ一覧を取得
        const command = new ListObjectsV2Command({
            Bucket: BUCKET_NAME,
            Prefix: prefix,
            Delimiter: '/',
        });

        // S3からフォルダ一覧を取得
        const response = await s3Client.send(command);

        // portalディレクトリ直下のフォルダのみを取得
        const folders =
            response.CommonPrefixes?.map((prefix) => {
                const fullPath = prefix.Prefix!;
                const pathParts = fullPath.split('/').filter(Boolean);

                // 最後の部分をフォルダ名として取得
                const name = pathParts[pathParts.length - 1];

                // 親フォルダのパスを取得（最後の部分を除いた部分）
                const parentPathParts = pathParts.slice(0, -1);
                const parentPath =
                    parentPathParts.length > 0 ? parentPathParts.join('/') : 'portal';

                return {
                    id: fullPath,
                    name: name, // スラッシュを除去
                    createdAt: new Date().toISOString(),
                    parentId: parentPath,
                };
            }).filter((folder) => folder.name !== '') || [];

        // フォルダ一覧を返す
        return NextResponse.json(folders);
    } catch (error) {
        // フォルダの取得に失敗した場合
        console.error('フォルダの取得に失敗しました:', error);
        return NextResponse.json({ error: 'フォルダの取得に失敗しました' }, { status: 500 });
    }
}

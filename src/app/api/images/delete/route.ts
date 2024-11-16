import { NextResponse } from 'next/server';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
// lib
import { BUCKET_NAME } from '@/lib/constants';
import { s3Client } from '@/lib/s3/s3-client';

/**
 * 画像削除
 * @returns 画像削除結果
 */
export async function DELETE(request: Request) {
    try {
        const { imageKeys } = await request.json();

        // 画像が指定されていない場合はエラー
        if (!imageKeys || imageKeys.length === 0) {
            return NextResponse.json(
                { message: 'No images specified' },
                { status: 400 }
            );
        }

        // 各画像を削除
        for (const imageKey of imageKeys) {
            const deleteCommand = new DeleteObjectCommand({
                Bucket: BUCKET_NAME,
                Key: imageKey,
            });

            await s3Client.send(deleteCommand);
        }

        return NextResponse.json({ message: 'Images deleted successfully' });
    } catch (error) {
        console.error('Error deleting images:', error);
        return NextResponse.json(
            { message: 'Error deleting images' },
            { status: 500 }
        );
    }
}
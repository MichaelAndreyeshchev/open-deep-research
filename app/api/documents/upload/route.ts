import { auth } from '@/app/(auth)/auth';
import { processPDFBuffer } from '@/lib/document-processing/pdf-processor';
import {
  saveUploadedDocument,
  saveDocumentChunks,
} from '@/lib/db/queries';
import { generateUUID } from '@/lib/utils';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const processed = await processPDFBuffer(buffer);

    const documentId = generateUUID();

    await saveUploadedDocument({
      id: documentId,
      filename: file.name,
      userId: session.user.id,
      totalPages: processed.totalPages,
      fileSize: buffer.length,
      metadata: processed.metadata,
    });

    const chunks = processed.chunks.map((chunk, index) => ({
      id: generateUUID(),
      documentId,
      chunkIndex: index,
      pageNumber: chunk.pageNumber,
      content: chunk.content,
      metadata: chunk.metadata,
    }));

    await saveDocumentChunks(chunks);

    return NextResponse.json({
      success: true,
      document: {
        id: documentId,
        filename: file.name,
        totalPages: processed.totalPages,
        fileSize: buffer.length,
      },
    });
  } catch (error: any) {
    console.error('Document upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload document' },
      { status: 500 }
    );
  }
}

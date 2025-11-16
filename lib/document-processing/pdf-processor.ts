import { readFile } from 'node:fs/promises';

export interface DocumentChunk {
  pageNumber: number;
  content: string;
  metadata?: Record<string, any>;
}

export interface ProcessedDocument {
  totalPages: number;
  chunks: DocumentChunk[];
  metadata: {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;
    creator?: string;
    producer?: string;
    creationDate?: Date;
    modificationDate?: Date;
  };
}

export async function processPDF(filePath: string): Promise<ProcessedDocument> {
  const dataBuffer = await readFile(filePath);
  const pdf = (await import('pdf-parse')).default;
  const data = await pdf(dataBuffer);

  const chunks: DocumentChunk[] = [];
  const pageTexts = data.text.split('\f');

  for (let i = 0; i < pageTexts.length; i++) {
    const content = pageTexts[i].trim();
    if (content) {
      chunks.push({
        pageNumber: i + 1,
        content,
        metadata: {
          numRender: data.numpages,
        },
      });
    }
  }

  return {
    totalPages: data.numpages,
    chunks,
    metadata: {
      title: data.info?.Title,
      author: data.info?.Author,
      subject: data.info?.Subject,
      keywords: data.info?.Keywords,
      creator: data.info?.Creator,
      producer: data.info?.Producer,
      creationDate: data.info?.CreationDate,
      modificationDate: data.info?.ModDate,
    },
  };
}

export async function processPDFBuffer(buffer: Buffer): Promise<ProcessedDocument> {
  const pdf = (await import('pdf-parse')).default;
  const data = await pdf(buffer);

  const chunks: DocumentChunk[] = [];
  const pageTexts = data.text.split('\f');

  for (let i = 0; i < pageTexts.length; i++) {
    const content = pageTexts[i].trim();
    if (content) {
      chunks.push({
        pageNumber: i + 1,
        content,
        metadata: {
          numRender: data.numpages,
        },
      });
    }
  }

  return {
    totalPages: data.numpages,
    chunks,
    metadata: {
      title: data.info?.Title,
      author: data.info?.Author,
      subject: data.info?.Subject,
      keywords: data.info?.Keywords,
      creator: data.info?.Creator,
      producer: data.info?.Producer,
      creationDate: data.info?.CreationDate,
      modificationDate: data.info?.ModDate,
    },
  };
}

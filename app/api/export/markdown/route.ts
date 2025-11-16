import { NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { getChatById } from '@/lib/db/queries';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { message, citation } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const sqlite = new Database(process.env.DATABASE_URL || './data/sqlite.db');
const db = drizzle(sqlite);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get('chatId');

  if (!chatId) {
    return NextResponse.json({ error: 'Chat ID is required' }, { status: 400 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const chat = await getChatById({ id: chatId });
    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    if (chat.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const messages = await db
      .select()
      .from(message)
      .where(eq(message.chatId, chatId))
      .orderBy(message.createdAt);

    const allCitations = await db
      .select()
      .from(citation)
      .where(eq(citation.messageId, messages[messages.length - 1]?.id || ''));

    let markdown = `# ${chat.title}\n\n`;
    markdown += `*Generated: ${new Date().toLocaleDateString()}*\n\n`;
    markdown += `---\n\n`;

    for (const msg of messages) {
      if (msg.role === 'user') {
        const content = typeof msg.content === 'string' 
          ? msg.content 
          : Array.isArray(msg.content) 
            ? msg.content.map((c: any) => c.text || '').join('\n')
            : '';
        markdown += `## Research Query\n\n${content}\n\n`;
      } else if (msg.role === 'assistant') {
        const content = typeof msg.content === 'string' 
          ? msg.content 
          : Array.isArray(msg.content) 
            ? msg.content.map((c: any) => c.text || '').join('\n')
            : '';
        markdown += `## Research Report\n\n${content}\n\n`;
      }
    }

    if (allCitations.length > 0) {
      markdown += `---\n\n## References\n\n`;
      allCitations.forEach((cite, index) => {
        markdown += `${index + 1}. **${cite.sourceName}**`;
        if (cite.url) {
          markdown += ` - [${cite.url}](${cite.url})`;
        }
        if (cite.pageNumber) {
          markdown += ` (Page ${cite.pageNumber})`;
        }
        if (cite.excerpt) {
          markdown += `\n   > ${cite.excerpt}`;
        }
        markdown += `\n\n`;
      });
    }

    return new NextResponse(markdown, {
      headers: {
        'Content-Type': 'text/markdown',
        'Content-Disposition': `attachment; filename="${chat.title.replace(/[^a-z0-9]/gi, '_')}.md"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}

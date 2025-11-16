import { NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { citation, citationVerification, message, chat } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const sqlite = new Database(process.env.DATABASE_URL || './data/sqlite.db');
const db = drizzle(sqlite);

const BLOCKLIST_DOMAINS = [
  'fortunebusinessinsights.com',
  'grandviewresearch.com',
  'polarismarketresearch.com',
  'psmarketresearch.com',
  'insightaceanalytic.com',
  'globenewswire.com',
  'introspectivemarketresearch.com',
  'straitsresearch.com',
  'credenceresearch.com',
  'theinsightpartners.com',
  'marketsandmarkets.com',
  'transparencymarketresearch.com',
  'focusreports.store',
  'myconsultingcoach.com',
  'github.com',
  'precedenceresearch.com',
  'futuremarketinsights.com',
  'expertmarketresearch.com',
  'marketdataforecast.com',
];

const isBlockedDomain = (url: string): boolean => {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return BLOCKLIST_DOMAINS.some(domain => hostname.includes(domain));
  } catch {
    return false;
  }
};

async function verifyUrl(url: string): Promise<{
  status: 'ok' | 'broken' | 'blocked' | 'redirected';
  httpStatus?: number;
  redirectUrl?: string;
  errorMessage?: string;
}> {
  if (isBlockedDomain(url)) {
    return { status: 'blocked', errorMessage: 'Domain is on blocklist' };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'manual',
    });

    clearTimeout(timeoutId);

    if (response.status >= 300 && response.status < 400) {
      const redirectUrl = response.headers.get('location');
      return {
        status: 'redirected',
        httpStatus: response.status,
        redirectUrl: redirectUrl || undefined,
      };
    }

    if (response.status >= 200 && response.status < 300) {
      return { status: 'ok', httpStatus: response.status };
    }

    return {
      status: 'broken',
      httpStatus: response.status,
      errorMessage: `HTTP ${response.status}`,
    };
  } catch (error: any) {
    return {
      status: 'broken',
      errorMessage: error.message || 'Request failed',
    };
  }
}

export async function POST(request: Request) {
  const { chatId } = await request.json();

  if (!chatId) {
    return NextResponse.json({ error: 'Chat ID is required' }, { status: 400 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const chatRecord = await db
      .select()
      .from(chat)
      .where(eq(chat.id, chatId))
      .limit(1);

    if (chatRecord.length === 0 || chatRecord[0].userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const messages = await db
      .select()
      .from(message)
      .where(eq(message.chatId, chatId));

    const messageIds = messages.map(m => m.id);
    const citations = await db
      .select()
      .from(citation)
      .where(eq(citation.messageId, messageIds[messageIds.length - 1] || ''));

    const verificationResults = [];

    for (const cite of citations) {
      if (!cite.url) continue;

      const result = await verifyUrl(cite.url);

      await db.insert(citationVerification).values({
        citationId: cite.id,
        verifiedAt: new Date(),
        status: result.status,
        httpStatus: result.httpStatus,
        redirectUrl: result.redirectUrl,
        errorMessage: result.errorMessage,
      });

      verificationResults.push({
        citationId: cite.id,
        url: cite.url,
        sourceName: cite.sourceName,
        ...result,
      });
    }

    return NextResponse.json({
      success: true,
      results: verificationResults,
      summary: {
        total: verificationResults.length,
        ok: verificationResults.filter(r => r.status === 'ok').length,
        broken: verificationResults.filter(r => r.status === 'broken').length,
        blocked: verificationResults.filter(r => r.status === 'blocked').length,
        redirected: verificationResults.filter(r => r.status === 'redirected').length,
      },
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}

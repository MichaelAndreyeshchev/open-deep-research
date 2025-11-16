import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export interface DeepResearchOptions {
  query: string;
  systemPrompt: string;
  model?: 'o3-deep-research' | 'o4-mini-deep-research-2025-06-26';
  onProgress?: (data: any) => void;
}

export interface DeepResearchResult {
  text: string;
  citations: Array<{
    title: string;
    url: string;
    startIndex: number;
    endIndex: number;
  }>;
  intermediateSteps: Array<{
    type: string;
    content: any;
  }>;
}

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

export async function runDeepResearch(
  options: DeepResearchOptions
): Promise<DeepResearchResult> {
  const { query, systemPrompt, model = 'o4-mini-deep-research-2025-06-26', onProgress } = options;

  const enhancedSystemPrompt = `${systemPrompt}

IMPORTANT: Do not search, cite, or rely on the following domains as they are known to provide low-quality market research:
${BLOCKLIST_DOMAINS.join(', ')}

If a source from these domains appears in search results, exclude it from your analysis.`;

  try {
    const response: any = await openai.responses.create({
      model,
      input: [
        {
          role: 'developer',
          content: [
            {
              type: 'input_text',
              text: enhancedSystemPrompt,
            },
          ],
        },
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: query,
            },
          ],
        },
      ],
      reasoning: {
        summary: 'auto',
      },
      tools: [
        {
          type: 'web_search_preview',
        },
      ],
    } as any);

    const messageOutputs = response.output.filter((item: any) => item.type === 'message');
    const finalOutput = messageOutputs[messageOutputs.length - 1];
    const text = finalOutput?.content?.[0]?.text || '';

    const rawAnnotations = finalOutput?.content?.[0]?.annotations || [];
    const citations = rawAnnotations
      .filter((ann: any) => !isBlockedDomain(ann.url))
      .map((ann: any) => ({
        title: ann.title || 'Untitled',
        url: ann.url,
        startIndex: ann.start_index,
        endIndex: ann.end_index,
      }));

    const intermediateSteps = response.output
      .filter((item: any) => item.type !== 'message')
      .map((item: any) => ({
        type: item.type,
        content: item,
      }));

    const blockedCitations = rawAnnotations.filter((ann: any) =>
      isBlockedDomain(ann.url)
    );
    if (blockedCitations.length > 0) {
      console.warn(
        `Filtered ${blockedCitations.length} citations from blocked domains:`,
        blockedCitations.map((c: any) => c.url)
      );
    }

    return {
      text,
      citations,
      intermediateSteps,
    };
  } catch (error) {
    console.error('Deep Research error:', error);
    throw error;
  }
}

export async function* streamDeepResearch(
  options: DeepResearchOptions
): AsyncGenerator<any, void, unknown> {
  const { query, systemPrompt, model = 'o4-mini-deep-research-2025-06-26' } = options;

  const enhancedSystemPrompt = `${systemPrompt}

IMPORTANT: Do not search, cite, or rely on the following domains as they are known to provide low-quality market research:
${BLOCKLIST_DOMAINS.join(', ')}

If a source from these domains appears in search results, exclude it from your analysis.`;

  try {
    const stream = await openai.responses.stream({
      model,
      input: [
        {
          role: 'developer',
          content: [
            {
              type: 'input_text',
              text: enhancedSystemPrompt,
            },
          ],
        },
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: query,
            },
          ],
        },
      ],
      reasoning: {
        summary: 'auto',
      },
      tools: [
        {
          type: 'web_search_preview',
        },
      ],
    });

    for await (const event of stream) {
      yield event;
    }
  } catch (error) {
    console.error('Deep Research streaming error:', error);
    throw error;
  }
}

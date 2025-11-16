# Open Deep Research - PE/CDD Research Consolidation System

An intelligent research consolidation system for internal consultants that synthesizes large volumes of market data from multiple sources into actionable, well-cited research reports. This system is specifically designed for Private Equity and Commercial Due Diligence (PE/CDD) use cases.

## Overview

This application demonstrates an intelligent research consolidation system that:
- Processes large PDF documents without using RAG (Retrieval-Augmented Generation)
- Maintains robust citation tracking with source attribution
- Generates structured research reports with executive summaries, findings, and conclusions
- Filters out low-quality market research sources
- Provides a conversational interface for research tasks

## Key Features

### Document Processing
- **PDF Processing**: Intelligent chunking of large PDF documents while maintaining context
- **Multi-format Support**: Currently supports PDF files (30+ documents efficiently)
- **Citation Tracking**: Every claim links to its source with page numbers and excerpts
- **No RAG Required**: Uses LLM reasoning instead of vector embeddings for document selection

### Research Interface
- **Conversational Flow**: Asks clarifying questions before beginning research
- **Deep Research**: Multi-step research process with reasoning and analysis
- **Real-time Progress**: Shows research progress and intermediate findings
- **PE/CDD Optimized**: System prompt designed for investment analysis and commercial due diligence

### Report Generation
- **Structured Reports**: Executive summary, detailed findings, and conclusions
- **Citation System**: Inline citations and bibliography with page numbers
- **Export Formats**: Markdown and PDF export support
- **Source Quality**: Prioritizes reputable sources (McKinsey, BCG, Bain) over low-quality market research

### Data Integration
- **Web Research**: Firecrawl-powered search and extraction with blocklist filtering
- **Document Upload**: Upload and process expert interview transcripts and research documents
- **Blocklist Filtering**: Automatically filters out 19 low-quality market research domains

## Tech Stack

- **Framework**: Next.js 15 (latest stable)
- **UI Library**: Mantine 8.3.8 (for UI components)
- **Database**: SQLite with Drizzle ORM
- **Document Processing**: pdf-parse (inspired by Vectorless approach)
- **LLM Integration**: OpenAI Deep Research API via AI SDK
- **Authentication**: NextAuth.js
- **Web Research**: Firecrawl API

## Blocklist Domains

The following domains are automatically filtered from web research results to ensure high-quality sources:

- fortunebusinessinsights.com
- grandviewresearch.com
- polarismarketresearch.com
- psmarketresearch.com
- insightaceanalytic.com
- globenewswire.com
- introspectivemarketresearch.com
- straitsresearch.com
- credenceresearch.com
- theinsightpartners.com
- marketsandmarkets.com
- transparencymarketresearch.com
- focusreports.store
- myconsultingcoach.com
- github.com
- precedenceresearch.com
- futuremarketinsights.com
- expertmarketresearch.com
- marketdataforecast.com

## Setup and Installation

### Prerequisites

- Node.js 18+ and pnpm
- OpenAI API key
- Firecrawl API key
- Upstash Redis (for rate limiting)

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Authentication
AUTH_SECRET=your-auth-secret-here

# OpenAI API
OPENAI_API_KEY=your-openai-api-key

# Firecrawl API
FIRECRAWL_API_KEY=your-firecrawl-api-key

# Database (SQLite - no configuration needed, will be created automatically)
DATABASE_URL=./data/sqlite.db

# Redis (for rate limiting)
UPSTASH_REDIS_REST_URL=your-upstash-redis-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-token

# Reasoning Model Configuration
REASONING_MODEL=o1-mini

# Optional: Function timeout (default 300 seconds)
MAX_DURATION=300

# Optional: Bypass JSON validation for non-OpenAI models
BYPASS_JSON_VALIDATION=false
```

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/MichaelAndreyeshchev/open-deep-research.git
cd open-deep-research
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

4. **Run database migrations**
```bash
pnpm db:migrate
```

5. **Start the development server**
```bash
pnpm dev
```

Your application should now be running on [localhost:3000](http://localhost:3000/).

## Usage

### Uploading Documents

1. Navigate to the application
2. Use the document upload interface to upload PDF files
3. Documents are automatically processed and chunked for efficient retrieval

### Conducting Research

1. Start a new chat
2. Enter your research question (e.g., "I want to develop a research report on the foundation repair and waterproofing services market in the US")
3. The system will ask clarifying questions
4. Enable "Deep Research" mode for comprehensive multi-step research
5. The system will:
   - Search for relevant information
   - Extract data from sources
   - Analyze findings
   - Generate a structured report with citations

### Sample Research Request

```
I want to develop a research report on the foundation repair and waterproofing services market in the US. The report should cover the following segments:

Market map and profit pools:
- Valuing the total addressable market in the US
- What are the key market segments of different services
- What are the revenue pools in each of these services
- How do the margins of each value chain segment compare?

Demand drivers and headwinds:
- What are the key macro- and micro-drivers of demand/headwinds in the industry
- What is their impact on future growth for each market segment

Geographic drivers:
- What are the key differences between US states
- How do different localized drivers impact each state
- Which are the most attractive states to operate in?

Customer segments:
- What are the differences between commercial, residential and industrial customers?
- Which are the most attractive segments to play in and why?

Business model:
- Revenue Quality: Evaluating revenue recurrence across different segments
- Resource intensity: Evaluating business scalability

Target List:
- Identifying deal "wish-list"
- Developing target evaluation criteria
```

## Architecture Overview

### Database Schema

The application uses SQLite with the following key tables:

- **User**: User authentication and profiles
- **Chat**: Chat sessions
- **Message**: Chat messages
- **UploadedDocument**: Metadata for uploaded PDF documents
- **DocumentChunk**: Individual pages/chunks from documents
- **Citation**: Citation tracking linking messages to sources
- **Document**: Canvas documents for collaborative editing
- **Suggestion**: AI-generated suggestions
- **Vote**: Message voting system

### Document Processing Pipeline

1. **Upload**: PDF files are uploaded via API endpoint
2. **Processing**: pdf-parse extracts text and metadata
3. **Chunking**: Documents are split into page-level chunks
4. **Storage**: Chunks are stored in SQLite with metadata
5. **Retrieval**: LLM reasoning selects relevant chunks (no vector embeddings)

### Research Flow

1. **User Query**: User enters research question
2. **Clarification**: System asks clarifying questions
3. **Deep Research**: Multi-step research process:
   - Search for relevant sources
   - Extract data from top results
   - Analyze findings with reasoning model
   - Identify gaps and continue research
   - Synthesize final report
4. **Citation Tracking**: All claims are linked to sources
5. **Report Generation**: Structured output with executive summary, findings, and conclusions

## Key Decisions

### Why SQLite Instead of PostgreSQL?

- **Simplicity**: No external database server required
- **Portability**: Database file can be easily backed up and moved
- **Performance**: Sufficient for prototype/POC use case
- **Local Development**: Easier setup for local development

### Why No RAG?

- **LLM Reasoning**: Modern LLMs can effectively select relevant documents through reasoning
- **Context Maintenance**: Intelligent chunking maintains document context
- **Simplicity**: Avoids complexity of vector embeddings and similarity search
- **Flexibility**: Easier to adjust retrieval logic based on query type

### Why Mantine UI?

- **Modern Components**: Rich set of accessible components
- **TypeScript Support**: Full TypeScript support out of the box
- **Customization**: Easy to customize and theme
- **Performance**: Lightweight and performant

## Known Limitations

1. **PDF Only**: Currently only supports PDF file format
2. **Desktop Only**: UI is optimized for desktop viewports only
3. **No Mobile Support**: Mobile views are not implemented
4. **Rate Limiting**: Basic rate limiting implemented, may need adjustment for production
5. **Citation Accuracy**: Citation extraction depends on LLM accuracy
6. **Processing Time**: Large documents may take time to process
7. **No Authentication UI**: Uses anonymous sessions by default

## Implemented Bonus Features

1. **OpenAI Deep Research Integration**: Core integration library created for OpenAI's web_search_preview tool
2. **Export to Markdown**: API endpoint (`/api/export/markdown`) for exporting research reports to Markdown format with citations
3. **Citation Verification**: API endpoint (`/api/citations/verify`) for validating citation links and checking against blocklist
4. **PRISMA-style Audit Trail**: Database tables (ResearchRun, ResearchStep, CitationVerification) for tracking research methodology
5. **Opposing Views & Uncertainty**: Enhanced system prompt to require uncertainty sections with confidence levels in reports

## Future Improvements

1. **Complete OpenAI Integration**: Fully integrate OpenAI Deep Research into chat route as primary research provider
2. **Export UI Components**: Add export buttons and citation verification UI to the interface
3. **PDF Export**: Implement print-friendly page for PDF generation via window.print()
4. **Advanced Visualization**: Charts and graphs for research findings using Mantine Charts or Recharts
5. **Multi-format Support**: Add support for DOCX, TXT, and other document formats
6. **Collaborative Features**: Commenting and sharing capabilities
7. **Mobile Support**: Responsive design for mobile devices
8. **Advanced Analytics**: Quality evaluation and benchmarks
9. **Paywalled Content**: Integration with academic databases (Scopus, etc.)
10. **Multimodal Reading**: Better extraction from tables, figures, and math in PDFs

## API Keys Configuration

### OpenAI API Key

1. Sign up at [OpenAI](https://platform.openai.com/)
2. Navigate to API Keys section
3. Create a new API key
4. Add to `.env.local` as `OPENAI_API_KEY`

### Firecrawl API Key

1. Sign up at [Firecrawl](https://firecrawl.dev/)
2. Navigate to API Keys section
3. Create a new API key
4. Add to `.env.local` as `FIRECRAWL_API_KEY`

### Upstash Redis

1. Sign up at [Upstash](https://upstash.com/)
2. Create a new Redis database
3. Copy the REST URL and token
4. Add to `.env.local` as `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

## Development

### Running Tests

```bash
pnpm test
```

### Linting

```bash
pnpm lint
```

### Building for Production

```bash
pnpm build
```

### Database Migrations

Generate new migration:
```bash
pnpm db:generate
```

Run migrations:
```bash
pnpm db:migrate
```

## Contributing

This is a prototype/proof-of-concept application. Contributions are welcome but please note this is not intended for production use.

## License

MIT

## Acknowledgments

- Inspired by [Vectorless](https://github.com/roe-ai/vectorless) for document processing approach
- Built on [Next.js AI Chatbot](https://github.com/vercel/ai-chatbot) template
- Uses [Firecrawl](https://firecrawl.dev/) for web research capabilities

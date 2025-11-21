# SBHT Bastion

GitHub App Integration Platform with real-time webhook monitoring.

## Features

- **GitHub Dashboard** - View profile, repositories, and organizations
- **Webhook Monitor** - Real-time GitHub webhook events via SSE
- **Deploy Monitor** - Deployment monitoring dashboard (Demo)

## Tech Stack

- Next.js 16 (App Router, React 19)
- TypeScript
- Tailwind CSS v4
- PostgreSQL
- GitHub OAuth 2.0

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

```env
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
GITHUB_APP_ID=your_app_id
GITHUB_PRIVATE_KEY=your_private_key
GITHUB_WEBHOOK_SECRET=your_webhook_secret
DATABASE_URL=postgresql://...
```

## API Endpoints

- `POST /api/webhooks/github` - GitHub webhook receiver
- `GET /api/webhooks/events` - SSE event stream
- `GET /api/github` - GitHub API proxy

## License

MIT

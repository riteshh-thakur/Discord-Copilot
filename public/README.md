# Discord Copilot Admin Console

A modern web interface for managing Discord Copilot bot configuration, memory, and knowledge base.

## Features

- 🤖 Bot configuration management
- 📝 Conversation memory management
- 📚 Knowledge base management
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive design

## Deployment

This project is deployed on Vercel and includes:

- Next.js 14 with App Router
- TypeScript support
- Tailwind CSS for styling
- API routes for bot management
- Back4App integration

## Environment Variables

All environment variables are configured in Vercel dashboard.

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run development: `npm run dev`
4. Build for production: `npm run build`

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── api/             # API routes
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main page
├── components/          # React components
└── lib/                # Utility libraries
```

## License

MIT License

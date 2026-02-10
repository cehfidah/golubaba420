# Golubaba420 - OSINT Intelligence Platform

A powerful Open Source Intelligence (OSINT) search platform built with Next.js 16, TypeScript, and Tailwind CSS. Search across multiple databases for emails, names, phone numbers, and usernames.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue)
![React](https://img.shields.io/badge/React-19.2.3-61dafb)
![License](https://img.shields.io/badge/license-MIT-green)

## 🚀 Features

- **Multi-Database Search**: Search across various OSINT databases simultaneously
- **Advanced Filtering**: Customize results with language preferences and result limits
- **Export Options**: Download results in JSON, CSV, or PDF formats
- **Real-time Search**: Fast and responsive search with loading states
- **Dark Mode Support**: Built-in theme support with next-themes
- **Modern UI**: Beautiful, responsive interface using Radix UI components
- **Type-Safe**: Fully typed with TypeScript for better development experience

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18.x or higher
- npm, yarn, or pnpm package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/golubaba420.git
   cd golubaba420
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   LEAKOSINT_API_TOKEN=your_api_token_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
golubaba420/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── search/        # Search endpoint
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # UI component library
│   ├── hero-section.tsx
│   ├── search-form.tsx
│   ├── search-results.tsx
│   └── search-stats.tsx
├── lib/                   # Utility functions
│   ├── pdf-generator.ts
│   └── utils.ts
├── types/                 # TypeScript type definitions
│   └── index.ts
├── public/               # Static assets
└── styles/               # Additional styles
```

## 🎯 Usage

### Basic Search
1. Enter an email, name, phone number, or username in the search box
2. Click the "Search" button or press Enter
3. View results organized by database

### Advanced Options
- Click "Advanced Options" to access:
  - **Result Limit**: Set max results (100-10,000)
  - **Language**: Choose preferred language for results

### Export Results
- Click the download button to export as:
  - **JSON**: Raw data format
  - **CSV**: Spreadsheet-compatible format
  - **PDF**: Formatted report

## 🔧 Available Scripts

```bash
npm run dev      # Start development server with Turbopack
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🌐 API Integration

This project uses the LeakOSINT API. To configure:

1. Obtain an API token from [LeakOSINT](https://leakosintapi.com/)
2. Add it to your `.env.local` file
3. The API endpoint is configured in `app/api/search/route.ts`

### API Request Format
```typescript
{
  token: "your_api_token",
  request: "search_query",
  limit: 100,
  lang: "en"
}
```

## 🎨 Customization

### Theme
- Edit theme colors in `tailwind.config.ts`
- Customize component styles in `app/globals.css`

### Components
- All UI components are in `components/ui/`
- Powered by Radix UI primitives
- Styled with Tailwind CSS

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms
Build the production version:
```bash
npm run build
npm run start
```

## 🔒 Security

- API tokens are stored in environment variables
- Never commit `.env.local` to version control
- Input sanitization is implemented in API routes
- Rate limiting is handled by the external API

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Radix UI](https://www.radix-ui.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide Icons](https://lucide.dev/) - Icon library
- [LeakOSINT](https://leakosintapi.com/) - OSINT API

## 📧 Contact

For questions or support, please open an issue on GitHub.

## ⚠️ Disclaimer

This tool is for educational and legitimate OSINT research purposes only. Users are responsible for ensuring their use complies with all applicable laws and regulations. The developers are not responsible for any misuse of this software.

---

**Built with ❤️ using Next.js and TypeScript**

# Toolio

A Next.js + TypeScript utility tools website. Processing happens in the browser for the included tools.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Production build

```bash
npm run build
npm start
```

## Included working tools

- Merge PDF (combine selected PDF files in selection order)
- Image compressor (JPEG/WebP output)
- Image resizer (custom dimensions)
- QR code generator (download PNG)
- Word counter
- Text case converter
- Password generator
- Percentage calculator

Files are processed locally in the browser. This starter intentionally avoids uploading user files to a server.

## Deploy

Import the repository into Vercel. Framework preset: Next.js. Build command: `npm run build`; output directory: leave default.

## Notes

This is a functional starter project, not a claim that every possible utility has been implemented. Add tools incrementally and test each before publishing.

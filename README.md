# Toolio — Online Utility Tools

A React + TypeScript + Vite starter for Toolio.co.in.

## Requirements
- Node.js 20.19+ or 22.12+
- npm

## Install and run

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually http://localhost:5173).

## Production build

```bash
npm run build
npm run preview
```

## Included
- Responsive Toolio homepage and category navigation
- Search across the 20 registered tools
- PDF: merge, split, rotate, add watermark, JPG to PDF, basic re-save/optimization
- Image: compress, resize, JPG/PNG conversion, basic crop
- Text: word counter, case converter, duplicate-line removal
- Calculators: percentage, age, GST
- Generators: QR code and random password

## Important limitations before public launch
- PDF-to-JPG is registered in the catalogue but intentionally disabled in this starter because PDF.js worker configuration and rendering/download packaging need to be completed and tested.
- "Compress PDF" only re-saves the document with pdf-lib. It does not guarantee a smaller file or perform deep image recompression.
- The image cropper is a simple top-left crop, not an interactive crop selection UI.
- The PDF watermark is a basic text stamp.
- Legal pages are placeholders. Replace them with accurate, reviewed policies and real contact information.
- Add automated tests, file-size limits, accessibility checks, security review, analytics consent where applicable, SEO metadata, sitemap, robots.txt, canonical URLs and production monitoring before launch.
- Review current Google AdSense policies and eligibility before adding ads.

Most file operations in this starter are performed in the user's browser. Do not claim every tool is fully private or production-ready until independently tested.

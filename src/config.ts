import {
  FileText, Image, Type, Calculator, QrCode, Combine, Scissors, FileDown,
  FileImage, RotateCw, Stamp, Minimize2, Maximize2, Crop, CaseUpper,
  ListFilter, Percent, CalendarDays, IndianRupee, ShieldCheck
} from 'lucide-react'

export const categories = [
  { name: 'PDF Tools', slug: 'pdf-tools', icon: FileText, color: 'rose' },
  { name: 'Image Tools', slug: 'image-tools', icon: Image, color: 'blue' },
  { name: 'Text Tools', slug: 'text-tools', icon: Type, color: 'amber' },
  { name: 'Calculators', slug: 'calculators', icon: Calculator, color: 'emerald' },
  { name: 'Generators', slug: 'generators', icon: QrCode, color: 'violet' },
]

export const tools = [
  { name: 'Merge PDF', slug: 'merge-pdf', category: 'PDF Tools', description: 'Combine multiple PDF files into one document.', icon: Combine, popular: true },
  { name: 'Split PDF', slug: 'split-pdf', category: 'PDF Tools', description: 'Extract selected pages into a new PDF.', icon: Scissors, popular: true },
  { name: 'Compress PDF', slug: 'compress-pdf', category: 'PDF Tools', description: 'Optimize PDF files where supported.', icon: FileDown, popular: true },
  { name: 'JPG to PDF', slug: 'jpg-to-pdf', category: 'PDF Tools', description: 'Turn images into a PDF document.', icon: FileImage, popular: true },
  { name: 'PDF to JPG', slug: 'pdf-to-jpg', category: 'PDF Tools', description: 'Render PDF pages as JPG images.', icon: Image, popular: false },
  { name: 'Rotate PDF', slug: 'rotate-pdf', category: 'PDF Tools', description: 'Rotate every page in a PDF.', icon: RotateCw, popular: false },
  { name: 'Add Watermark', slug: 'add-watermark', category: 'PDF Tools', description: 'Stamp text across PDF pages.', icon: Stamp, popular: false },
  { name: 'Compress Image', slug: 'compress-image', category: 'Image Tools', description: 'Reduce image file size with adjustable quality.', icon: Minimize2, popular: true },
  { name: 'Resize Image', slug: 'resize-image', category: 'Image Tools', description: 'Resize an image to custom dimensions.', icon: Maximize2, popular: true },
  { name: 'JPG to PNG', slug: 'jpg-to-png', category: 'Image Tools', description: 'Convert JPG images into PNG format.', icon: Image, popular: false },
  { name: 'PNG to JPG', slug: 'png-to-jpg', category: 'Image Tools', description: 'Convert PNG images into JPG format.', icon: Image, popular: false },
  { name: 'Image Cropper', slug: 'image-cropper', category: 'Image Tools', description: 'Crop an image using custom dimensions.', icon: Crop, popular: false },
  { name: 'Word Counter', slug: 'word-counter', category: 'Text Tools', description: 'Count words, characters and sentences.', icon: Type, popular: true },
  { name: 'Case Converter', slug: 'case-converter', category: 'Text Tools', description: 'Convert text into different letter cases.', icon: CaseUpper, popular: false },
  { name: 'Remove Duplicate Lines', slug: 'remove-duplicate-lines', category: 'Text Tools', description: 'Remove repeated lines from text.', icon: ListFilter, popular: false },
  { name: 'Percentage Calculator', slug: 'percentage-calculator', category: 'Calculators', description: 'Calculate percentages quickly.', icon: Percent, popular: true },
  { name: 'Age Calculator', slug: 'age-calculator', category: 'Calculators', description: 'Calculate age from date of birth.', icon: CalendarDays, popular: false },
  { name: 'GST Calculator', slug: 'gst-calculator', category: 'Calculators', description: 'Calculate GST and inclusive prices.', icon: IndianRupee, popular: true },
  { name: 'QR Code Generator', slug: 'qr-code-generator', category: 'Generators', description: 'Create a QR code from text or a URL.', icon: QrCode, popular: true },
  { name: 'Password Generator', slug: 'password-generator', category: 'Generators', description: 'Generate a random strong password.', icon: ShieldCheck, popular: false },
]

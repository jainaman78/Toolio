
import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import MergePdfClient from "./MergePdfClient";

export const metadata: Metadata = {
  title: "Merge PDF Files Online Free | Toolio",
  description:
    "Merge multiple PDF files into one document for free. Upload, reorder and combine PDF files directly in your browser. No account required.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Merge PDF Files Online Free | Toolio",
    description:
      "Combine multiple PDF documents into one file. Arrange your files and download your merged PDF for free.",
    type: "website",
  },
};

const faqs = [
  {
    question: "How do I merge PDF files online?",
    answer:
      "Select two or more PDF files, arrange them in your preferred order and click Merge PDFs. Once processing is complete, download your combined PDF.",
  },
  {
    question: "Can I rearrange PDF files before merging?",
    answer:
      "Yes. You can change the order of your selected PDF documents before merging. The final document follows the order displayed in the file list.",
  },
  {
    question: "Are my PDF files uploaded to Toolio?",
    answer:
      "No. PDF files are processed locally in your browser. They are not uploaded to Toolio's servers.",
  },
  {
    question: "Is the PDF merger free?",
    answer:
      "Yes. Toolio's PDF merger is free to use and does not require an account.",
  },
  {
    question: "Can I merge more than two PDF files?",
    answer:
      "Yes. You can select and combine multiple PDF documents in one operation, subject to the tool's file limits.",
  },
  {
    question: "Will merging change my original PDF files?",
    answer:
      "No. Toolio creates a new combined PDF. Your original documents remain unchanged.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Toolio PDF Merger",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      description:
        "Free online PDF merger that combines multiple PDF documents directly in the browser.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "Merge multiple PDF files",
        "Reorder PDF documents",
        "Process PDF files in the browser",
        "Download merged PDF documents",
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ],
};

export default function MergePdfPage() {
  const jsonLd = JSON.stringify(structuredData).replace(
    /</g,
    "\\u003c"
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      <ToolShell
        title="Merge PDF Files Online"
        description="Combine multiple PDF documents into one file. Add your files, arrange their order and download the finished PDF."
      >
        <MergePdfClient />
      </ToolShell>

      <div className="container merge-pdf-content">
        <section className="how-to-section">
          <div className="how-to-header">
            <span className="section-kicker">HOW IT WORKS</span>
            <h2>How to merge PDF files</h2>
            <p>
              Combine multiple PDF documents into one file with
              these four steps.
            </p>
          </div>

          <ol className="how-to-grid">
            <li className="how-to-card">
              <span className="step-number">01</span>
              <h3>Select PDF files</h3>
              <p>
                Choose two or more PDF documents from your
                computer or drag them into the upload area.
              </p>
            </li>

            <li className="how-to-card">
              <span className="step-number">02</span>
              <h3>Arrange your files</h3>
              <p>
                Move your documents into the order you want
                them to appear in the final PDF.
              </p>
            </li>

            <li className="how-to-card">
              <span className="step-number">03</span>
              <h3>Merge documents</h3>
              <p>
                Select Merge PDFs. Toolio combines your
                documents directly in your browser.
              </p>
            </li>

            <li className="how-to-card">
              <span className="step-number">04</span>
              <h3>Download the PDF</h3>
              <p>
                Download your combined document. Your
                original PDF files remain unchanged.
              </p>
            </li>
          </ol>
        </section>

        <section className="faq-section">
          <div className="faq-header">
            <span className="section-kicker">HELP AND SUPPORT</span>
            <h2>Frequently asked questions</h2>
            <p>
              Learn more about combining PDF documents
              with Toolio.
            </p>
          </div>

          <div className="faq-list">
            {faqs.map((faq) => (
              <details className="faq-item" key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

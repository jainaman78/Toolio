
"use client";

import { useMemo, useRef, useState } from "react";

import type { ChangeEvent, DragEvent } from "react";

import {
  ArrowDown,
  ArrowUp,
  Download,
  FilePlus2,
  FileText,
  GripVertical,
  LoaderCircle,
  Upload,
  X,
} from "lucide-react";

type PdfFile = {
  id: string;
  file: File;
};

const MAX_FILES = 20;
const MAX_TOTAL_SIZE = 100 * 1024 * 1024;

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function sanitizeFileName(name: string): string {
  const cleanedName = name
    .trim()
    .replace(/\.pdf$/i, "")
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "")
    .replace(/[. ]+$/g, "")
    .trim();

  return `${cleanedName || "merged-document"}.pdf`;
}

export default function MergePdfClient() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<PdfFile[]>([]);
  const [fileName, setFileName] = useState("merged-document");
  const [dragging, setDragging] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [progress, setProgress] = useState("");

  const totalSize = useMemo(
    () => files.reduce((total, item) => total + item.file.size, 0),
    [files]
  );

  const canMerge =
    files.length >= 2 &&
    !isMerging &&
    totalSize <= MAX_TOTAL_SIZE;

  function addFiles(selectedFiles: File[]) {
    setError("");
    setSuccess("");
    setProgress("");

    const validFiles = selectedFiles.filter((file) => {
      const isPdf =
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf");

      return isPdf && file.size > 0;
    });

    if (validFiles.length !== selectedFiles.length) {
      setError("Some files were skipped. Please select valid PDF files.");
    }

    if (validFiles.length === 0) return;

    const availableSlots = MAX_FILES - files.length;

    if (availableSlots <= 0) {
      setError(`You can select a maximum of ${MAX_FILES} PDF files.`);
      return;
    }

    const acceptedFiles = validFiles.slice(0, availableSlots);

    if (acceptedFiles.length < validFiles.length) {
      setError(`You can select a maximum of ${MAX_FILES} PDF files.`);
    }

    const newItems = acceptedFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
    }));

    const newTotal =
      totalSize +
      newItems.reduce((total, item) => total + item.file.size, 0);

    if (newTotal > MAX_TOTAL_SIZE) {
      setError("Total file size cannot exceed 100 MB.");
      return;
    }

    setFiles((current) => [...current, ...newItems]);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    addFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);

    addFiles(Array.from(event.dataTransfer.files));
  }

  function removeFile(id: string) {
    setFiles((current) => current.filter((item) => item.id !== id));
    setError("");
    setSuccess("");
  }

  function moveFile(index: number, direction: -1 | 1) {
    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= files.length) return;

    setFiles((current) => {
      const updated = [...current];
      const [moved] = updated.splice(index, 1);
      updated.splice(newIndex, 0, moved);
      return updated;
    });

    setSuccess("");
  }

  function handleDragStart(id: string) {
    setDraggedId(id);
  }

  function handleFileDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  function handleFileDrop(
    event: DragEvent<HTMLDivElement>,
    targetId: string
  ) {
    event.preventDefault();

    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      return;
    }

    setFiles((current) => {
      const updated = [...current];

      const fromIndex = updated.findIndex(
        (item) => item.id === draggedId
      );

      const toIndex = updated.findIndex(
        (item) => item.id === targetId
      );

      if (fromIndex === -1 || toIndex === -1) {
        return current;
      }

      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);

      return updated;
    });

    setDraggedId(null);
    setSuccess("");
  }

  async function mergePdfs() {
    if (files.length < 2) {
      setError("Please select at least two PDF files.");
      return;
    }

    if (totalSize > MAX_TOTAL_SIZE) {
      setError("Total file size cannot exceed 100 MB.");
      return;
    }

    const downloadFileName = sanitizeFileName(fileName);

    setIsMerging(true);
    setError("");
    setSuccess("");
    setProgress("Preparing your PDF documents...");

    try {
      const { PDFDocument } = await import("pdf-lib");
      const mergedPdf = await PDFDocument.create();

      for (let index = 0; index < files.length; index++) {
        const item = files[index];

        setProgress(
          `Processing ${index + 1} of ${files.length}: ${item.file.name}`
        );

        const buffer = await item.file.arrayBuffer();
        const sourcePdf = await PDFDocument.load(buffer);

        const pages = await mergedPdf.copyPages(
          sourcePdf,
          sourcePdf.getPageIndices()
        );

        pages.forEach((page) => mergedPdf.addPage(page));
      }

      setProgress("Creating your merged PDF...");

      const mergedBytes = await mergedPdf.save();

      const blob = new Blob([mergedBytes as BlobPart], {
        type: "application/pdf",
      });

      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = downloadUrl;
      link.download = downloadFileName;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.setTimeout(() => {
        URL.revokeObjectURL(downloadUrl);
      }, 1000);

      setSuccess(`Your PDF was downloaded as ${downloadFileName}.`);
      setProgress("");
    } catch (err) {
      console.error("PDF merge error:", err);

      setError(
        "Unable to merge these PDF files. Check that they are valid, unencrypted PDF documents and try again."
      );

      setProgress("");
    } finally {
      setIsMerging(false);
    }
  }

  function clearFiles() {
    setFiles([]);
    setError("");
    setSuccess("");
    setProgress("");
  }

  return (
    <div className="merge-tool">
      <div
        className={`upload-area ${dragging ? "upload-area-active" : ""}`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(event) => {
          const nextTarget = event.relatedTarget;

          if (
            !(nextTarget instanceof Node) ||
            !event.currentTarget.contains(nextTarget)
          ) {
            setDragging(false);
          }
        }}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          multiple
          hidden
          onChange={handleFileChange}
        />

        <div className="upload-icon">
          <Upload size={26} />
        </div>

        <h2>Add PDF files</h2>

        <p>
          Drag and drop your PDF documents here, or choose
          files from your device.
        </p>

        <button
          type="button"
          className="primary-button"
          onClick={() => inputRef.current?.click()}
          disabled={isMerging || files.length >= MAX_FILES}
        >
          <FilePlus2 size={18} />
          Select PDF files
        </button>

        <span className="upload-note">
          PDF files only · Maximum {MAX_FILES} files · 100 MB total
        </span>
      </div>

      {files.length > 0 && (
        <section className="selected-files">
          <div className="file-list-header">
            <div>
              <h3>Selected documents</h3>
              <p>
                {files.length} of {MAX_FILES} files ·{" "}
                {formatFileSize(totalSize)}
              </p>
            </div>

            <button
              type="button"
              className="text-button"
              onClick={clearFiles}
              disabled={isMerging}
            >
              Clear all
            </button>
          </div>

          <div className="file-list">
            {files.map((item, index) => (
              <div
                key={item.id}
                className={`file-item ${
                  draggedId === item.id ? "file-item-dragging" : ""
                }`}
                draggable={!isMerging}
                onDragStart={() => handleDragStart(item.id)}
                onDragOver={handleFileDragOver}
                onDrop={(event) => handleFileDrop(event, item.id)}
                onDragEnd={() => setDraggedId(null)}
              >
                <div className="file-item-main">
                  <GripVertical
                    size={18}
                    className="file-drag-handle"
                  />

                  <FileText size={22} className="file-icon" />

                  <div className="file-details">
                    <span className="file-name" title={item.file.name}>
                      {item.file.name}
                    </span>

                    <span className="file-size">
                      {formatFileSize(item.file.size)}
                    </span>
                  </div>
                </div>

                <div className="file-actions">
                  <span className="file-order">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <button
                    type="button"
                    aria-label={`Move ${item.file.name} up`}
                    title="Move up"
                    onClick={() => moveFile(index, -1)}
                    disabled={index === 0 || isMerging}
                  >
                    <ArrowUp size={17} />
                  </button>

                  <button
                    type="button"
                    aria-label={`Move ${item.file.name} down`}
                    title="Move down"
                    onClick={() => moveFile(index, 1)}
                    disabled={index === files.length - 1 || isMerging}
                  >
                    <ArrowDown size={17} />
                  </button>

                  <button
                    type="button"
                    aria-label={`Remove ${item.file.name}`}
                    title="Remove file"
                    onClick={() => removeFile(item.id)}
                    disabled={isMerging}
                  >
                    <X size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="file-order-note">
            Documents will be combined in the order shown above.
            Drag files or use the arrow buttons to rearrange them.
          </p>

          <div className="download-name-field">
            <label htmlFor="merge-file-name" className="field-label">
              Download file name
            </label>

            <input
              id="merge-file-name"
              type="text"
              className="field"
              value={fileName}
              onChange={(event) => setFileName(event.target.value)}
              placeholder="Enter your file name"
              maxLength={100}
              disabled={isMerging}
            />

            <p className="muted">
              Your file will be downloaded as{" "}
              <strong>{sanitizeFileName(fileName)}</strong>
            </p>
          </div>

          <button
            type="button"
            className="primary-button merge-button"
            onClick={mergePdfs}
            disabled={!canMerge}
          >
            {isMerging ? (
              <>
                <LoaderCircle size={18} className="animate-spin" />
                Merging PDFs...
              </>
            ) : (
              <>
                <FilePlus2 size={18} />
                Merge PDFs
              </>
            )}
          </button>

          {files.length < 2 && (
            <p className="merge-hint">
              Add at least two PDF files to start merging.
            </p>
          )}
        </section>
      )}

      {progress && (
        <div className="tool-status" role="status" aria-live="polite">
          <LoaderCircle size={18} className="animate-spin" />
          <span>{progress}</span>
        </div>
      )}

      {error && (
        <div className="tool-error" role="alert">
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="tool-success" role="status">
          <Download size={18} />
          <span>{success}</span>
        </div>
      )}

      <div className="privacy-note">
        <FileText size={17} />
        <p>
          Your PDF documents are processed locally in your browser.
          They are not uploaded to Toolio.
        </p>
      </div>
    </div>
  );
}

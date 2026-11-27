"use client";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import ToolShell from "@/components/ToolShell";
export default function MergePdf() {
 const [files,setFiles]=useState<File[]>([]); const [busy,setBusy]=useState(false); const [url,setUrl]=useState(""); const [error,setError]=useState("");
 function addFiles(list:FileList|null){if(!list)return;setFiles(old=>[...old,...Array.from(list).filter(f=>f.type==="application/pdf")]);setUrl("");setError("");}
 async function merge(){try{setBusy(true);setError("");const out=await PDFDocument.create();for(const file of files){const pdf=await PDFDocument.load(await file.arrayBuffer());const pages=await out.copyPages(pdf,pdf.getPageIndices());pages.forEach(p=>out.addPage(p));}const bytes=await out.save();const blob=new Blob([bytes as BlobPart],{type:"application/pdf"});setUrl(URL.createObjectURL(blob));}catch(e){setError("Could not read one of these PDFs. Check that they are valid and not password-protected.");}finally{setBusy(false);}}
 return <ToolShell title="Merge PDF" description="Combine multiple PDF files into one document. Add files one at a time or select several together; their order is preserved.">
 <h2 className="panel-title">Add PDF files</h2><div className="dropzone"><strong>Select PDF files</strong><p className="muted">Files are processed locally in your browser.</p><input type="file" accept="application/pdf" multiple onChange={e=>addFiles(e.target.files)}/></div>
 {files.length>0&&<div className="file-list">{files.map((f,i)=><div className="file-item" key={`${f.name}-${i}`}><span>{i+1}. {f.name}</span><button className="muted" onClick={()=>setFiles(old=>old.filter((_,n)=>n!==i))}>Remove</button></div>)}</div>}
 <div className="actions"><button className="button" disabled={files.length<2||busy} onClick={merge}>{busy?"Merging...":"Merge PDFs"}</button><button className="button secondary" onClick={()=>{setFiles([]);setUrl("");setError("");}}>Clear</button></div>
 {error&&<p className="status error">{error}</p>}{url&&<p className="status"><a className="button" href={url} download="toolio-merged.pdf">Download merged PDF</a></p>}
 </ToolShell>;
}

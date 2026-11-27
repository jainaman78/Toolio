"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
export default function ImageCompressor(){
 const [file,setFile]=useState<File|null>(null),[quality,setQuality]=useState(0.75),[format,setFormat]=useState("image/jpeg"),[url,setUrl]=useState(""),[size,setSize]=useState(0),[error,setError]=useState("");
 async function compress(){if(!file)return;try{const img=new Image(),src=URL.createObjectURL(file);img.src=src;await img.decode();const canvas=document.createElement("canvas");canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;canvas.getContext("2d")!.drawImage(img,0,0);const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(),format,quality));const next=URL.createObjectURL(blob);setUrl(next);setSize(blob.size);URL.revokeObjectURL(src);}catch{setError("This image could not be processed. Try a JPEG, PNG or WebP file.");}}
 return <ToolShell title="Image Compressor" description="Reduce the size of an image and save a lighter copy. Choose the output format and quality before downloading.">
 <label className="field-label">Choose an image</label><input className="field" type="file" accept="image/*" onChange={e=>{setFile(e.target.files?.[0]||null);setUrl("");setError("");}}/>
 <label className="field-label">Output format</label><select className="field" value={format} onChange={e=>setFormat(e.target.value)}><option value="image/jpeg">JPEG</option><option value="image/webp">WebP</option><option value="image/png">PNG (quality setting not applied)</option></select>
 <label className="field-label">Quality: {Math.round(quality*100)}%</label><input type="range" min=".2" max="1" step=".05" value={quality} onChange={e=>setQuality(Number(e.target.value))} style={{width:"100%"}}/>
 <div className="actions"><button className="button" disabled={!file} onClick={compress}>Compress image</button></div>
 {error&&<p className="status error">{error}</p>}{url&&<div className="result"><p className="muted">Original: {((file?.size||0)/1024).toFixed(1)} KB · New: {(size/1024).toFixed(1)} KB</p><a className="button" href={url} download={`toolio-compressed.${format==="image/webp"?"webp":format==="image/png"?"png":"jpg"}`}>Download image</a></div>}
 </ToolShell>;
}

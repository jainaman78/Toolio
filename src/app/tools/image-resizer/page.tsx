"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
export default function ImageResizer(){
 const [file,setFile]=useState<File|null>(null),[w,setW]=useState(800),[h,setH]=useState(800),[url,setUrl]=useState("");
 async function resize(){if(!file)return;const img=new Image();img.src=URL.createObjectURL(file);await img.decode();const c=document.createElement("canvas");c.width=w;c.height=h;c.getContext("2d")!.drawImage(img,0,0,w,h);const blob=await new Promise<Blob>(r=>c.toBlob(b=>r(b!),"image/png"));setUrl(URL.createObjectURL(blob));}
 return <ToolShell title="Image Resizer" description="Set the exact width and height in pixels, then download the resized image.">
 <label className="field-label">Choose an image</label><input className="field" type="file" accept="image/*" onChange={e=>{setFile(e.target.files?.[0]||null);setUrl("");}}/>
 <div className="row-fields"><div><label className="field-label">Width (px)</label><input className="field" type="number" min="1" max="10000" value={w} onChange={e=>setW(Number(e.target.value))}/></div><div><label className="field-label">Height (px)</label><input className="field" type="number" min="1" max="10000" value={h} onChange={e=>setH(Number(e.target.value))}/></div></div>
 <div className="actions"><button className="button" disabled={!file||w<1||h<1} onClick={resize}>Resize image</button>{url&&<a className="button" href={url} download="toolio-resized.png">Download PNG</a>}</div>
 </ToolShell>;
}

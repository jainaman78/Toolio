"use client";
import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import ToolShell from "@/components/ToolShell";
export default function QrGenerator(){const [value,setValue]=useState("https://toolio.co.in");const [made,setMade]=useState(false);function download(){const canvas=document.querySelector("#qr-code canvas") as HTMLCanvasElement|null;if(!canvas)return;const a=document.createElement("a");a.href=canvas.toDataURL("image/png");a.download="toolio-qr-code.png";a.click();}
 return <ToolShell title="QR Code Generator" description="Turn a website address or short text into a QR code you can save and share.">
 <label className="field-label">Website URL or text</label><textarea value={value} onChange={e=>{setValue(e.target.value);setMade(false);}} placeholder="Enter a URL or text..."/>
 <div className="actions"><button className="button" disabled={!value.trim()} onClick={()=>setMade(true)}>Generate QR code</button></div>
 {made&&<div className="result"><div id="qr-code" style={{display:"inline-block",background:"white",padding:16}}><QRCodeCanvas value={value} size={220} level="M"/></div><div className="actions"><button className="button" onClick={download}>Download PNG</button></div></div>}
 </ToolShell>;
}

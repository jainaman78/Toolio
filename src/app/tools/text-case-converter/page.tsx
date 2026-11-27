"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
export default function TextCase(){const [text,setText]=useState("");const [output,setOutput]=useState("");const title=(s:string)=>s.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase());return <ToolShell title="Text Case Converter" description="Convert text to uppercase, lowercase, title case or sentence case.">
 <label className="field-label">Your text</label><textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Paste text here..."/>
 <div className="actions">{[["UPPERCASE",()=>text.toUpperCase()],["lowercase",()=>text.toLowerCase()],["Title Case",()=>title(text)],["Sentence case",()=>text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g,c=>c.toUpperCase())]].map(([label,fn])=><button className="button secondary" key={label as string} onClick={()=>setOutput((fn as ()=>string)())}>{label as string}</button>)}</div>
 <label className="field-label">Converted text</label><textarea value={output} onChange={e=>setOutput(e.target.value)} placeholder="Your converted text will appear here..."/>
 <div className="actions"><button className="button" onClick={()=>navigator.clipboard.writeText(output)} disabled={!output}>Copy text</button></div>
 </ToolShell>}

"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
export default function WordCounter(){const [value,setValue]=useState("");const words=value.trim()?value.trim().split(/\s+/).length:0;const sentences=value.trim()?value.split(/[.!?]+/).filter(s=>s.trim()).length:0;return <ToolShell title="Word Counter" description="Count words, characters and sentences while you write or edit text.">
 <label className="field-label">Paste or type your text</label><textarea value={value} onChange={e=>setValue(e.target.value)} placeholder="Start typing or paste your text here..."/>
 <div className="row-fields" style={{marginTop:16}}>{[["Words",words],["Characters",value.length],["Characters (no spaces)",value.replace(/\s/g,"").length],["Sentences",sentences]].map(([label,num])=><div className="result" key={label as string}><div className="muted">{label}</div><strong style={{fontSize:25,fontVariantNumeric:"tabular-nums"}}>{num}</strong></div>)}</div>
 </ToolShell>}

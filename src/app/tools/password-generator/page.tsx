"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
export default function PasswordGenerator(){const [length,setLength]=useState(16),[symbols,setSymbols]=useState(true),[password,setPassword]=useState("");function generate(){const chars="ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789"+(symbols?"!@#$%&*_-+=":"");const values=new Uint32Array(length);crypto.getRandomValues(values);setPassword(Array.from(values,v=>chars[v%chars.length]).join(""));}return <ToolShell title="Password Generator" description="Create a random password and choose its length and whether to include symbols.">
 <label className="field-label">Password length: {length}</label><input type="range" min="8" max="64" value={length} onChange={e=>setLength(Number(e.target.value))} style={{width:"100%"}}/>
 <label className="field-label"><input type="checkbox" checked={symbols} onChange={e=>setSymbols(e.target.checked)}/> Include symbols</label>
 <div className="actions"><button className="button" onClick={generate}>Generate password</button></div>
 {password&&<div className="result"><strong style={{fontSize:20,overflowWrap:"anywhere",fontFamily:"monospace"}}>{password}</strong><div className="actions"><button className="button secondary" onClick={()=>navigator.clipboard.writeText(password)}>Copy password</button></div></div>}
 </ToolShell>}

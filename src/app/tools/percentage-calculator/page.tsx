"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
export default function PercentageCalculator(){const [percent,setPercent]=useState("15"),[number,setNumber]=useState("200");const result=Number(percent)*Number(number)/100;return <ToolShell title="Percentage Calculator" description="Find a percentage of a number. Enter the percentage and the original value to calculate the result.">
 <div className="row-fields"><div><label className="field-label">Percentage (%)</label><input className="field" type="number" value={percent} onChange={e=>setPercent(e.target.value)}/></div><div><label className="field-label">Number</label><input className="field" type="number" value={number} onChange={e=>setNumber(e.target.value)}/></div></div>
 <div className="result"><div className="muted">Result</div><strong style={{fontSize:32,fontVariantNumeric:"tabular-nums"}}>{Number.isFinite(result)?result.toLocaleString(undefined,{maximumFractionDigits:6}):"—"}</strong></div>
 </ToolShell>}

 "use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

const tools = [
 {name:"Merge PDF",desc:"Combine multiple PDF files into one document.",category:"PDF",href:"/tools/merge-pdf"},
 {name:"Image Compressor",desc:"Reduce image file size and download a lighter copy.",category:"Image",href:"/tools/image-compressor"},
 {name:"Image Resizer",desc:"Resize an image to exact pixel dimensions.",category:"Image",href:"/tools/image-resizer"},
 {name:"QR Code Generator",desc:"Create a QR code from a link or plain text.",category:"Generator",href:"/tools/qr-generator"},
 {name:"Word Counter",desc:"Count words, characters, sentences and reading time.",category:"Text",href:"/tools/word-counter"},
 {name:"Text Case Converter",desc:"Switch text between upper, lower, title and sentence case.",category:"Text",href:"/tools/text-case-converter"},
 {name:"Password Generator",desc:"Generate a random password with adjustable length.",category:"Generator",href:"/tools/password-generator"},
 {name:"Percentage Calculator",desc:"Calculate a percentage of a number or the percentage change.",category:"Calculator",href:"/tools/percentage-calculator"},
];
const categories = ["All","PDF","Image","Text","Generator","Calculator"];

export default function Home() {
 const [query,setQuery] = useState("");
 const [category,setCategory] = useState("All");
 const visible = useMemo(()=>tools.filter(t=>(category==="All"||t.category===category)&&(`${t.name} ${t.desc}`.toLowerCase().includes(query.toLowerCase()))),[query,category]);
 return <main>
  <section className="container hero">
   <div><h1>Small tools.<br/>Less <em>busywork.</em></h1></div>
   <p className="hero-copy">Toolio helps you handle everyday file and text tasks in a few steps. Choose a tool, add your file or text, and download the result.</p>
  </section>
  <section className="container section" id="tools">
   <div className="section-head">
    <div><h2>Find the right tool</h2><p>Practical utilities for everyday work.</p></div>
    <div className="search-wrap"><Search size={17} className="search-icon"/><input aria-label="Search tools" placeholder="Search tools..." value={query} onChange={e=>setQuery(e.target.value)}/></div>
   </div>
   <div className="category-tabs" aria-label="Filter tools">
    {categories.map(c=><button key={c} className={`tab ${category===c?"active":""}`} onClick={()=>setCategory(c)}>{c}</button>)}
   </div>
   <div className="tool-grid">
    {visible.map(t=><Link className="tool-card" href={t.href} key={t.href}><h3>{t.name}</h3><p>{t.desc}</p><div className="card-bottom">Open tool →</div></Link>)}
   </div>
   {visible.length===0&&<p className="muted">No tools match that search. Try a different term.</p>}
  </section>
  <section className="container" id="how-it-works">
   <div className="callout"><div><h2>Made for quick, focused tasks.</h2><p>Most included tools process your files directly in your browser.</p></div><Link className="button" href="/#tools">Browse tools</Link></div>
  </section>
 </main>;
}

import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Download, RefreshCw, FileText } from 'lucide-react'
import { PDFDocument, StandardFonts, degrees, rgb } from 'pdf-lib'
import QRCode from 'qrcode'
import { tools } from '../config'
import { PageShell, Dropzone } from '../components/Shell'
import { downloadBlob, loadImage } from '../utils'

function ToolWorkspace({ slug }: { slug: string }) {
  const [files, setFiles] = useState<File[]>([])
  const [text, setText] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [quality, setQuality] = useState(75)
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(600)
  const [pages, setPages] = useState('1')
  const [watermark, setWatermark] = useState('CONFIDENTIAL')
  const [gst, setGst] = useState(18)
  const [dob, setDob] = useState('')
  const [qrUrl, setQrUrl] = useState('')
  const [passwordLength, setPasswordLength] = useState(16)
  const [includeSymbols, setIncludeSymbols] = useState(true)

  const reset = () => { setFiles([]); setResult(''); setError(''); setText('') }
  const fail = (e: unknown) => setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
  const run = async () => {
    setError(''); setResult(''); setBusy(true)
    try {
      if (slug === 'merge-pdf') {
        if (files.length < 2) throw new Error('Select at least two PDF files.')
        const merged = await PDFDocument.create()
        for (const f of files) {
          const doc = await PDFDocument.load(await f.arrayBuffer())
          const copied = await merged.copyPages(doc, doc.getPageIndices())
          copied.forEach(p => merged.addPage(p))
        }
        downloadBlob(new Blob([await merged.save()], {type:'application/pdf'}), 'toolio-merged.pdf')
        setResult('Your merged PDF has been downloaded.')
      } else if (slug === 'split-pdf') {
        if (!files[0]) throw new Error('Choose a PDF file.')
        const source = await PDFDocument.load(await files[0].arrayBuffer())
        const selected = pages.split(',').map(x=>Number(x.trim())-1).filter(x=>Number.isInteger(x)&&x>=0&&x<source.getPageCount())
        if (!selected.length) throw new Error(`Enter valid page numbers from 1 to ${source.getPageCount()}.`)
        const out = await PDFDocument.create()
        const copied = await out.copyPages(source, selected)
        copied.forEach(p=>out.addPage(p))
        downloadBlob(new Blob([await out.save()], {type:'application/pdf'}), 'toolio-split.pdf')
        setResult('Selected pages have been downloaded.')
      } else if (slug === 'rotate-pdf' || slug === 'add-watermark' || slug === 'compress-pdf') {
        if (!files[0]) throw new Error('Choose a PDF file.')
        const doc = await PDFDocument.load(await files[0].arrayBuffer())
        if (slug === 'rotate-pdf') doc.getPages().forEach(p=>p.setRotation(degrees((p.getRotation().angle+90)%360)))
        if (slug === 'add-watermark') {
          const font = await doc.embedFont(StandardFonts.HelveticaBold)
          doc.getPages().forEach(p=>{const {width:w,height:h}=p.getSize();p.drawText(watermark,{x:w*.15,y:h*.5,size:34,font,color:rgb(.65,.65,.65),opacity:.35,rotate:degrees(35)})})
        }
        // pdf-lib does not perform deep object/image recompression; re-saving can remove some overhead.
        downloadBlob(new Blob([await doc.save()], {type:'application/pdf'}), `toolio-${slug}.pdf`)
        setResult(slug==='compress-pdf'?'PDF re-saved. This basic optimizer may not significantly reduce every file; deep image recompression is not included.':'Your PDF is ready.')
      } else if (slug === 'jpg-to-pdf') {
        if (!files.length) throw new Error('Choose one or more JPG/PNG images.')
        const doc = await PDFDocument.create()
        for (const f of files) {
          const bytes = await f.arrayBuffer()
          const img = f.type==='image/png' ? await doc.embedPng(bytes) : await doc.embedJpg(bytes)
          const page = doc.addPage([img.width,img.height])
          page.drawImage(img,{x:0,y:0,width:img.width,height:img.height})
        }
        downloadBlob(new Blob([await doc.save()], {type:'application/pdf'}), 'toolio-images.pdf')
        setResult('Your PDF has been created.')
      } else if (slug === 'pdf-to-jpg') {
        if (!files[0]) throw new Error('Choose a PDF file.')
        throw new Error('PDF-to-JPG rendering needs the PDF.js worker configured for your deployment. This tool is listed but not enabled in this starter build.')
      } else if (['compress-image','resize-image','jpg-to-png','png-to-jpg','image-cropper'].includes(slug)) {
        if (!files[0]) throw new Error('Choose an image.')
        const img = await loadImage(files[0])
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('Canvas is not supported by this browser.')
        if (slug==='resize-image') {canvas.width=Math.max(1,width);canvas.height=Math.max(1,height)}
        else if (slug==='image-cropper') {canvas.width=Math.min(width,img.width);canvas.height=Math.min(height,img.height)}
        else {canvas.width=img.width;canvas.height=img.height}
        if (slug==='image-cropper') ctx.drawImage(img,0,0,canvas.width,canvas.height,0,0,canvas.width,canvas.height)
        else ctx.drawImage(img,0,0,canvas.width,canvas.height)
        const type = slug==='jpg-to-png'?'image/png':slug==='png-to-jpg'?'image/jpeg':'image/jpeg'
        const blob = await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('Image conversion failed.')),type,quality/100))
        const ext = type==='image/png'?'png':'jpg'
        downloadBlob(blob, `toolio-${slug}.${ext}`)
        setResult(`Done. Original: ${(files[0].size/1024).toFixed(1)} KB · Output: ${(blob.size/1024).toFixed(1)} KB`)
      } else if (slug==='word-counter') {
        const words = text.trim() ? text.trim().split(/\s+/).length : 0
        const chars = text.length
        const sentences = text.trim() ? (text.match(/[.!?]+/g)||[]).length : 0
        setResult(`Words: ${words} · Characters: ${chars} · Sentences: ${sentences}`)
      } else if (slug==='case-converter') {
        setResult('Choose a case option below, then copy the converted text.')
      } else if (slug==='remove-duplicate-lines') {
        const lines = text.split(/\r?\n/)
        const unique = [...new Set(lines)]
        setText(unique.join('\n'))
        setResult(`Removed ${lines.length-unique.length} duplicate line(s).`)
      } else if (slug==='percentage-calculator') {
        const [a,b] = text.split(',').map(Number)
        if (!Number.isFinite(a)||!Number.isFinite(b)) throw new Error('Enter two numbers separated by a comma: percentage, total.')
        setResult(`${a}% of ${b} = ${(a*b/100).toLocaleString()}`)
      } else if (slug==='gst-calculator') {
        const amount = Number(text)
        if (!Number.isFinite(amount)||amount<0) throw new Error('Enter a valid amount.')
        const tax=amount*gst/100
        setResult(`GST: ${tax.toFixed(2)} · Total including GST: ${(amount+tax).toFixed(2)}`)
      } else if (slug==='age-calculator') {
        if (!dob) throw new Error('Select your date of birth.')
        const birth = new Date(`${dob}T00:00:00`)
        const now = new Date()
        if (birth>now) throw new Error('Date of birth cannot be in the future.')
        let age=now.getFullYear()-birth.getFullYear()
        if (now.getMonth()<birth.getMonth()||(now.getMonth()===birth.getMonth()&&now.getDate()<birth.getDate())) age--
        setResult(`Your age is ${age} years.`)
      } else if (slug==='qr-code-generator') {
        if (!qrUrl.trim()) throw new Error('Enter text or a URL.')
        const data = await QRCode.toDataURL(qrUrl,{width:500,margin:2})
        const a=document.createElement('a');a.href=data;a.download='toolio-qr-code.png';a.click()
        setResult('Your QR code PNG has been downloaded.')
      } else if (slug==='password-generator') {
        const chars='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'+(includeSymbols?'!@#$%^&*()-_=+':'')
        const values=new Uint32Array(passwordLength);crypto.getRandomValues(values)
        const password=Array.from(values,v=>chars[v%chars.length]).join('')
        setResult(password)
      }
    } catch(e) { fail(e) } finally { setBusy(false) }
  }

  const isFile = ['merge-pdf','split-pdf','compress-pdf','jpg-to-pdf','pdf-to-jpg','rotate-pdf','add-watermark','compress-image','resize-image','jpg-to-png','png-to-jpg','image-cropper'].includes(slug)
  const isText = ['word-counter','case-converter','remove-duplicate-lines','percentage-calculator','gst-calculator'].includes(slug)
  return <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-violet-100/40 sm:p-8">
    {isFile && <><Dropzone
  multiple={false}
  accept={
    slug.includes('image') ||
    slug.includes('jpg') ||
    slug.includes('png') ||
    slug === 'image-cropper'
      ? 'image/*'
      : '.pdf,application/pdf'
  }
  onFiles={(newFiles) => {
    if (slug === 'merge-pdf' || slug === 'jpg-to-pdf') {
      setFiles(currentFiles => [...currentFiles, ...newFiles]);
    } else {
      setFiles(newFiles);
    }
  }}
/>{files.length>0&&<div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm">{files.map((f, index)=><div key={`${f.name}-${index}`} className="flex justify-between gap-3 py-1"><span className="truncate">{f.name}</span><span className="shrink-0 text-slate-400">{(f.size/1024).toFixed(1)} KB</span></div>)}</div>}</>}
    {slug==='split-pdf'&&<label className="mt-5 block text-sm font-semibold">Page numbers <input value={pages} onChange={e=>setPages(e.target.value)} placeholder="e.g. 1,3,5" className="mt-2 w-full rounded-xl border p-3 font-normal"/></label>}
    {slug==='add-watermark'&&<label className="mt-5 block text-sm font-semibold">Watermark text<input value={watermark} onChange={e=>setWatermark(e.target.value)} className="mt-2 w-full rounded-xl border p-3 font-normal"/></label>}
    {['compress-image'].includes(slug)&&<label className="mt-5 block text-sm font-semibold">Image quality: {quality}%<input type="range" min="10" max="100" value={quality} onChange={e=>setQuality(+e.target.value)} className="mt-3 w-full accent-violet-700"/></label>}
    {['resize-image','image-cropper'].includes(slug)&&<div className="mt-5 grid grid-cols-2 gap-3"><label className="text-sm font-semibold">Width (px)<input type="number" value={width} onChange={e=>setWidth(+e.target.value)} className="mt-2 w-full rounded-xl border p-3"/></label><label className="text-sm font-semibold">Height (px)<input type="number" value={height} onChange={e=>setHeight(+e.target.value)} className="mt-2 w-full rounded-xl border p-3"/></label></div>}
    {isText&&<label className="mt-1 block text-sm font-semibold">Enter your text or numbers<textarea rows={7} value={text} onChange={e=>setText(e.target.value)} placeholder={slug==='percentage-calculator'?'Enter percentage, total (e.g. 15, 200)':slug==='gst-calculator'?'Enter amount (e.g. 1000)':'Type or paste your text here...'} className="mt-2 w-full rounded-xl border border-slate-200 p-4 font-normal outline-none focus:border-violet-400"/></label>}
    {slug==='case-converter'&&<div className="mt-3 flex flex-wrap gap-2">{[['UPPERCASE',()=>setText(text.toUpperCase())],['lowercase',()=>setText(text.toLowerCase())],['Title Case',()=>setText(text.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase()))],['Sentence case',()=>setText(text.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g,c=>c.toUpperCase()))]].map(([label,fn]:any)=><button onClick={fn} className="rounded-lg border px-3 py-2 text-xs font-semibold hover:bg-violet-50">{label}</button>)}</div>}
    {slug==='gst-calculator'&&<label className="mt-4 block text-sm font-semibold">GST rate<select value={gst} onChange={e=>setGst(+e.target.value)} className="mt-2 w-full rounded-xl border p-3 font-normal">{[0,5,12,18,28].map(v=><option value={v}>{v}%</option>)}</select></label>}
    {slug==='age-calculator'&&<label className="mt-1 block text-sm font-semibold">Date of birth<input type="date" value={dob} onChange={e=>setDob(e.target.value)} className="mt-2 w-full rounded-xl border p-3 font-normal"/></label>}
    {slug==='qr-code-generator'&&<label className="mt-1 block text-sm font-semibold">Text or URL<input value={qrUrl} onChange={e=>setQrUrl(e.target.value)} placeholder="https://example.com" className="mt-2 w-full rounded-xl border p-3 font-normal"/></label>}
    {slug==='password-generator'&&<div className="mt-1 space-y-4"><label className="block text-sm font-semibold">Password length: {passwordLength}<input type="range" min="8" max="64" value={passwordLength} onChange={e=>setPasswordLength(+e.target.value)} className="mt-3 w-full accent-violet-700"/></label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={includeSymbols} onChange={e=>setIncludeSymbols(e.target.checked)}/> Include symbols</label></div>}
    <div className="mt-6 flex flex-wrap gap-3"><button disabled={busy} onClick={run} className="rounded-xl bg-violet-700 px-6 py-3 text-sm font-bold text-white hover:bg-violet-800 disabled:opacity-50">{busy?'Processing...':slug==='word-counter'?'Count text':slug==='qr-code-generator'?'Generate QR code':slug==='password-generator'?'Generate password':'Process now'}</button><button onClick={reset} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"><RefreshCw size={16}/> Reset</button></div>
    {error&&<p role="alert" className="mt-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}
    {result&&<div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"><p className="font-semibold">Result</p><p className="mt-1 break-words">{result}</p>{slug==='password-generator'&&<button onClick={()=>navigator.clipboard.writeText(result)} className="mt-3 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-bold text-white">Copy password</button>}{slug==='case-converter'&&<button onClick={()=>navigator.clipboard.writeText(text)} className="mt-3 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-bold text-white">Copy text</button>}</div>}
    <p className="mt-5 text-xs leading-5 text-slate-400">Privacy note: supported file operations run locally in your browser. Do not use this starter site for highly sensitive documents until you have independently reviewed and tested the complete deployment.</p>
  </div>
}

export default function ToolPage() {
  const { slug='' } = useParams()
  const tool = tools.find(t=>t.slug===slug)
  if (!tool) return <PageShell><div className="mx-auto max-w-3xl px-5 py-24 text-center"><h1 className="text-3xl font-black">Page not found</h1><Link to="/" className="mt-5 inline-block text-violet-700">Return home</Link></div></PageShell>
  const Icon=tool.icon
  return <PageShell>
    <section className="bg-gradient-to-b from-violet-50 to-white px-5 py-12">
      <div className="mx-auto max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-violet-700"><ArrowLeft size={16}/> All tools</Link>
        <div className="mt-8 flex items-center gap-4"><div className="rounded-2xl bg-violet-100 p-4 text-violet-700"><Icon size={30}/></div><div><p className="text-sm font-semibold text-violet-700">{tool.category}</p><h1 className="text-3xl font-black tracking-tight sm:text-4xl">{tool.name}</h1></div></div>
        <p className="mt-4 max-w-2xl leading-7 text-slate-500">{tool.description}</p>
      </div>
    </section>
    <section className="mx-auto max-w-4xl px-5 py-10"><ToolWorkspace slug={slug}/><div className="mt-10"><h2 className="text-xl font-bold">How to use {tool.name}</h2><ol className="mt-4 list-inside list-decimal space-y-2 text-sm leading-6 text-slate-600"><li>Choose or enter the content required by the tool.</li><li>Adjust the available settings.</li><li>Select the process button and wait for the result.</li><li>Download or copy your result.</li></ol></div><div className="mt-10"><h2 className="text-xl font-bold">Explore related tools</h2><div className="mt-4 flex flex-wrap gap-2">{tools.filter(t=>t.category===tool.category&&t.slug!==slug).map(t=><Link key={t.slug} to={`/${t.slug}`} className="rounded-full border px-4 py-2 text-sm hover:border-violet-300 hover:text-violet-700">{t.name}</Link>)}</div></div></section>
  </PageShell>
}

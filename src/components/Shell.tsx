import { Link, useNavigate } from 'react-router-dom'
import { Search, Menu, X, Wrench } from 'lucide-react'
import { categories } from '../config'
import { useState } from 'react'

export function Header() {
  const [open, setOpen] = useState(false)
  return <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur-xl">
    <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
      <Link to="/" className="text-3xl font-black tracking-tight text-violet-700">toolio<span className="text-violet-400">.</span></Link>
      <div className="hidden items-center gap-7 md:flex">
        {categories.map(c => <Link key={c.slug} to={`/${c.slug}`} className="text-sm font-semibold text-slate-600 hover:text-violet-700">{c.name}</Link>)}
      </div>
      <button onClick={() => setOpen(!open)} className="rounded-xl border border-slate-200 p-2 md:hidden" aria-label="Toggle navigation">{open ? <X/> : <Menu/>}</button>
      <Link to="/#tools" className="hidden rounded-xl bg-violet-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-violet-800 md:block">Explore tools</Link>
    </nav>
    {open && <div className="grid gap-1 border-t border-slate-100 bg-white p-4 md:hidden">{categories.map(c => <Link onClick={() => setOpen(false)} key={c.slug} to={`/${c.slug}`} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-violet-50">{c.name}</Link>)}</div>}
  </header>
}

export function Footer() {
  return <footer className="border-t border-slate-100 bg-slate-50 px-5 py-10">
    <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 sm:flex-row">
      <div><Link to="/" className="text-2xl font-black text-violet-700">toolio.</Link><p className="mt-2 max-w-sm text-sm text-slate-500">Simple, useful online tools for everyday tasks.</p></div>
      <div className="flex flex-wrap gap-5 text-sm text-slate-500"><Link to="/about">About</Link><Link to="/contact">Contact</Link><Link to="/privacy-policy">Privacy</Link><Link to="/terms">Terms</Link></div>
    </div>
    <p className="mx-auto mt-8 max-w-7xl border-t border-slate-200 pt-5 text-xs text-slate-400">© {new Date().getFullYear()} Toolio. All rights reserved.</p>
  </footer>
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return <><Header/><main>{children}</main><Footer/></>
}

export function SearchBox({ onSearch, initial = '' }: { onSearch: (v: string) => void, initial?: string }) {
  const [value, setValue] = useState(initial)
  return <form onSubmit={e => { e.preventDefault(); onSearch(value) }} className="mx-auto flex max-w-2xl items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-violet-100/60 focus-within:border-violet-400">
    <Search className="ml-3 shrink-0 text-slate-400" size={21}/>
    <input value={value} onChange={e => { setValue(e.target.value); onSearch(e.target.value) }} placeholder="Search for a tool..." className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none sm:text-base"/>
    <button className="rounded-xl bg-violet-700 px-5 py-3 text-sm font-bold text-white hover:bg-violet-800">Search</button>
  </form>
}

export function Dropzone({ onFiles, multiple = false, accept = '*' }: { onFiles: (files: File[]) => void, multiple?: boolean, accept?: string }) {
  const [drag, setDrag] = useState(false)
  return <label onDragOver={e => { e.preventDefault(); setDrag(true) }} onDragLeave={() => setDrag(false)} onDrop={e => { e.preventDefault(); setDrag(false); onFiles(Array.from(e.dataTransfer.files)) }}
    className={`flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition ${drag ? 'border-violet-500 bg-violet-50' : 'border-violet-200 bg-violet-50/50 hover:bg-violet-50'}`}>
    <div className="mb-4 rounded-2xl bg-white p-4 text-violet-700 shadow-sm"><Wrench size={28}/></div>
    <span className="font-bold text-slate-800">Choose files or drag them here</span>
    <span className="mt-2 text-sm text-slate-500">Files are processed in your browser when possible.</span>
    <span className="mt-4 rounded-xl bg-violet-700 px-5 py-2.5 text-sm font-bold text-white">Select files</span>
    <input type="file" multiple={multiple} accept={accept} className="hidden" onChange={e => { if (e.target.files) onFiles(Array.from(e.target.files)); e.currentTarget.value = '' }}/>
  </label>
}

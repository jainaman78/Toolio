import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Zap, ShieldCheck } from 'lucide-react'
import { categories, tools } from '../config'
import { PageShell, SearchBox } from '../components/Shell'

export default function Home() {
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return (q ? tools.filter(t => `${t.name} ${t.description} ${t.category}`.toLowerCase().includes(q)) : tools.filter(t => t.popular))
  }, [query])
  return <PageShell>
    <section className="relative overflow-hidden bg-gradient-to-b from-violet-50 via-white to-white px-5 pb-16 pt-20">
      <div className="pointer-events-none absolute -right-24 -top-28 h-96 w-96 rounded-full bg-violet-200/40 blur-3xl"/>
      <div className="relative mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white px-4 py-2 text-sm font-semibold text-violet-700 shadow-sm"><Sparkles size={15}/> Your everyday utility toolbox</div>
        <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-6xl">Everything you need.<span className="block text-violet-700">All in one place.</span></h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">Convert files, edit images, calculate numbers and simplify everyday tasks with free online tools.</p>
        <div className="mt-10"><SearchBox onSearch={setQuery}/></div>
        <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs text-slate-500"><span>Popular:</span>{['Merge PDF','Compress Image','GST Calculator'].map(x=><button key={x} onClick={()=>{setQuery(x);document.getElementById('tools')?.scrollIntoView({behavior:'smooth'})}} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 hover:border-violet-300 hover:text-violet-700">{x}</button>)}</div>
      </div>
    </section>
    <section className="mx-auto grid max-w-5xl grid-cols-1 gap-5 px-5 py-8 sm:grid-cols-3">
      {[[Zap,'Fast & simple','Easy-to-use online utilities'],[ShieldCheck,'Privacy focused','Browser-based processing where possible'],[Sparkles,'Free to use','No account required']].map(([Icon,title,desc]: any)=><div key={title} className="flex items-center justify-center gap-3"><div className="rounded-xl bg-violet-50 p-3 text-violet-700"><Icon size={21}/></div><div><p className="text-sm font-bold">{title}</p><p className="text-xs text-slate-500">{desc}</p></div></div>)}
    </section>
    <section className="mx-auto max-w-7xl px-5 py-14">
      <div className="mb-8"><p className="text-sm font-bold text-violet-700">EXPLORE CATEGORIES</p><h2 className="mt-2 text-3xl font-black tracking-tight">What do you want to do?</h2><p className="mt-2 text-slate-500">Find the right tool for your task.</p></div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {categories.map(c=>{const Icon=c.icon;return <Link key={c.slug} to={`/${c.slug}`} className="group rounded-2xl border border-slate-100 p-5 transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/50"><div className="mb-5 inline-flex rounded-xl bg-violet-50 p-3 text-violet-700"><Icon size={24}/></div><h3 className="font-bold">{c.name}</h3><p className="mt-1 text-xs text-slate-500">{tools.filter(t=>t.category===c.name).length} tools</p><ArrowRight className="mt-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-violet-700" size={18}/></Link>})}
      </div>
    </section>
    <section id="tools" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-14">
      <div className="mb-8"><p className="text-sm font-bold text-violet-700">OUR TOOLBOX</p><h2 className="mt-2 text-3xl font-black tracking-tight">{query?'Search results':'Popular tools'}</h2><p className="mt-2 text-slate-500">{filtered.length} tools found</p></div>
      {filtered.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filtered.map(t=>{const Icon=t.icon;return <Link key={t.slug} to={`/${t.slug}`} className="group rounded-2xl border border-slate-100 p-5 transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/40"><div className="mb-5 flex items-center justify-between"><div className="rounded-xl bg-violet-50 p-3 text-violet-700"><Icon size={23}/></div>{t.popular&&<span className="rounded-full bg-violet-50 px-3 py-1 text-[10px] font-black text-violet-700">POPULAR</span>}</div><h3 className="font-bold group-hover:text-violet-700">{t.name}</h3><p className="mt-2 min-h-10 text-sm leading-5 text-slate-500">{t.description}</p><div className="mt-5 flex items-center justify-between"><span className="text-xs text-slate-400">{t.category}</span><ArrowRight size={18} className="text-slate-300 group-hover:text-violet-700"/></div></Link>})}</div>:<p className="rounded-2xl border border-dashed p-12 text-center text-slate-500">No tools found. Try another search.</p>}
    </section>
    <section className="mx-5 mb-16 rounded-3xl bg-violet-700 px-6 py-14 text-center text-white sm:mx-auto sm:max-w-7xl"><h2 className="text-3xl font-black">Make everyday tasks easier.</h2><p className="mt-3 text-violet-100">Explore the Toolio collection and get things done.</p><a href="#tools" className="mt-7 inline-flex rounded-xl bg-white px-6 py-3 text-sm font-bold text-violet-700">Explore tools</a></section>
  </PageShell>
}

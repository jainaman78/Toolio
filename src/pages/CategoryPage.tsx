import { Link, useParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { categories, tools } from '../config'
import { PageShell } from '../components/Shell'

export default function CategoryPage() {
  const { slug='' }=useParams()
  const category=categories.find(c=>c.slug===slug)
  if(!category) return <PageShell><div className="p-20 text-center">Category not found.</div></PageShell>
  const items=tools.filter(t=>t.category===category.name)
  return <PageShell><section className="bg-violet-50 px-5 py-16"><div className="mx-auto max-w-7xl"><p className="font-bold text-violet-700">TOOLIO COLLECTION</p><h1 className="mt-3 text-4xl font-black">{category.name}</h1><p className="mt-3 text-slate-500">Explore {items.length} useful {category.name.toLowerCase()}.</p></div></section><section className="mx-auto grid max-w-7xl gap-4 px-5 py-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{items.map(t=>{const Icon=t.icon;return <Link key={t.slug} to={`/${t.slug}`} className="rounded-2xl border border-slate-100 p-5 transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg"><div className="mb-4 inline-flex rounded-xl bg-violet-50 p-3 text-violet-700"><Icon/></div><h2 className="font-bold">{t.name}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{t.description}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-violet-700">Open tool <ArrowRight size={16}/></span></Link>})}</section></PageShell>
}

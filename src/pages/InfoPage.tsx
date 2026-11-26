import { useLocation } from 'react-router-dom'
import { PageShell } from '../components/Shell'
export default function InfoPage() {
  const path=useLocation().pathname
  const title=path==='/about'?'About Toolio':path==='/contact'?'Contact Toolio':path==='/terms'?'Terms of Use':'Privacy Policy'
  return <PageShell><section className="mx-auto max-w-3xl px-5 py-20"><h1 className="text-4xl font-black">{title}</h1><div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
    {path==='/about'&&<p>Toolio is a collection of browser-based utilities designed to make everyday digital tasks simpler. This starter website is under development.</p>}
    {path==='/contact'&&<><p>For support or business enquiries, replace this placeholder with your official support email before launch.</p><p className="rounded-xl bg-amber-50 p-4 text-amber-800">Contact email has not yet been configured.</p></>}
    {path==='/terms'&&<p>Use this website at your own discretion. Tools are provided as-is. Always verify important outputs and retain backups of original files.</p>}
    {path==='/privacy-policy'&&<><p>Toolio aims to process supported files locally in your browser. Some future services may use external processing. This starter policy is not a substitute for a complete privacy policy.</p><p>Before public launch, document analytics, advertising cookies, third-party services, data retention, contact details and applicable legal requirements accurately.</p></>}
  </div></section></PageShell>
}

import { useMemo, useState } from 'react';
import { BriefcaseBusiness, CalendarDays, Search, X } from 'lucide-react';
import { getDemoUser } from '../../login/demoAuth';
import { useDocumentTitle } from '../../companies/hooks/useDocumentTitle';
import { StudentWorkspace } from '../components/StudentWorkspace';
import { applicationStatuses, applicationStatusLabels, readApplications } from '../studentData';

const statusStyles = {
  Pending: 'bg-cream/20 text-charcoal',
  'Under Review': 'bg-navy/10 text-navy',
  Shortlisted: 'bg-olive/15 text-olive',
  Accepted: 'bg-olive/20 text-olive',
  Rejected: 'bg-terracotta/15 text-terracotta',
};

export function StudentApplicationsPage() {
  useDocumentTitle('Aplikimet e mia');
  const user = getDemoUser();
  const [applications] = useState(() => readApplications(user));
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('Të gjitha statuset');
  const [selected, setSelected] = useState(null);
  const visible = useMemo(() => applications.filter((application) => {
    const matchesQuery = `${application.position} ${application.company}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (status === 'Të gjitha statuset' || application.status === status);
  }), [applications, query, status]);

  return <StudentWorkspace title="Aplikimet e mia" subtitle="Aplikimet">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold tracking-[0.16em] text-cream/50 uppercase">Rrugëtimi yt profesional</p><h2 className="mt-2 font-display text-4xl text-cream">Aplikimet e mia</h2><p className="mt-2 text-cream/65">Shiko aplikimet dhe përcilli përditësimet nga kompanitë.</p></div><span className="rounded-xl border border-cream/15 bg-charcoal/60 px-4 py-3 text-sm text-cream/75">{applications.length} gjithsej</span></div>
    <div className="mt-6 grid gap-3 sm:grid-cols-[minmax(0,1fr)_13rem]"><label className="relative block"><span className="sr-only">Kërko aplikimet</span><Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-cream/45" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Kërko pozitën ose kompaninë" className="min-h-12 w-full rounded-xl border border-cream/15 bg-charcoal/60 pl-10 pr-4 text-cream placeholder:text-cream/40" /></label><label className="block"><span className="sr-only">Filtro sipas statusit</span><select value={status} onChange={(event) => setStatus(event.target.value)} className="min-h-12 w-full rounded-xl border border-cream/15 bg-charcoal px-3 text-cream"><option>Të gjitha statuset</option>{applicationStatuses.map((item) => <option key={item} value={item}>{applicationStatusLabels[item]}</option>)}</select></label></div>
    <div className="mt-5 space-y-3">{visible.map((application) => <article key={application.id} className="rounded-2xl border border-cream/15 bg-charcoal/55 p-5 text-cream sm:p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div className="flex min-w-0 items-start gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-cream/10 text-cream"><BriefcaseBusiness aria-hidden="true" className="size-5" /></span><div className="min-w-0"><h3 className="font-display text-xl sm:text-2xl">{application.position}</h3><p className="mt-1 text-sm text-cream/65">{application.company}</p></div></div><span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[application.status] ?? statusStyles.Pending}`}>{applicationStatusLabels[application.status] ?? 'Në pritje'}</span></div><div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-cream/10 pt-4"><span className="inline-flex items-center gap-2 text-sm text-cream/55"><CalendarDays aria-hidden="true" className="size-4" />Aplikuar më {application.date}</span><button type="button" onClick={() => setSelected(application)} className="min-h-10 rounded-lg border border-cream/20 px-4 py-2 text-sm font-semibold hover:bg-cream/10">Shiko detajet</button></div></article>)}
      {visible.length === 0 && <div className="rounded-2xl border border-dashed border-cream/20 bg-charcoal/30 px-6 py-12 text-center text-cream"><Search aria-hidden="true" className="mx-auto size-7 text-cream/55" /><h3 className="mt-4 font-display text-2xl">Nuk u gjet asnjë aplikim</h3><p className="mt-2 text-sm text-cream/60">Provo një kërkim tjetër ose ndrysho filtrin e statusit.</p><button type="button" onClick={() => { setQuery(''); setStatus('Të gjitha statuset'); }} className="mt-4 font-semibold underline underline-offset-4">Pastro filtrat</button></div>}
    </div>
    {selected && <div className="fixed inset-0 z-[70] grid place-items-center bg-charcoal/75 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}><section role="dialog" aria-modal="true" aria-labelledby="application-details-title" className="w-full max-w-lg rounded-2xl bg-cream p-6 text-charcoal shadow-2xl sm:p-8"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold tracking-[0.16em] text-charcoal/55 uppercase">Hollësitë e aplikimit</p><h3 id="application-details-title" className="mt-2 font-display text-3xl">{selected.position}</h3></div><button type="button" onClick={() => setSelected(null)} aria-label="Mbyll hollësitë" className="grid size-10 place-items-center rounded-full hover:bg-charcoal/10"><X aria-hidden="true" className="size-5" /></button></div><p className="mt-2 font-semibold text-charcoal/65">{selected.company}</p><div className="mt-6 grid gap-4 rounded-xl bg-white/45 p-4 sm:grid-cols-2"><div><p className="text-xs text-charcoal/55">Data e aplikimit</p><p className="mt-1 font-semibold">{selected.date}</p></div><div><p className="text-xs text-charcoal/55">Statusi aktual</p><span className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[selected.status] ?? statusStyles.Pending}`}>{applicationStatusLabels[selected.status] ?? 'Në pritje'}</span></div></div>{selected.cv && <p className="mt-4 text-sm"><span className="font-semibold">CV:</span> {selected.cv}</p>}{selected.message && <div className="mt-4"><p className="text-xs text-charcoal/55">Mesazhi i motivimit</p><p className="mt-1 leading-relaxed">{selected.message}</p></div>}<button type="button" onClick={() => setSelected(null)} className="mt-7 min-h-11 rounded-lg bg-charcoal px-5 py-2.5 font-semibold text-cream">Mbyll</button></section></div>}
  </StudentWorkspace>;
}

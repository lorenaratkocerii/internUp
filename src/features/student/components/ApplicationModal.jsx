import { useEffect, useState } from 'react';
import { BriefcaseBusiness, Check, FileText, X } from 'lucide-react';

export function ApplicationModal({ internship, studentName, cvName, onClose, onSubmit }) {
  const [cv, setCv] = useState(cvName || '');
  const [coverLetter, setCoverLetter] = useState('');
  const [motivation, setMotivation] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const fileName = (event, setter) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') setter(file.name);
    event.target.value = '';
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!cv || isSending) return;
    setError('');
    setIsSending(true);
    try {
      await onSubmit({ cv, coverLetter, message: motivation });
      setSubmitted(true);
    } catch (submitError) {
      setError(submitError.message || 'Aplikimi nuk u dërgua. Provo përsëri.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-charcoal/75 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="application-modal-title" className="my-5 w-full max-w-xl rounded-2xl border border-charcoal/10 bg-cream p-6 text-charcoal shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold tracking-[0.16em] text-charcoal/55 uppercase">Aplikimi për praktikë</p><h2 id="application-modal-title" className="mt-2 font-display text-3xl">{submitted ? 'Aplikimi u dërgua' : 'Shqyrto aplikimin tënd'}</h2></div><button type="button" onClick={onClose} className="grid size-10 place-items-center rounded-full hover:bg-charcoal/10" aria-label="Mbyll"><X aria-hidden="true" className="size-5" /></button></div>
        {submitted ? <div role="status" className="mt-7 rounded-xl border border-olive/25 bg-white/45 p-5"><span className="grid size-11 place-items-center rounded-full bg-olive text-white"><Check aria-hidden="true" className="size-6" /></span><h3 className="mt-4 font-display text-2xl">Gjithçka u krye, {studentName.split(' ')[0]}!</h3><p className="mt-2 leading-relaxed text-charcoal/70">Aplikimi u ruajt te Aplikimet e mia. Mund ta përcjellësh statusin aty.</p><button type="button" onClick={onClose} className="mt-5 min-h-11 rounded-lg bg-charcoal px-5 py-2.5 font-semibold text-cream">Në rregull</button></div> : <>
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-charcoal/10 bg-white/45 p-4"><span className="grid size-10 place-items-center rounded-lg bg-navy text-cream"><BriefcaseBusiness aria-hidden="true" className="size-5" /></span><div><p className="font-semibold">{internship.title}</p><p className="text-sm text-charcoal/65">{internship.company}</p></div></div>
          <form onSubmit={submit} className="mt-5 space-y-4"><div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold">Emri i studentit<input readOnly value={studentName} className="mt-1.5 min-h-11 w-full rounded-lg border border-charcoal/15 bg-white/45 px-3 font-normal" /></label><label className="block text-sm font-semibold">Pozita<input readOnly value={internship.title} className="mt-1.5 min-h-11 w-full rounded-lg border border-charcoal/15 bg-white/45 px-3 font-normal" /></label></div>
            <label className="block text-sm font-semibold">CV (PDF)<span className="mt-1.5 flex min-h-12 items-center justify-between gap-3 rounded-lg border border-charcoal/15 bg-white/40 px-3 font-normal"><span className="flex min-w-0 items-center gap-2 truncate text-charcoal/70"><FileText aria-hidden="true" className="size-4 shrink-0" />{cv || 'Zgjidh CV-në'}</span><span className="shrink-0 font-semibold underline underline-offset-2">{cv ? 'Zëvendëso' : 'Shfleto'}<input type="file" accept="application/pdf,.pdf" onChange={(event) => fileName(event, setCv)} className="sr-only" /></span></span></label>
            <label className="block text-sm font-semibold">Letër motivimi <span className="font-normal text-charcoal/60">(PDF, opsionale)</span><span className="mt-1.5 flex min-h-12 items-center justify-between gap-3 rounded-lg border border-charcoal/15 bg-white/40 px-3 font-normal"><span className="flex min-w-0 items-center gap-2 truncate text-charcoal/70"><FileText aria-hidden="true" className="size-4 shrink-0" />{coverLetter || 'Zgjidh letrën e motivimit'}</span><span className="shrink-0 font-semibold underline underline-offset-2">{coverLetter ? 'Zëvendëso' : 'Shfleto'}<input type="file" accept="application/pdf,.pdf" onChange={(event) => fileName(event, setCoverLetter)} className="sr-only" /></span></span></label>
            <label className="block text-sm font-semibold">Mesazhi i motivimit <span className="font-normal text-charcoal/60">(opsional)</span><textarea value={motivation} onChange={(event) => setMotivation(event.target.value)} rows={4} placeholder="Trego pse të intereson kjo mundësi..." className="mt-1.5 w-full rounded-lg border border-charcoal/20 bg-white/40 px-3 py-2.5 font-normal placeholder:text-charcoal/40" /></label>
            {!cv && <p className="text-sm font-semibold text-terracotta">Zgjidh një CV në formatin PDF për të vazhduar.</p>}
            {error && <p role="alert" className="rounded-lg bg-burgundy px-3 py-2 text-sm font-semibold text-cream">{error}</p>}
            <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} className="min-h-11 rounded-lg border border-charcoal/25 px-5 py-2.5 font-semibold hover:bg-charcoal/5">Anulo</button><button type="submit" disabled={!cv || isSending} className="min-h-11 rounded-lg bg-charcoal px-5 py-2.5 font-semibold text-cream hover:bg-navy disabled:cursor-not-allowed disabled:opacity-50">{isSending ? 'Duke u dërguar…' : 'Dërgo aplikimin'}</button></div>
          </form></>}
      </section>
    </div>
  );
}

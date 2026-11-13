import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { useAsyncData } from '../../home/hooks/useAsyncData';
import { Container } from '../../home/components/ui/Container';
import { StatusMessage } from '../../home/components/ui/StatusMessage';
import { CompanyLogo } from '../components/CompanyLogo';
import { NotFoundMessage } from '../components/NotFoundMessage';
import { PositionFacts } from '../components/PositionFacts';
import { StatusBadge } from '../components/StatusBadge';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { ApplicationModal } from '../../student/components/ApplicationModal';
import { getDemoUser } from '../../login/demoAuth';
import { applicantDetails, readStudentProfile } from '../../student/studentData';
import { useCurrentActor } from '../../auth/useCurrentActor';

export function PositionPage({ useCases, applicationUseCases }) {
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [showStudentAccountPrompt, setShowStudentAccountPrompt] = useState(false);
  const user = getDemoUser();
  const actor = useCurrentActor();
  const { companyId, positionId } = useParams();
  const load = useCallback(() => useCases.getPosition(companyId, positionId), [useCases, companyId, positionId]);
  const result = useAsyncData(load);
  const position = result.data?.position;
  const company = result.data?.company;

  useEffect(() => {
    if (position && window.location.hash === '#apliko' && user?.role !== 'student') {
      setShowStudentAccountPrompt(true);
    }
  }, [position, user?.role]);

  useDocumentTitle(position && `${position.title} te ${company.name}`);

  if (result.status === 'error') {
    return (
      <Container className="py-24">
        <StatusMessage className="text-cream/75">Pozita nuk u ngarkua. Provo përsëri më vonë.</StatusMessage>
      </Container>
    );
  }
  if (result.status === 'success' && !position) {
    return (
      <NotFoundMessage
        title="Kjo pozitë nuk u gjet."
        description="Mund të jetë hequr ose lidhja mund të jetë e pasaktë."
      />
    );
  }
  if (!position) return <div className="min-h-[60vh]" />;

  return (
    <Container className="py-12 lg:py-16">
      <nav aria-label="Vendndodhja në faqe">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-cream/75">
          <li>
            <Link to="/kompanite" className="underline underline-offset-4 hover:text-cream">
              Kompanitë
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="size-4" />
          </li>
          <li>
            <Link to={`/kompanite/${company.id}`} className="underline underline-offset-4 hover:text-cream">
              {company.name}
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="size-4" />
          </li>
          <li aria-current="page">{position.title}</li>
        </ol>
      </nav>

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <div className="flex items-center gap-3">
            <CompanyLogo
              companyId={company.id}
              logo={company.logo}
              name={company.name}
              className="size-11 border border-cream/25"
              iconClassName="size-5"
            />
            <Link to={`/kompanite/${company.id}`} className="font-semibold underline-offset-4 hover:underline">
              {company.name}
            </Link>
          </div>

          <h1 className="mt-6 font-display text-5xl leading-[1.05] font-medium tracking-tight sm:text-6xl">
            {position.title}
          </h1>
          <p className="mt-5 text-xl leading-relaxed text-cream/80">{position.description}</p>

          <h2 className="mt-10 font-display text-2xl font-medium">Përgjegjësitë</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-lg leading-relaxed text-cream/80 marker:text-terracotta">
            {position.responsibilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          {position.requirements?.length > 0 && (
            <>
              <h2 className="mt-10 font-display text-2xl font-medium">Kriteret e studentit</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-lg leading-relaxed text-cream/80 marker:text-terracotta">
                {position.requirements.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </>
          )}

          <h2 className="mt-10 font-display text-2xl font-medium">Aftësitë e kërkuara</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {position.skills.map((skill) => (
              <li key={skill} className="border border-cream/30 px-3 py-1.5 text-sm">
                {skill}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-5 lg:col-span-5">
          <div className="bg-cream p-6 text-charcoal lg:p-8">
            <StatusBadge status={position.status} />
            <div className="mt-5">
              <PositionFacts position={position} />
            </div>
          </div>

          <section id="apliko" aria-labelledby="apliko-titull" className="bg-cream p-6 text-charcoal lg:p-8">
            <h2 id="apliko-titull" className="mb-5 font-display text-2xl font-medium tracking-tight">
              Apliko për këtë pozitë
            </h2>
            {position.canApply && user?.role === 'student' && user.profile?.approved === false ? (
              <p role="status" className="border-l-4 border-terracotta pl-4 leading-relaxed">
                Për të aplikuar duhet të jesh i verifikuar nga universiteti yt.{' '}
                <Link to="/student#verifikimi" className="font-semibold underline underline-offset-4">
                  Kërko verifikimin
                </Link>
              </p>
            ) : position.canApply ? (
              <div><p className="mb-4 text-sm leading-relaxed text-charcoal/70">Dërgo profilin dhe dokumentet mbështetëse te {company.name}.</p><button type="button" onClick={() => user?.role === 'student' ? setIsApplyOpen(true) : setShowStudentAccountPrompt(true)} className="min-h-12 w-full bg-charcoal px-6 py-3 font-semibold text-cream transition-colors hover:bg-navy">Apliko Tani</button></div>
            ) : (
              <p role="status" className="border-l-4 border-terracotta pl-4 leading-relaxed">
                Afati i aplikimit ka përfunduar ose nuk ka më vende të lira. Kjo pozitë nuk pranon më aplikime.
              </p>
            )}
          </section>
        </div>
      </div>
      {showStudentAccountPrompt && <div className="fixed inset-0 z-[70] grid place-items-center bg-charcoal/75 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowStudentAccountPrompt(false); }}><section role="dialog" aria-modal="true" aria-labelledby="student-account-title" className="w-full max-w-md rounded-2xl border border-cream/15 bg-charcoal p-6 text-cream shadow-2xl sm:p-8"><p className="text-xs font-semibold tracking-[0.16em] text-cream/55 uppercase">Aplikimi për praktikë</p><h2 id="student-account-title" className="mt-2 font-display text-3xl">Apliko si student</h2><p className="mt-3 leading-relaxed text-cream/70">Për të aplikuar në këtë pozitë, duhet të kyçesh me llogari studenti.</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><Link to={`/hyr/student?next=${encodeURIComponent(`/kompanite/${companyId}/pozitat/${positionId}`)}`} className="inline-flex min-h-12 items-center justify-center rounded-xl bg-cream px-4 py-3 text-center font-semibold text-charcoal hover:bg-cream/85">Kam llogari — Kyçu</Link><Link to="/regjistrohu/student" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-cream/25 px-4 py-3 text-center font-semibold hover:bg-cream/10">Regjistrohu si student</Link></div><button type="button" onClick={() => setShowStudentAccountPrompt(false)} className="mt-4 min-h-10 w-full text-sm font-medium text-cream/55 hover:text-cream">Mbyll</button></section></div>}
      {isApplyOpen && <ApplicationModal internship={{ ...position, company: company.name }} studentName={[readStudentProfile(user).firstName, readStudentProfile(user).lastName].filter(Boolean).join(' ') || 'Student/e'} cvName={readStudentProfile(user).documents?.cv} onClose={() => setIsApplyOpen(false)} onSubmit={(details) => applicationUseCases.applyToInternship(actor, { internshipId: position.id, ...details, student: applicantDetails(readStudentProfile(user)) })} />}
    </Container>
  );
}
